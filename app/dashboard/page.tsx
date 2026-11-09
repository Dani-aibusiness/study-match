import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  subject: string;
  topic: string;
  level: string;
  urgency: string;
  summary: string;
  suggested_tutor_label: string;
  created_at: string;
};

type Stats = {
  submissions: number;
  competitors: number;
  pricing_scenarios: number;
  headline_votes: number;
  chat_sessions: number;
  chat_escalated: number;
  chat_needs_review: number;
  chat_guardrail_hits: number;
  chat_up: number;
  chat_down: number;
  tester_count: number;
  tester_completed: number;
  tester_avg_clarity: number | null;
  recent_chats: {
    tester_label: string | null;
    subject: string;
    urgency: string;
    outcome: string;
    needs_human_review: boolean;
    created_at: string;
  }[];
  recent_testers: {
    tester_name: string;
    completed_task: boolean;
    clarity: number;
    comment: string | null;
    created_at: string;
  }[];
};

const urgencyColor: Record<string, string> = {
  high: "text-red-400 border-red-900 bg-red-950/40",
  medium: "text-amber-400 border-amber-900 bg-amber-950/40",
  low: "text-slate-400 border-slate-800 bg-slate-900/40",
};

function Tile({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default async function DashboardPage() {
  const [statsRes, subsRes] = await Promise.all([
    supabase.rpc("dashboard_stats"),
    supabase
      .from("submissions")
      .select("id, subject, topic, level, urgency, summary, suggested_tutor_label, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const stats = (statsRes.data ?? null) as Stats | null;
  const submissions = (subsRes.data ?? []) as Submission[];

  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      <p className="mt-2 text-slate-400">
        Live records from every module. Private chat transcripts are never
        shown here.
      </p>

      {statsRes.error && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load stats: {statsRes.error.message}. Check that the Week 6
          SQL migration was run.
        </p>
      )}

      {stats && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-white">Activity</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile label="Help requests" value={stats.submissions} />
            <Tile label="Chats finished" value={stats.chat_sessions} />
            <Tile label="Pricing scenarios saved" value={stats.pricing_scenarios} />
            <Tile label="Marketing votes" value={stats.headline_votes} />
            <Tile label="Competitors researched" value={stats.competitors} />
            <Tile
              label="Chats sent to a human"
              value={stats.chat_escalated}
              hint="Student chose a human tutor"
            />
            <Tile
              label="Messages blocked"
              value={stats.chat_guardrail_hits}
              hint="Crisis, personal data or cheating"
            />
            <Tile
              label="Chat thumbs"
              value={`${stats.chat_up} up / ${stats.chat_down} down`}
            />
          </div>

          <h2 className="mt-10 text-lg font-semibold text-white">Testing summary</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <Tile
              label="Testers (feedback form)"
              value={`${stats.tester_count} / 5`}
              hint="Target: 5 external users"
            />
            <Tile
              label="Finished without help"
              value={
                stats.tester_count > 0
                  ? `${stats.tester_completed} of ${stats.tester_count}`
                  : "No data yet"
              }
            />
            <Tile
              label="Average clarity (1 to 5)"
              value={stats.tester_avg_clarity ?? "No data yet"}
            />
          </div>

          {stats.recent_testers.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="p-3">Tester</th>
                    <th className="p-3">Finished</th>
                    <th className="p-3">Clarity</th>
                    <th className="p-3">Comment</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {stats.recent_testers.map((t, i) => (
                    <tr key={i} className="border-t border-slate-800 align-top">
                      <td className="p-3 text-slate-200">{t.tester_name}</td>
                      <td className="p-3">{t.completed_task ? "Yes" : "No"}</td>
                      <td className="p-3">{t.clarity}</td>
                      <td className="p-3">{t.comment ?? "—"}</td>
                      <td className="p-3 whitespace-nowrap">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {stats.tester_count === 0 && (
            <p className="mt-4 text-sm text-slate-500">
              No tester feedback yet. Testers can use the form on{" "}
              <Link href="/demo" className="text-emerald-400 underline">
                /demo
              </Link>
              .
            </p>
          )}

          <h2 className="mt-10 text-lg font-semibold text-white">Recent chats</h2>
          {stats.recent_chats.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No chats yet. Try{" "}
              <Link href="/chat" className="text-emerald-400 underline">
                /chat
              </Link>
              .
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-slate-300">
                  <tr>
                    <th className="p-3">Tester</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Urgency</th>
                    <th className="p-3">Outcome</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {stats.recent_chats.map((c, i) => (
                    <tr key={i} className="border-t border-slate-800">
                      <td className="p-3 text-slate-200">{c.tester_label || "—"}</td>
                      <td className="p-3">{c.subject}</td>
                      <td className="p-3">{c.urgency}</td>
                      <td className="p-3">{c.outcome.replace("_", " ")}</td>
                      <td className="p-3 whitespace-nowrap">
                        {new Date(c.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <h2 className="mt-10 text-lg font-semibold text-white">Past help requests</h2>
      {subsRes.error && (
        <p className="mt-3 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load submissions: {subsRes.error.message}
        </p>
      )}
      {!subsRes.error && submissions.length === 0 && (
        <p className="mt-3 text-slate-500">
          No submissions yet. Go to{" "}
          <Link href="/core" className="text-emerald-400 underline">
            Get Help
          </Link>{" "}
          to create one.
        </p>
      )}
      <div className="mt-3 space-y-4">
        {submissions.map((s) => (
          <div key={s.id} className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold text-white">
                {s.subject} — {s.topic}
              </h3>
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                  urgencyColor[s.urgency] ?? urgencyColor.low
                }`}
              >
                {s.urgency} urgency
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-400">{s.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>Level: {s.level}</span>
              <span>•</span>
              <span>Suggested: {s.suggested_tutor_label}</span>
              <span>•</span>
              <span>{new Date(s.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
