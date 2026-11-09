"use client";

import { useState } from "react";
import AgentMap from "@/components/AgentMap";
import { BUILD_LOGS, PROMPT_LIBRARY } from "@/lib/siteContent";

const TABS = ["Prompt library", "Build logs", "Agent map"] as const;
type Tab = (typeof TABS)[number];

export default function DocsClient() {
  const [tab, setTab] = useState<Tab>("Prompt library");
  const [copied, setCopied] = useState<number | null>(null);

  async function copy(i: number, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  return (
    <>
      <div className="mt-8 flex gap-2 border-b border-slate-800" role="tablist">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t
                ? "border-emerald-500 text-white"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "Prompt library" && (
          <div className="space-y-4">
            {PROMPT_LIBRARY.map((p, i) => (
              <div key={p.name} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">{p.name}</h3>
                  <button
                    type="button"
                    onClick={() => copy(i, p.text)}
                    className="rounded-md border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-500"
                  >
                    {copied === i ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="mt-1 text-xs text-slate-500">{p.note}</p>
                <pre className="mt-3 whitespace-pre-wrap rounded-md bg-slate-950 p-3 text-xs text-slate-300">
                  {p.text}
                </pre>
              </div>
            ))}
          </div>
        )}

        {tab === "Build logs" && (
          <div className="space-y-3">
            {BUILD_LOGS.map((b) => (
              <div key={b.week} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold text-white">{b.week}</h3>
                  <code className="rounded bg-slate-950 px-2 py-1 text-xs text-emerald-400">
                    {b.route}
                  </code>
                </div>
                <p className="mt-2 text-sm text-slate-300">{b.built}</p>
                <p className="mt-2 text-xs text-slate-500">Data: {b.data}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "Agent map" && <AgentMap />}
      </div>
    </>
  );
}
