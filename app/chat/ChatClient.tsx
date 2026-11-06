"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  SUBJECTS,
  URGENCY_OPTIONS,
  Subject,
  Urgency,
  checkGuardrail,
  validateStuck,
  buildResponse,
  urgencyLabel,
} from "@/lib/chatLogic";

type Msg = {
  id: number;
  role: "bot" | "user";
  text: string;
  tone?: "normal" | "guardrail";
  plan?: string[];
  // What gets saved to the database if different from what is shown
  // (blocked messages are never stored verbatim).
  saveText?: string;
};

type Stage = "subject" | "stuck" | "urgency" | "checkpoint" | "done";
type Outcome = "answered" | "escalated" | "checkpoint_declined";

type Props = { initialUp: number; initialDown: number };

const GREETING: Omit<Msg, "id">[] = [
  {
    role: "bot",
    text: "Hi! I'm the StudyMatch guided assistant. I'm scripted, not an AI model. I'll ask 3 quick questions and then suggest a first-step plan.",
  },
  { role: "bot", text: "Question 1 of 3: What subject is this about?" },
];

export default function ChatClient({ initialUp, initialDown }: Props) {
  const idCounter = useRef(0);
  const messagesRef = useRef<Msg[]>([]);
  const guardrailCount = useRef(0);
  const sessionId = useRef<string>("");
  const urgencyRef = useRef<Urgency>("week");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [stage, setStage] = useState<Stage>("subject");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [stuck, setStuck] = useState("");
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [tester, setTester] = useState("");

  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [comment, setComment] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);

  function push(newMsgs: Omit<Msg, "id">[]) {
    const withIds = newMsgs.map((m) => ({ ...m, id: ++idCounter.current }));
    messagesRef.current = [...messagesRef.current, ...withIds];
    setMessages(messagesRef.current);
  }

  function startOver() {
    idCounter.current = 0;
    messagesRef.current = [];
    guardrailCount.current = 0;
    sessionId.current = crypto.randomUUID();
    setMessages([]);
    setStage("subject");
    setSubject(null);
    setStuck("");
    setInput("");
    setInputError(null);
    setSaveNotice(null);
    setRating(null);
    setComment("");
    setFeedbackSent(false);
    setFeedbackError(null);
    push(GREETING);
  }

  // first load
  useEffect(() => {
    startOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, stage]);

  async function saveSession(ctx: {
    subject: Subject;
    stuck: string;
    urgency: Urgency;
    outcome: Outcome;
  }) {
    const { error } = await supabase.from("chat_sessions").insert({
      id: sessionId.current,
      tester_label: tester.trim() || null,
      subject: ctx.subject,
      stuck_summary: ctx.stuck.trim().slice(0, 200),
      urgency: ctx.urgency,
      outcome: ctx.outcome,
      needs_human_review: ctx.outcome === "escalated",
      guardrail_count: guardrailCount.current,
      transcript: messagesRef.current.map((m) => ({
        role: m.role,
        text: m.saveText ?? m.text,
      })),
    });
    if (error) {
      setSaveNotice(`This chat could not be saved: ${error.message}`);
    }
  }

  function chooseSubject(s: Subject) {
    setSubject(s);
    push([
      { role: "user", text: s },
      {
        role: "bot",
        text: "Question 2 of 3: What exactly are you stuck on? Describe it in a sentence or two.",
      },
    ]);
    setStage("stuck");
  }

  function submitStuck(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    setInputError(null);

    const guard = checkGuardrail(text);
    if (guard) {
      guardrailCount.current += 1;
      push([
        { role: "user", text, saveText: `[blocked: ${guard.kind}]` },
        { role: "bot", text: guard.reply, tone: "guardrail" },
      ]);
      setInput("");
      return;
    }

    const v = validateStuck(text);
    if (!v.ok) {
      setInputError(v.error);
      return;
    }

    setStuck(text);
    setInput("");
    push([
      { role: "user", text },
      { role: "bot", text: "Question 3 of 3: How urgent is it?" },
    ]);
    setStage("urgency");
  }

  async function chooseUrgency(u: Urgency) {
    if (!subject) return;
    const res = buildResponse({ subject, stuck, urgency: u });

    push([
      { role: "user", text: urgencyLabel(u) },
      { role: "bot", text: res.intro, plan: res.plan },
    ]);

    if (res.needsCheckpoint) {
      push([
        {
          role: "bot",
          text: `Human checkpoint: because ${res.checkpointReason}, a person may help more than a plan can. Do you want this sent to a human tutor for review? Nothing is booked automatically.`,
        },
      ]);
      setStage("checkpoint");
      // remember the urgency for the save step
      urgencyRef.current = u;
      return;
    }

    push([{ role: "bot", text: "That's the plan. Was it helpful? Please rate below." }]);
    setStage("done");
    await saveSession({ subject, stuck, urgency: u, outcome: "answered" });
  }

  async function decideCheckpoint(sendToHuman: boolean) {
    if (!subject) return;
    const outcome: Outcome = sendToHuman ? "escalated" : "checkpoint_declined";
    push([
      { role: "user", text: sendToHuman ? "Yes, send it to a human" : "No, I'll try the plan first" },
      {
        role: "bot",
        text: sendToHuman
          ? "Done. I've flagged this chat for human review. A person will look at it before any tutor is matched. Nothing has been booked."
          : "Okay, try the plan first. You can start over any time if you get stuck again.",
      },
      { role: "bot", text: "Was this helpful? Please rate below." },
    ]);
    setStage("done");
    await saveSession({ subject, stuck, urgency: urgencyRef.current, outcome });
  }

  async function submitFeedback() {
    if (!rating) {
      setFeedbackError("Pick thumbs up or thumbs down first.");
      return;
    }
    setFeedbackError(null);
    const { error } = await supabase.from("chat_feedback").insert({
      session_id: sessionId.current,
      rating,
      comment: comment.trim() || null,
    });
    if (error) {
      setFeedbackError(`Feedback could not be saved: ${error.message}`);
      return;
    }
    setFeedbackSent(true);
    if (rating === "up") setUp((n) => n + 1);
    else setDown((n) => n + 1);
  }

  const chip =
    "rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-500 hover:text-emerald-300";

  return (
    <div className="mt-10">
      <div className="rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="border-b border-slate-800 px-5 py-3">
          <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
            Guided assistant · scripted, not an AI model
          </span>
        </div>
        <div className="border-b border-slate-800 bg-slate-950/40 px-5 py-4">
          <label htmlFor="tester-name" className="block text-sm font-semibold text-slate-200">
            Testing StudyMatch? Add your first name so your chat appears in the test log
          </label>
          <input
            id="tester-name"
            value={tester}
            onChange={(e) => setTester(e.target.value)}
            maxLength={40}
            placeholder="First name (optional)"
            className="mt-2 w-full rounded-md border border-emerald-500/40 bg-slate-950 px-3 py-2 text-sm text-white sm:w-72"
          />
        </div>

        <div className="max-h-[28rem] space-y-4 overflow-y-auto p-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-slate-950"
                    : m.tone === "guardrail"
                    ? "border border-amber-500/50 bg-amber-950/40 text-amber-100"
                    : "bg-slate-800 text-slate-100"
                }`}
              >
                <p>{m.text}</p>
                {m.plan && (
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    {m.plan.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-slate-800 p-5">
          {stage === "subject" && (
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button key={s} type="button" onClick={() => chooseSubject(s)} className={chip}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {stage === "stuck" && (
            <form onSubmit={submitStuck}>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={600}
                  placeholder="e.g. I don't understand how to set up this integral"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Send
                </button>
              </div>
              {inputError && <p className="mt-2 text-sm text-red-400">{inputError}</p>}
            </form>
          )}

          {stage === "urgency" && (
            <div className="flex flex-wrap gap-2">
              {URGENCY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => chooseUrgency(o.value)}
                  className={chip}
                >
                  {o.label}
                </button>
              ))}
            </div>
          )}

          {stage === "checkpoint" && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decideCheckpoint(true)}
                className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Yes, send it to a human
              </button>
              <button type="button" onClick={() => decideCheckpoint(false)} className={chip}>
                No, I'll try the plan first
              </button>
            </div>
          )}

          {stage === "done" && (
            <div>
              {saveNotice && <p className="mb-3 text-sm text-red-400">{saveNotice}</p>}
              {!feedbackSent ? (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRating("up")}
                      className={`${chip} ${rating === "up" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : ""}`}
                    >
                      👍 Helpful
                    </button>
                    <button
                      type="button"
                      onClick={() => setRating("down")}
                      className={`${chip} ${rating === "down" ? "border-emerald-500 bg-emerald-500/10 text-emerald-300" : ""}`}
                    >
                      👎 Not helpful
                    </button>
                  </div>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={500}
                    rows={2}
                    placeholder="Anything confusing or missing? (optional)"
                    className="mt-3 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                  {feedbackError && <p className="mt-2 text-sm text-red-400">{feedbackError}</p>}
                  <button
                    type="button"
                    onClick={submitFeedback}
                    className="mt-3 rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  >
                    Send feedback
                  </button>
                </div>
              ) : (
                <p className="text-sm text-emerald-300">Thanks, your feedback was saved.</p>
              )}
              <button
                type="button"
                onClick={startOver}
                className="mt-4 text-sm font-semibold text-slate-400 underline hover:text-white"
              >
                Start over
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Feedback so far: 👍 {up} · 👎 {down}
      </p>
    </div>
  );
}
