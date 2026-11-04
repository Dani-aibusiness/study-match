// Week 5 — rules for the guided assistant at /chat.
// This is a SCRIPTED assistant: no AI model, no API calls. Everything here is
// plain, testable functions, so the UI file only has to show the results.

export const SUBJECTS = [
  "Math",
  "Physics",
  "Chemistry",
  "Programming",
  "Writing",
  "Other",
] as const;
export type Subject = (typeof SUBJECTS)[number];

export const URGENCY_OPTIONS = [
  { value: "today", label: "Due today" },
  { value: "week", label: "This week" },
  { value: "norush", label: "No rush" },
] as const;
export type Urgency = (typeof URGENCY_OPTIONS)[number]["value"];

export function urgencyLabel(u: Urgency): string {
  return URGENCY_OPTIONS.find((o) => o.value === u)?.label ?? u;
}

// ---------------------------------------------------------------- guardrails

export type GuardrailKind = "cheating" | "crisis" | "personal_data";
export type Guardrail = { kind: GuardrailKind; reply: string };

const CRISIS = /\b(kill myself|killing myself|suicid\w*|end my life|want to die|hurt myself|self[- ]?harm)\b/i;

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
// A run of digits (optionally separated by spaces, dots, dashes, brackets) that
// totals 9+ digits looks like a phone or card number. Short numbers in math
// problems (like 12345) are not flagged.
const DIGIT_RUN = /\+?\d[\d\s().-]{7,}\d/g;

const CHEATING: RegExp[] = [
  /\b(answers?|solutions?)\s+(to|for|of)\s+(my|the|an?)\s+(exam|test|quiz|midterm|final)/i,
  /\b(take|do|write|complete|finish)\s+(my|the)\s+(exam|test|quiz|midterm|final|homework|assignment|essay|thesis|report)\s+for me\b/i,
  /\bjust\s+(give|tell|send)\s+me\s+(the\s+)?(answers?|solutions?)\b/i,
  /\b(during|in the middle of|while taking)\s+(my|the|an?)\s+(exam|test|quiz|midterm|final)\b/i,
];

function hasPhoneOrCard(text: string): boolean {
  const runs = text.match(DIGIT_RUN) ?? [];
  return runs.some((r) => r.replace(/\D/g, "").length >= 9);
}

export function checkGuardrail(text: string): Guardrail | null {
  if (CRISIS.test(text)) {
    return {
      kind: "crisis",
      reply:
        "I'm a scripted study assistant and I can't help with this. You deserve support from a real person: please talk to someone you trust, or call 911 (Mexico's emergency number) if you might be in danger.",
    };
  }
  if (EMAIL.test(text) || hasPhoneOrCard(text)) {
    return {
      kind: "personal_data",
      reply:
        "Please don't share personal details such as an email, phone number or card number here. I haven't saved that message. Describe the problem again without them.",
    };
  }
  if (CHEATING.some((re) => re.test(text))) {
    return {
      kind: "cheating",
      reply:
        "I can't help with taking exams or writing work for you to hand in. It wouldn't help you learn and it could get you in trouble. I can help you understand the idea behind it, though. Tell me which part you're stuck on and what you've tried.",
    };
  }
  return null;
}

// --------------------------------------------------------------- validation

export function validateStuck(text: string): { ok: true } | { ok: false; error: string } {
  const t = text.trim();
  if (t.length < 8) {
    return { ok: false, error: "Please write a bit more (at least 8 characters)." };
  }
  if (t.split(/\s+/).length < 2) {
    return { ok: false, error: "Please describe it in a few words, not just one." };
  }
  if (t.length > 500) {
    return { ok: false, error: "Please keep it under 500 characters." };
  }
  return { ok: true };
}

// ----------------------------------------------------------- response logic

const LOST = /(don'?t understand|do not understand|no idea|\blost\b|confus|completely stuck|can'?t figure|don'?t get)/i;

const SUBJECT_STEPS: Record<Subject, [string, string]> = {
  Math: [
    "Write down what the problem gives you and what it asks for, in your own words.",
    "Find the closest worked example in your notes or textbook and compare its first step with yours.",
  ],
  Physics: [
    "Draw the situation and label every known quantity with its units.",
    "Name the principle that applies (for example forces, energy or momentum) before choosing a formula.",
  ],
  Chemistry: [
    "Write the balanced equation or the quantities involved, with units.",
    "Check which concept the question is testing (moles, equilibrium, reactions) and review that section first.",
  ],
  Programming: [
    "Write down the exact input you give, the output you expect, and the output you get.",
    "Shrink the problem: remove code until the smallest version that still fails is left.",
  ],
  Writing: [
    "Write your main point in one sentence. If you can't, that's the part to fix first.",
    "List the 2 or 3 pieces of evidence that support it before polishing any wording.",
  ],
  Other: [
    "Write down what you already know about the topic and what the question asks.",
    "Find the section of your notes or textbook that matches the question and re-read just that part.",
  ],
};

const URGENCY_STEP: Record<Urgency, string> = {
  today:
    "It's due today, so pick the smallest part you can finish in 25 minutes and start there. Skip perfecting the rest.",
  week:
    "You have time: attempt it once on your own now, write down the exact point where you get stuck, and bring that question to your next session.",
  norush:
    "No rush: after this one, try a similar practice problem to check you really understand it, not just this single case.",
};

export type ChatResponse = {
  intro: string;
  plan: string[];
  lost: boolean;
  needsCheckpoint: boolean;
  checkpointReason: string | null;
};

export function buildResponse(input: {
  subject: Subject;
  stuck: string;
  urgency: Urgency;
}): ChatResponse {
  const { subject, stuck, urgency } = input;
  const lost = LOST.test(stuck);
  const [a, b] = SUBJECT_STEPS[subject];

  let checkpointReason: string | null = null;
  if (urgency === "today" && lost) {
    checkpointReason = "it's due today and you sound really stuck";
  } else if (urgency === "today") {
    checkpointReason = "it's due today";
  } else if (lost) {
    checkpointReason = "you said you're really lost on it";
  }

  return {
    intro: `Thanks. You're stuck on: "${stuck.trim()}" (${subject}, ${urgencyLabel(urgency).toLowerCase()}). Here is a first-step plan:`,
    plan: [a, b, URGENCY_STEP[urgency]],
    lost,
    needsCheckpoint: checkpointReason !== null,
    checkpointReason,
  };
}
