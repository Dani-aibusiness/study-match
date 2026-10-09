import { supabase } from "@/lib/supabaseClient";
import PricingClient from "./PricingClient";

export const dynamic = "force-dynamic";

export type PricingScenario = {
  id: string;
  label: string;
  segment: string;
  scenario_preset: string;
  inputs: Record<string, number | string>;
  monthly_revenue: number;
  annual_revenue: number;
  created_at: string;
};

export default async function PricingPage() {
  const { data, error } = await supabase
    .from("pricing_scenarios")
    .select("id, label, segment, scenario_preset, inputs, monthly_revenue, annual_revenue, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  const scenarios = (data ?? []) as PricingScenario[];

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Pricing &amp; revenue simulator</h1>
      <p className="mt-2 text-slate-400">
        Model monthly and annual revenue under different assumptions, and save
        scenarios to compare later.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load saved scenarios: {error.message}
        </p>
      )}

      <PricingClient initialScenarios={scenarios} />
    </main>
  );
}
