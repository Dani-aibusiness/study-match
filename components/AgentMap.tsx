import { AGENT_MAP } from "@/lib/siteContent";

const kindStyle: Record<string, string> = {
  "Rule-based (no AI)": "border-sky-900 bg-sky-950/40 text-sky-300",
  "Human decision": "border-emerald-800 bg-emerald-950/40 text-emerald-300",
  Database: "border-violet-900 bg-violet-950/40 text-violet-300",
  Page: "border-slate-700 bg-slate-900 text-slate-300",
};

export default function AgentMap() {
  return (
    <div>
      <p className="text-sm text-slate-400">
        Every step of the assistant, who or what makes each decision, and what
        happens when it fails. There is no AI model in this flow: the
        &ldquo;agents&rdquo; are fixed rules, and the only judgment calls are
        made by the student and by the people who read the dashboard.
      </p>
      <ol className="mt-6 space-y-3">
        {AGENT_MAP.map((n, i) => (
          <li key={n.name}>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-white">
                  {i + 1}. {n.name}
                </h3>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${kindStyle[n.kind]}`}
                >
                  {n.kind}
                </span>
              </div>
              <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="font-medium text-slate-300">What it does</dt>
                  <dd className="mt-1 text-slate-400">{n.does}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-300">Who decides</dt>
                  <dd className="mt-1 text-slate-400">{n.decides}</dd>
                </div>
                <div>
                  <dt className="font-medium text-slate-300">If it fails</dt>
                  <dd className="mt-1 text-slate-400">{n.ifItFails}</dd>
                </div>
              </dl>
            </div>
            {i < AGENT_MAP.length - 1 && (
              <div className="py-1 text-center text-slate-600" aria-hidden="true">
                ↓
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
