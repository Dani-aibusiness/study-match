import { supabase } from "@/lib/supabaseClient";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";

export type VoteRow = {
  test_name: string;
  variant: string;
};

export type SnapshotRow = {
  id: string;
  label: string;
  headline_variant: string;
  cta_variant: string;
  notes: string | null;
  created_at: string;
};

export default async function MarketingPage() {
  const [votesResult, snapshotsResult] = await Promise.all([
    supabase.from("headline_votes").select("test_name, variant"),
    supabase
      .from("marketing_snapshots")
      .select("id, label, headline_variant, cta_variant, notes, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const votes = (votesResult.data ?? []) as VoteRow[];
  const snapshots = (snapshotsResult.data ?? []) as SnapshotRow[];
  const loadError = votesResult.error || snapshotsResult.error;

  return (
    <main className="mx-auto max-w-5xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Marketing engine &amp; content system</h1>
      <p className="mt-2 text-slate-400">
        Brand system, persona, landing copy, content library, and a live A/B
        headline test — all generated once and saved so campaigns can be
        compared later.
      </p>

      {loadError && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load some marketing data: {loadError.message}
        </p>
      )}

      <MarketingClient initialVotes={votes} initialSnapshots={snapshots} />
    </main>
  );
}
