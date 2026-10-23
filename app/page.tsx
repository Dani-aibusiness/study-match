import Link from "next/link";

const features = [
  {
    title: "AI explains first",
    body: "Upload or describe your homework and get a Socratic walkthrough — not just a flat answer you can't learn from.",
  },
  {
    title: "Human tutors when you need them",
    body: "Still stuck after the AI explanation? You're matched to a real peer tutor instead of guessing on your own.",
  },
  {
    title: "Built for real course loads",
    body: "Classify, track, and revisit every question you've asked from your dashboard — no more lost chat threads.",
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
          For students who want to actually learn it
        </span>
        <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
          Stuck on homework? Think it through before you give up.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-400">
          StudyMatch pairs Socratic AI explanations with real peer tutors, so
          you actually learn — not just copy an answer.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/core"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Get Help Now
          </Link>
          <Link
            href="/marketing"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500"
          >
            See how it works
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
