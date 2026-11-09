import { NOT_DOING, ROADMAP } from "@/lib/siteContent";

export default function RoadmapPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Version 2 roadmap</h1>
      <p className="mt-2 text-slate-400">
        Each item says what evidence would justify building it, so we build
        what testers need and not just what sounds good.
      </p>

      <div className="mt-8 space-y-6">
        {ROADMAP.map((p) => (
          <section key={p.phase} className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-semibold text-emerald-400">{p.phase}</h2>
            <ul className="mt-3 space-y-3">
              {p.items.map((i) => (
                <li key={i.what}>
                  <p className="font-medium text-white">{i.what}</p>
                  <p className="text-sm text-slate-400">{i.why}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-white">What we will not do yet</h2>
      <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-400">
        {NOT_DOING.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </main>
  );
}
