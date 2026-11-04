import { supabase } from "@/lib/supabaseClient";
import ChatClient from "./ChatClient";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
  const { data, error } = await supabase.from("chat_feedback").select("rating");

  const rows = (data ?? []) as { rating: string }[];
  const up = rows.filter((r) => r.rating === "up").length;
  const down = rows.filter((r) => r.rating === "down").length;

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-bold text-white">Guided study assistant</h1>
      <p className="mt-2 text-slate-400">
        Answer 3 quick questions and get a first-step plan. If it looks like
        you need a person, you decide whether it goes to a human tutor.
      </p>

      {error && (
        <p className="mt-6 rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-400">
          Could not load feedback totals: {error.message}
        </p>
      )}

      <ChatClient initialUp={up} initialDown={down} />
    </main>
  );
}
