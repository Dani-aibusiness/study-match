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

const urgencyColor: Record<string, string> = {
  high: "text-red-400 border-red-900 bg-red-950/40",
  medium: "text-amber-400 border-amber-900 bg-amber-950/40",
  low: "text-slate-400 border-slate-800 bg-slate-900/40",
};

export default async function DashboardPage() {
  const { data, error } = await supabase
    .from("submissions")
    .select("id, subject, topic, level, urgency, summary, suggested_tutor_label, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const submissions = (data ?? []) as Submission[];

  const { data: competitorRows } = await supabase
    .from("competitors")
    .select("type");

  const competitorCount = competitorRows?.length ?? 0;
  const mexicoCount =
    competitorRows?.filter((c) => c.type === "Mexico-LatAm").length ?? 0;

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Past submissions</h1>
      <p className="mt-2 text-slate-400">
        Every intake goes through classification and lands here.
      </p>

      {/* Research summary widget */}
      {competitorCount > 0 && (
        <div className="mt-6 rounded-xl border border-emerald-900 bg-emerald-950/30 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-400">
            Research snapshot
          </h2>
          <p className="mt-2 text-sm text-slate-300">
            {competitorCount} competitors/substitutes analyzed, {mexicoCount}{" "}
            Mexico-LatAm localized. Identified gap: affordable AI-first
            verification with human fallback — occupied by no researched
            competitor.{" "}
            <a href="/research" className="text-emerald-400 underline">
              View full research
            </a>
            .
          </p>
        </div>
      )}

      {error && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load submissions: {error.message}
        </p>
      )}

      {!error && submissions.length === 0 && (
        <p className="mt-8 text-slate-500">
          No submissions yet — go to{" "}
          <a href="/core" className="text-emerald-400 underline">
            Get Help
          </a>{" "}
          to create one.
        </p>
      )}

      <div className="mt-8 space-y-4">
        {submissions.map((s) => (
          <div
            key={s.id}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"
          >
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
