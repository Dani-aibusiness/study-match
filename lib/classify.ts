import Anthropic from "@anthropic-ai/sdk";

// This is the "generative core" this week's success criteria points to:
// classify a student's stuck-point into subject / topic / level / urgency.
// Runs server-side only — the API key must never reach the client.

export type Classification = {
  subject: string;
  topic: string;
  level: "elementary" | "middle_school" | "high_school" | "college" | "graduate";
  urgency: "low" | "medium" | "high";
  summary: string;
};

const CLASSIFY_SYSTEM_PROMPT = `You classify a student's homework question or photo of
coursework into structured fields. Respond with ONLY a JSON object, no prose, no
markdown fences, matching exactly this shape:

{
  "subject": string,        // e.g. "math", "physics", "chemistry", "biology",
                             // "computer_science", "writing", "history", "languages", "other"
  "topic": string,          // short, specific, e.g. "quadratic equations"
  "level": "elementary" | "middle_school" | "high_school" | "college" | "graduate",
  "urgency": "low" | "medium" | "high", // infer from language like "exam tomorrow",
                             // "due tonight" -> high; no time pressure mentioned -> low
  "summary": string         // one sentence restating what the student is stuck on
}`;

export async function classifySubmission(input: {
  text?: string;
  imageBase64?: string;
  imageMediaType?: string;
}): Promise<Classification> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to your environment variables (server-side only, do NOT prefix with NEXT_PUBLIC_)."
    );
  }

  const client = new Anthropic({ apiKey });

  const content: Anthropic.MessageParam["content"] = [];

  if (input.imageBase64 && input.imageMediaType) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: input.imageMediaType as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: input.imageBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: input.text?.trim()
      ? `Student's description of what they're stuck on: "${input.text.trim()}"`
      : "Classify the homework shown in the attached image.",
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 500,
    system: CLASSIFY_SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Classification failed: no text response from model.");
  }

  const cleaned = textBlock.text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned) as Classification;
  return parsed;
}
