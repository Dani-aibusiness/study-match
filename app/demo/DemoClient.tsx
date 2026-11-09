"use client";

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DEMO_STEPS } from "@/lib/siteContent";

export default function DemoClient() {
  const [step, setStep] = useState(0);
  const s = DEMO_STEPS[step];

  const [name, setName] = useState("");
  const [completed, setCompleted] = useState<boolean | null>(null);
  const [clarity, setClarity] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 1) {
      setStatus("error");
      setMessage("Please add your first name.");
      return;
    }
    if (completed === null) {
      setStatus("error");
      setMessage("Please say whether you could finish the walkthrough.");
      return;
    }
    if (clarity < 1) {
      setStatus("error");
      setMessage("Please choose a clarity rating from 1 to 5.");
      return;
    }
    setStatus("saving");
    const { error } = await supabase.from("tester_feedback").insert({
      tester_name: name.trim().slice(0, 40),
      completed_task: completed,
      clarity,
      comment: comment.trim() ? comment.trim().slice(0, 500) : null,
    });
    if (error) {
      setStatus("error");
      setMessage(`Could not save: ${error.message}`);
    } else {
      setStatus("saved");
      setMessage("Thank you. Your feedback was saved and appears on the dashboard.");
    }
  }

  return (
    <>
      {/* Stepper */}
      <div className="mt-8 flex gap-2" role="tablist" aria-label="Demo steps">
        {DEMO_STEPS.map((d, i) => (
          <button
            key={d.title}
            type="button"
            role="tab"
            aria-selected={i === step}
            aria-label={d.title}
            onClick={() => setStep(i)}
            className={`h-2 flex-1 rounded-full transition ${
              i === step ? "bg-emerald-500" : i < step ? "bg-emerald-900" : "bg-slate-800"
            }`}
          />
        ))}
      </div>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400">
          Step {step + 1} of {DEMO_STEPS.length}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-white">{s.title}</h2>
        <p className="mt-3 text-slate-300">{s.what}</p>
        <p className="mt-3 text-sm text-slate-400">
          <span className="font-semibold text-slate-300">What to look for: </span>
          {s.lookFor}
        </p>
        <Link
          href={s.href}
          className="mt-5 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {s.linkLabel} &rarr;
        </Link>
      </section>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((n) => n - 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:opacity-40"
        >
          Back
        </button>
        <button
          type="button"
          disabled={step === DEMO_STEPS.length - 1}
          onClick={() => setStep((n) => n + 1)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:opacity-40"
        >
          Next
        </button>
      </div>

      {/* Tester feedback */}
      <section className="mt-12 rounded-xl border border-emerald-900 bg-emerald-950/20 p-6">
        <h2 className="text-lg font-semibold text-white">
          Tried it? Leave feedback
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Use your first name only. Your answers are shown on the dashboard.
          Please do not type personal details.
        </p>

        {status === "saved" ? (
          <p className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/40 p-4 text-sm text-emerald-300">
            {message}{" "}
            <Link href="/dashboard" className="underline">
              See the dashboard
            </Link>
          </p>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="t-name" className="block text-sm font-medium text-slate-200">
                First name
              </label>
              <input
                id="t-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white sm:w-72"
              />
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-slate-200">
                Could you finish the walkthrough without help?
              </legend>
              <div className="mt-2 flex gap-3">
                {[
                  { label: "Yes", value: true },
                  { label: "No", value: false },
                ].map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    aria-pressed={completed === o.value}
                    onClick={() => setCompleted(o.value)}
                    className={`rounded-md border px-4 py-1.5 text-sm ${
                      completed === o.value
                        ? "border-emerald-500 bg-emerald-500/20 text-white"
                        : "border-slate-700 text-slate-300"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-medium text-slate-200">
                How clear was it? (1 = confusing, 5 = very clear)
              </legend>
              <div className="mt-2 flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={clarity === n}
                    onClick={() => setClarity(n)}
                    className={`h-9 w-9 rounded-md border text-sm ${
                      clarity === n
                        ? "border-emerald-500 bg-emerald-500/20 text-white"
                        : "border-slate-700 text-slate-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="t-comment" className="block text-sm font-medium text-slate-200">
                Comment (optional)
              </label>
              <textarea
                id="t-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
                rows={3}
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>

            {status === "error" && (
              <p className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-400">
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "saving"}
              className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
            >
              {status === "saving" ? "Saving..." : "Send feedback"}
            </button>
          </form>
        )}
      </section>
    </>
  );
}
