"use client";

import { useMemo, useState } from "react";
import type { Competitor } from "./page";

const typeColor: Record<string, string> = {
  Global: "text-sky-400 border-sky-900 bg-sky-950/40",
  "Mexico-LatAm": "text-emerald-400 border-emerald-900 bg-emerald-950/40",
  Adjacent: "text-amber-400 border-amber-900 bg-amber-950/40",
};

export default function ResearchClient({
  competitors,
}: {
  competitors: Competitor[];
}) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const types = useMemo(
    () => ["All", ...Array.from(new Set(competitors.map((c) => c.type)))],
    [competitors]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return competitors.filter((c) => {
      const matchesType = typeFilter === "All" || c.type === typeFilter;
      const matchesQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.strength.toLowerCase().includes(q) ||
        c.gap.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [competitors, query, typeFilter]);

  return (
    <div className="mt-8 space-y-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, strength, or gap..."
          className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white focus:border-emerald-600 focus:outline-none"
        >
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price model</th>
              <th className="px-4 py-3 font-medium">Strength</th>
              <th className="px-4 py-3 font-medium">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((c) => (
              <tr key={c.id} className="align-top hover:bg-slate-900/40">
                <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs ${
                      typeColor[c.type] ??
                      "text-slate-400 border-slate-800 bg-slate-900/40"
                    }`}
                  >
                    {c.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{c.category}</td>
                <td className="px-4 py-3 text-slate-300">{c.price_model}</td>
                <td className="px-4 py-3 text-slate-400">{c.strength}</td>
                <td className="px-4 py-3 text-slate-400">{c.gap}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No competitors match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Risk map */}
      <RiskMap competitors={competitors} />

      {/* Benchmark cards */}
      <div>
        <h2 className="text-xl font-semibold text-white">Benchmark cards</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {competitors.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-white">{c.name}</h3>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    typeColor[c.type] ??
                    "text-slate-400 border-slate-800 bg-slate-900/40"
                  }`}
                >
                  {c.type}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                {c.category} • {c.price_model}
              </p>
              <p className="mt-3 text-sm text-slate-300">
                <span className="font-medium text-emerald-400">Strength: </span>
                {c.strength}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                <span className="font-medium text-amber-400">Gap: </span>
                {c.gap}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RiskMap({ competitors }: { competitors: Competitor[] }) {
  const width = 640;
  const height = 400;
  const padding = 48;

  const toX = (v: number) => padding + (v / 10) * (width - padding * 2);
  const toY = (v: number) => height - padding - (v / 10) * (height - padding * 2);

  // Identified gap zone: low-moderate cost, moderate-high verification
  const gapX1 = toX(3);
  const gapX2 = toX(5);
  const gapY1 = toY(9);
  const gapY2 = toY(6);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Risk map</h2>
      <p className="mt-1 text-sm text-slate-400">
        X: cost to student (free → paid). Y: depth of verification of actual
        understanding (low → high).
      </p>
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[560px]">
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#334155"
            strokeWidth={1}
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#334155"
            strokeWidth={1}
          />
          <text
            x={width / 2}
            y={height - 12}
            textAnchor="middle"
            fontSize={12}
            fill="#64748b"
          >
            Cost to student (free → paid)
          </text>
          <text
            x={16}
            y={height / 2}
            textAnchor="middle"
            fontSize={12}
            fill="#64748b"
            transform={`rotate(-90 16 ${height / 2})`}
          >
            Verification of understanding (low → high)
          </text>

          <rect
            x={Math.min(gapX1, gapX2)}
            y={Math.min(gapY1, gapY2)}
            width={Math.abs(gapX2 - gapX1)}
            height={Math.abs(gapY2 - gapY1)}
            fill="#10b981"
            fillOpacity={0.12}
            stroke="#10b981"
            strokeDasharray="4 4"
          />
          <text
            x={(gapX1 + gapX2) / 2}
            y={Math.min(gapY1, gapY2) - 8}
            textAnchor="middle"
            fontSize={11}
            fill="#34d399"
          >
            Identified gap
          </text>

          <circle
            cx={toX(4)}
            cy={toY(7.5)}
            r={7}
            fill="#10b981"
            stroke="#022c22"
            strokeWidth={2}
          />
          <text
            x={toX(4) + 10}
            y={toY(7.5) + 4}
            fontSize={12}
            fill="#34d399"
            fontWeight={600}
          >
            StudyMatch (target)
          </text>

          {competitors.map((c) => (
            <g key={c.id}>
              <circle
                cx={toX(c.risk_x)}
                cy={toY(c.risk_y)}
                r={5}
                fill="#38bdf8"
                stroke="#0c4a6e"
                strokeWidth={1.5}
              />
              <text
                x={toX(c.risk_x) + 8}
                y={toY(c.risk_y) + 4}
                fontSize={11}
                fill="#cbd5e1"
              >
                {c.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
