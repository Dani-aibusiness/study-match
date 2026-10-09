"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { PricingScenario } from "./page";

type Segment = "individual" | "institution";
type PresetName = "Conservative" | "Optimistic" | "Custom";

type IndividualInputs = {
  totalUsers: number;
  pctFree: number;
  pctPlus: number;
  pctPro: number;
  pricePlus: number;
  pricePro: number;
};

type InstitutionInputs = {
  totalSeats: number;
  pricePerSeat: number;
};

const PRESETS: Record<
  Exclude<PresetName, "Custom">,
  { individual: IndividualInputs; institution: InstitutionInputs }
> = {
  Conservative: {
    individual: { totalUsers: 500, pctFree: 70, pctPlus: 25, pctPro: 5, pricePlus: 99, pricePro: 199 },
    institution: { totalSeats: 200, pricePerSeat: 29 },
  },
  Optimistic: {
    individual: { totalUsers: 5000, pctFree: 40, pctPlus: 40, pctPro: 20, pricePlus: 99, pricePro: 199 },
    institution: { totalSeats: 2000, pricePerSeat: 39 },
  },
};

// Pricing logic — kept as plain functions so they're easy to test in isolation.
export function calcIndividualMonthly(i: IndividualInputs): number {
  const plusUsers = i.totalUsers * (i.pctPlus / 100);
  const proUsers = i.totalUsers * (i.pctPro / 100);
  return plusUsers * i.pricePlus + proUsers * i.pricePro;
}

export function calcInstitutionMonthly(i: InstitutionInputs): number {
  return i.totalSeats * i.pricePerSeat;
}

function money(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function PricingClient({
  initialScenarios,
}: {
  initialScenarios: PricingScenario[];
}) {
  const [segment, setSegment] = useState<Segment>("individual");
  const [preset, setPreset] = useState<PresetName>("Conservative");
  const [individual, setIndividual] = useState<IndividualInputs>(PRESETS.Conservative.individual);
  const [institution, setInstitution] = useState<InstitutionInputs>(PRESETS.Conservative.institution);
  const [label, setLabel] = useState("My scenario");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<PricingScenario[]>(initialScenarios);

  function applyPreset(name: Exclude<PresetName, "Custom">) {
    setPreset(name);
    setIndividual(PRESETS[name].individual);
    setInstitution(PRESETS[name].institution);
  }

  function updateIndividual<K extends keyof IndividualInputs>(key: K, value: number) {
    setPreset("Custom");
    setIndividual((prev) => ({ ...prev, [key]: value }));
  }

  function updateInstitution<K extends keyof InstitutionInputs>(key: K, value: number) {
    setPreset("Custom");
    setInstitution((prev) => ({ ...prev, [key]: value }));
  }

  const pctSum = individual.pctFree + individual.pctPlus + individual.pctPro;
  const pctValid = pctSum === 100;

  const monthlyRevenue = useMemo(() => {
    return segment === "individual"
      ? calcIndividualMonthly(individual)
      : calcInstitutionMonthly(institution);
  }, [segment, individual, institution]);

  const annualRevenue = monthlyRevenue * 12;

  const canSave = segment === "institution" || pctValid;

  async function handleSave() {
    setSaveError(null);
    if (!canSave) {
      setSaveError("Tier percentages must add up to 100 before saving.");
      return;
    }
    setSaving(true);
    try {
      const inputs = segment === "individual" ? individual : institution;
      const { data, error } = await supabase
        .from("pricing_scenarios")
        .insert({
          label: label.trim() || "Untitled scenario",
          segment,
          scenario_preset: preset,
          inputs,
          monthly_revenue: Math.round(monthlyRevenue),
          annual_revenue: Math.round(annualRevenue),
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (data) setScenarios((prev) => [data as PricingScenario, ...prev]);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save scenario.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-10">
      {/* Segment + preset toggle */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 rounded-lg border border-slate-800 p-1">
          {(["individual", "institution"] as Segment[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSegment(s)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                segment === s
                  ? "bg-emerald-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {s === "individual" ? "Individual students" : "Universities"}
            </button>
          ))}
        </div>

        <div className="flex gap-2 rounded-lg border border-slate-800 p-1">
          {(["Conservative", "Optimistic"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => applyPreset(p)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                preset === p
                  ? "bg-sky-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
          {preset === "Custom" && (
            <span className="rounded-md px-4 py-2 text-sm font-medium text-amber-400">
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Assumptions table */}
      <div>
        <h2 className="text-xl font-semibold text-white">Assumptions</h2>
        {segment === "individual" ? (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Assumption</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-3 text-slate-300">Total users</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={individual.totalUsers}
                      onChange={(e) => updateIndividual("totalUsers", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">% on Free</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={individual.pctFree}
                      onChange={(e) => updateIndividual("pctFree", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">% on Plus</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={individual.pctPlus}
                      onChange={(e) => updateIndividual("pctPlus", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">% on Pro</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={individual.pctPro}
                      onChange={(e) => updateIndividual("pctPro", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">Plus price (MXN/mo)</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={individual.pricePlus}
                      onChange={(e) => updateIndividual("pricePlus", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">Pro price (MXN/mo)</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={individual.pricePro}
                      onChange={(e) => updateIndividual("pricePro", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {!pctValid && (
              <p className="mt-2 text-sm text-red-400">
                Free + Plus + Pro percentages add up to {pctSum}%, not 100%. Adjust before saving.
              </p>
            )}
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Assumption</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="px-4 py-3 text-slate-300">Enrolled students (seats)</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={institution.totalSeats}
                      onChange={(e) => updateInstitution("totalSeats", Number(e.target.value))}
                      className="w-32 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-slate-300">Price per seat (MXN/mo)</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      value={institution.pricePerSeat}
                      onChange={(e) => updateInstitution("pricePerSeat", Number(e.target.value))}
                      className="w-24 rounded-md border border-slate-800 bg-slate-900/60 px-2 py-1 text-white focus:border-emerald-600 focus:outline-none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Calculated output */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-emerald-900 bg-emerald-950/20 p-5">
          <p className="text-sm text-slate-400">Monthly revenue</p>
          <p className="mt-1 text-3xl font-bold text-emerald-400">
            ${money(monthlyRevenue)} MXN
          </p>
        </div>
        <div className="rounded-xl border border-sky-900 bg-sky-950/20 p-5">
          <p className="text-sm text-slate-400">Annual revenue</p>
          <p className="mt-1 text-3xl font-bold text-sky-400">
            ${money(annualRevenue)} MXN
          </p>
        </div>
      </div>

      {/* Save scenario */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-lg font-semibold text-white">Save this scenario</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Scenario name"
            className="w-64 rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !canSave}
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save scenario"}
          </button>
        </div>
        {saveError && <p className="mt-2 text-sm text-red-400">{saveError}</p>}
      </div>

      {/* Saved scenarios */}
      <div>
        <h2 className="text-xl font-semibold text-white">Saved scenarios</h2>
        {scenarios.length === 0 ? (
          <p className="mt-4 text-slate-500">No scenarios saved yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/40 p-4"
              >
                <div>
                  <p className="font-medium text-white">{s.label}</p>
                  <p className="text-xs text-slate-500">
                    {s.segment === "individual" ? "Individual students" : "Universities"} •{" "}
                    {s.scenario_preset} • {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-emerald-400">${money(s.monthly_revenue)} MXN/mo</p>
                  <p className="text-sky-400">${money(s.annual_revenue)} MXN/yr</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
