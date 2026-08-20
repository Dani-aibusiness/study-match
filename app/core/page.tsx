"use client";

import { useState } from "react";

type ClassifyResult = {
  subject: string;
  topic: string;
  level: string;
  urgency: string;
  summary: string;
  suggested_tutor_label: string;
  suggested_tutor_description: string;
};

function fileToBase64(file: File): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, data] = result.split(",");
      const mediaType = meta.match(/data:(.*);base64/)?.[1] ?? "image/png";
      resolve({ base64: data, mediaType });
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

export default function CorePage() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ClassifyResult | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (mode === "text" && !text.trim()) {
      setError("Type a description of what you're stuck on.");
      return;
    }
    if (mode === "image" && !file) {
      setError("Upload a photo of your homework.");
      return;
    }

    setLoading(true);
    try {
      let payload: Record<string, unknown> = { text: mode === "text" ? text : undefined };

      if (mode === "image" && file) {
        const { base64, mediaType } = await fileToBase64(file);
        payload = { ...payload, imageBase64: base64, imageMediaType: mediaType };
      }

      const res = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error ?? "Something went wrong.");
      }

      setResult(json.submission);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">What are you stuck on?</h1>
      <p className="mt-2 text-slate-400">
        Describe it in your own words, or upload a photo of the problem.
      </p>

      <div className="mt-8 flex gap-2 rounded-lg border border-slate-800 p-1">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === "text"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Type it out
        </button>
        <button
          type="button"
          onClick={() => setMode("image")}
          className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
            mode === "image"
              ? "bg-emerald-500 text-slate-950"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Upload a photo
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {mode === "text" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. I don't understand how to factor quadratic equations, exam is tomorrow"
            rows={5}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:font-medium file:text-slate-950"
          />
        )}

        {error && (
          <p className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Classifying…" : "Classify & save"}
        </button>
      </form>

      {result && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="font-semibold text-white">Result</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Subject</dt>
              <dd className="text-slate-200">{result.subject}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Topic</dt>
              <dd className="text-slate-200">{result.topic}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Level</dt>
              <dd className="text-slate-200">{result.level}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Urgency</dt>
              <dd className="text-slate-200 capitalize">{result.urgency}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm text-slate-400">{result.summary}</p>
          <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/30 p-4">
            <p className="text-sm font-medium text-emerald-400">
              Suggested tutor type: {result.suggested_tutor_label}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {result.suggested_tutor_description}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
