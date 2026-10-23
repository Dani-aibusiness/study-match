"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import {
  brand,
  persona,
  headlines,
  ctas,
  socialPosts,
  videoScripts,
  campaignCalendar,
  HeadlineVariant,
  CtaVariant,
} from "@/lib/marketingContent";
import type { VoteRow, SnapshotRow } from "./page";

type Props = {
  initialVotes: VoteRow[];
  initialSnapshots: SnapshotRow[];
};

function countVotes(votes: VoteRow[], testName: string) {
  const counts = { A: 0, B: 0 };
  for (const v of votes) {
    if (v.test_name !== testName) continue;
    if (v.variant === "A") counts.A += 1;
    else if (v.variant === "B") counts.B += 1;
  }
  return counts;
}

export default function MarketingClient({ initialVotes, initialSnapshots }: Props) {
  const [votes, setVotes] = useState<VoteRow[]>(initialVotes);
  const [snapshots, setSnapshots] = useState<SnapshotRow[]>(initialSnapshots);

  const [headlineVariant, setHeadlineVariant] = useState<HeadlineVariant>("A");
  const [ctaVariant, setCtaVariant] = useState<CtaVariant>("A");

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [label, setLabel] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const headlineCounts = useMemo(() => countVotes(votes, "headline"), [votes]);
  const ctaCounts = useMemo(() => countVotes(votes, "cta"), [votes]);

  async function castVote(testName: "headline" | "cta", variant: "A" | "B") {
    // optimistic local update so the counter feels instant
    setVotes((prev) => [...prev, { test_name: testName, variant }]);
    const { error } = await supabase.from("headline_votes").insert({
      test_name: testName,
      variant,
    });
    if (error) {
      // roll back the optimistic row if the insert actually failed
      setVotes((prev) => {
        const idx = prev.findIndex((v) => v.test_name === testName && v.variant === variant);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy.splice(idx, 1);
        return copy;
      });
    }
  }

  function selectHeadline(variant: HeadlineVariant) {
    setHeadlineVariant(variant);
    castVote("headline", variant);
  }

  function selectCta(variant: CtaVariant) {
    setCtaVariant(variant);
    castVote("cta", variant);
  }

  async function copyText(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1800);
    } catch {
      // clipboard can be unavailable (older browsers, insecure context); fail quietly
      setCopiedId(null);
    }
  }

  async function handleSave() {
    setSaveError(null);
    if (!label.trim()) {
      setSaveError("Give this snapshot a short label first.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("marketing_snapshots")
      .insert({
        label: label.trim(),
        headline_variant: headlineVariant,
        cta_variant: ctaVariant,
        notes: notes.trim() || null,
      })
      .select("id, label, headline_variant, cta_variant, notes, created_at")
      .single();

    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    if (data) {
      setSnapshots((prev) => [data as SnapshotRow, ...prev]);
      setLabel("");
      setNotes("");
    }
  }

  const activeHeadline = headlines[headlineVariant];
  const activeCta = ctas[ctaVariant];

  return (
    <div className="mt-12 space-y-16">
      {/* Brand system */}
      <section>
        <h2 className="text-xl font-semibold text-white">Brand system</h2>
        <p className="mt-1 text-sm text-slate-400">{brand.tagline}</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {brand.palette.map((c) => (
            <div key={c.hex} className="rounded-lg border border-slate-800 overflow-hidden">
              <div className="h-14" style={{ backgroundColor: c.hex }} />
              <div className="p-2 text-xs text-slate-300">
                <div className="font-semibold">{c.name}</div>
                <div className="text-slate-500">{c.hex}</div>
                <div className="text-slate-500">{c.use}</div>
              </div>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-1 text-sm text-slate-300">
          {brand.voice.map((v) => (
            <li key={v}>• {v}</li>
          ))}
        </ul>
      </section>

      {/* Persona */}
      <section>
        <h2 className="text-xl font-semibold text-white">Target persona</h2>
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-5">
          <div className="font-semibold text-white">{persona.name}</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase text-emerald-400">Goals</div>
              <ul className="mt-1 space-y-1 text-sm text-slate-300">
                {persona.goals.map((g) => (
                  <li key={g}>• {g}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase text-amber-400">Frustrations</div>
              <ul className="mt-1 space-y-1 text-sm text-slate-300">
                {persona.frustrations.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-400">{persona.howStudyMatchHelps}</p>
        </div>
      </section>

      {/* Landing copy + A/B tests */}
      <section>
        <h2 className="text-xl font-semibold text-white">Landing copy &amp; A/B tests</h2>

        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/50 p-8">
          <h3 className="text-2xl font-bold text-white">{activeHeadline.headline}</h3>
          <p className="mt-2 text-slate-400">{activeHeadline.subheadline}</p>
          <Link
            href="/core"
            className="mt-6 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            {activeCta}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-800 p-5">
            <div className="text-sm font-semibold text-white">Headline test</div>
            <p className="mt-1 text-xs text-slate-500">
              Pick which headline is live, each pick logs a vote.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => selectHeadline("A")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  headlineVariant === "A"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                A ({headlineCounts.A})
              </button>
              <button
                type="button"
                onClick={() => selectHeadline("B")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  headlineVariant === "B"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                B ({headlineCounts.B})
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 p-5">
            <div className="text-sm font-semibold text-white">CTA button test</div>
            <p className="mt-1 text-xs text-slate-500">
              "{ctas.A}" vs. "{ctas.B}" — each pick logs a vote.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => selectCta("A")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  ctaVariant === "A"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                {ctas.A} ({ctaCounts.A})
              </button>
              <button
                type="button"
                onClick={() => selectCta("B")}
                className={`flex-1 rounded-md border px-3 py-2 text-sm ${
                  ctaVariant === "B"
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                    : "border-slate-700 text-slate-300"
                }`}
              >
                {ctas.B} ({ctaCounts.B})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Social posts */}
      <section>
        <h2 className="text-xl font-semibold text-white">Social posts (10)</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {socialPosts.map((post) => (
            <div key={post.id} className="rounded-lg border border-slate-800 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300">
                  {post.platform}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(post.id, post.copy)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {copiedId === post.id ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{post.copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video scripts */}
      <section>
        <h2 className="text-xl font-semibold text-white">Video scripts (3)</h2>
        <div className="mt-5 space-y-4">
          {videoScripts.map((script) => (
            <div key={script.id} className="rounded-lg border border-slate-800 p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">{script.title}</div>
                <button
                  type="button"
                  onClick={() =>
                    copyText(
                      script.id,
                      `Hook: ${script.hook}\n\nBody: ${script.body}\n\nCTA: ${script.cta}`
                    )
                  }
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  {copiedId === script.id ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                <p><span className="text-slate-500">Hook:</span> {script.hook}</p>
                <p><span className="text-slate-500">Body:</span> {script.body}</p>
                <p><span className="text-slate-500">CTA:</span> {script.cta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Campaign calendar */}
      <section>
        <h2 className="text-xl font-semibold text-white">14-day campaign calendar</h2>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Theme</th>
              </tr>
            </thead>
            <tbody>
              {campaignCalendar.map((d) => (
                <tr key={d.day} className="border-t border-slate-800 text-slate-300">
                  <td className="px-4 py-3">{d.day}</td>
                  <td className="px-4 py-3">{d.channel}</td>
                  <td className="px-4 py-3">{d.theme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Save snapshot */}
      <section>
        <h2 className="text-xl font-semibold text-white">Save this campaign snapshot</h2>
        <p className="mt-1 text-sm text-slate-400">
          Saves which headline/CTA variant is currently selected, so you can
          compare campaign setups later.
        </p>
        <div className="mt-5 rounded-lg border border-slate-800 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-400">Label</label>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Launch week v1"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Notes (optional)</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. testing headline B on paid traffic"
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>
          {saveError && <p className="mt-2 text-sm text-red-400">{saveError}</p>}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-4 rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save snapshot"}
          </button>
        </div>

        {snapshots.length > 0 && (
          <div className="mt-5 space-y-3">
            {snapshots.map((s) => (
              <div
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-800 p-4 text-sm"
              >
                <div className="text-white font-semibold">{s.label}</div>
                <div className="text-slate-400">
                  Headline {s.headline_variant} · CTA {s.cta_variant}
                  {s.notes ? ` · ${s.notes}` : ""}
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(s.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
