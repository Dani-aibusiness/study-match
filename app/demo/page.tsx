import DemoClient from "./DemoClient";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Guided demo</h1>
      <p className="mt-2 text-slate-400">
        Six steps through the whole product. Nothing here is an AI model: the
        assistant is scripted and says so on its page.
      </p>
      <DemoClient />
    </main>
  );
}
