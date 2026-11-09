import DocsClient from "./DocsClient";

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Docs</h1>
      <p className="mt-2 text-slate-400">
        The prompt library, what was built each week, and the agent map.
      </p>
      <DocsClient />
    </main>
  );
}
