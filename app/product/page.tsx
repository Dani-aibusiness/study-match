type Tier = {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    tagline: "Try it out",
    features: [
      "3 AI homework questions / month",
      "Subject + topic classification",
      "No tutor matching",
      "No saved history",
    ],
  },
  {
    name: "Plus",
    price: "$99 MXN/mo",
    tagline: "For regular use",
    highlight: true,
    features: [
      "Unlimited AI homework help",
      "Pay-per-session tutor matching",
      "Saved question history",
      "Priority response time",
    ],
  },
  {
    name: "Pro",
    price: "$199 MXN/mo",
    tagline: "For exam season",
    features: [
      "Unlimited AI homework help",
      "2 free tutor sessions / month included",
      "Saved history + progress tracking",
      "Priority response time",
    ],
  },
];

const institutionTier = {
  name: "Institution",
  price: "From $39 MXN / student / mo",
  tagline: "Bulk licensing for universities",
  features: [
    "All Pro features for every enrolled student",
    "Volume pricing at scale",
    "Admin usage dashboard (future scope)",
    "Single invoice for the institution",
  ],
};

export default function ProductPage() {
  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Product &amp; pricing tiers</h1>
      <p className="mt-2 text-slate-400">
        Two customer segments: individual students, and universities buying in bulk.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-white">
        Segment 1 — Individual students
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-5 ${
              tier.highlight
                ? "border-emerald-600 bg-emerald-950/20"
                : "border-slate-800 bg-slate-900/40"
            }`}
          >
            <h3 className="font-semibold text-white">{tier.name}</h3>
            <p className="mt-1 text-2xl font-bold text-emerald-400">{tier.price}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
              {tier.tagline}
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-emerald-400">&#10003;</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xl font-semibold text-white">
        Segment 2 — Universities / institutions
      </h2>
      <div className="mt-4 max-w-md rounded-xl border border-sky-900 bg-sky-950/20 p-5">
        <h3 className="font-semibold text-white">{institutionTier.name}</h3>
        <p className="mt-1 text-2xl font-bold text-sky-400">{institutionTier.price}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
          {institutionTier.tagline}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          {institutionTier.features.map((f) => (
            <li key={f} className="flex gap-2">
              <span className="text-sky-400">&#10003;</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Want to model what this actually earns?{" "}
        <a href="/pricing" className="text-emerald-400 underline">
          Try the revenue simulator
        </a>
        .
      </p>
    </main>
  );
}
