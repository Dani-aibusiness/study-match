import { IMPACT_CLAIMS, RISKS } from "@/lib/siteContent";

export default function ImpactPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Practical impact check</h1>
      <p className="mt-2 text-slate-400">
        What StudyMatch might achieve, what we can actually measure today, and
        where it could cause harm. Claims are only marked as supported when
        there is data behind them.
      </p>

      <h2 className="mt-10 text-xl font-semibold text-white">Value claims</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3">Claim</th>
              <th className="p-3">How it would be measured</th>
              <th className="p-3">Status today</th>
            </tr>
          </thead>
          <tbody className="text-slate-400">
            {IMPACT_CLAIMS.map((c) => (
              <tr key={c.claim} className="border-t border-slate-800 align-top">
                <td className="p-3 text-slate-200">{c.claim}</td>
                <td className="p-3">{c.measure}</td>
                <td className="p-3">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 text-xl font-semibold text-white">Risks and safeguards</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900 text-slate-300">
            <tr>
              <th className="p-3">Risk</th>
              <th className="p-3">Safeguard in place</th>
              <th className="p-3">Remaining limit</th>
            </tr>
          </thead>
          <tbody className="text-slate-400">
            {RISKS.map((r) => (
              <tr key={r.risk} className="border-t border-slate-800 align-top">
                <td className="p-3 text-slate-200">{r.risk}</td>
                <td className="p-3">{r.safeguard}</td>
                <td className="p-3">{r.limit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 rounded-xl border border-amber-900 bg-amber-950/30 p-4 text-sm text-amber-200">
        Honest limit: this is a student prototype tested with a small number of
        people. It shows the product works and where the risks are. It does not
        prove learning outcomes or demand.
      </p>
    </main>
  );
}
