import { supabase } from "@/lib/supabaseClient";
import ResearchClient from "./ResearchClient";

export const dynamic = "force-dynamic";

export type Competitor = {
  id: string;
  name: string;
  type: string;
  category: string;
  price_model: string;
  strength: string;
  gap: string;
  risk_x: number;
  risk_y: number;
};

export default async function ResearchPage() {
  const { data, error } = await supabase
    .from("competitors")
    .select("id, name, type, category, price_model, strength, gap, risk_x, risk_y")
    .order("name", { ascending: true });

  const competitors = (data ?? []) as Competitor[];

  return (
    <main className="mx-auto max-w-6xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Research &amp; Benchmarking</h1>
      <p className="mt-2 text-slate-400">
        Mapping who else is solving this problem — and where the real gap is.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load competitor data: {error.message}
        </p>
      )}

      {!error && <ResearchClient competitors={competitors} />}
    </main>
  );
}
