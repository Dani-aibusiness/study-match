import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center">
        <span className="mb-5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm font-medium text-emerald-400">
          For students & peer tutors
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Stuck on homework? Get matched fast.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Upload a photo of what you&apos;re stuck on or describe it — StudyMatch
          classifies the subject, topic and urgency, and points you to the
          right kind of peer tutor.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/core"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Get help now
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500"
          >
            View past submissions
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            title: "Describe or upload",
            desc: "Type what you're stuck on, or snap a photo of the problem.",
          },
          {
            title: "AI classification",
            desc: "We detect subject, topic, level and urgency automatically.",
          },
          {
            title: "Suggested tutor type",
            desc: "A rule-based starting point — live matching comes later.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-slate-800 bg-slate-900/40 p-6"
          >
            <h3 className="font-semibold text-white">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
