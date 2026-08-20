// Week scope: this is a simple, explicit rule-based lookup — NOT a live
// matching engine. Real tutor matching/availability is out of scope this
// week; this only labels which *type* of tutor would typically help.

export type SuggestedTutorType = {
  label: string;
  description: string;
};

const SUBJECT_TUTOR_MAP: Record<string, SuggestedTutorType> = {
  math: {
    label: "Math tutor",
    description: "Comfortable with algebra through calculus-level problem sets.",
  },
  physics: {
    label: "Physics tutor",
    description: "Strong with mechanics, E&M, and problem-solving walkthroughs.",
  },
  chemistry: {
    label: "Chemistry tutor",
    description: "Good with stoichiometry, reactions, and lab report help.",
  },
  biology: {
    label: "Biology tutor",
    description: "Solid on cell biology, genetics, and exam-style recall questions.",
  },
  computer_science: {
    label: "CS tutor",
    description: "Can debug code and explain core CS concepts.",
  },
  writing: {
    label: "Writing tutor",
    description: "Helps with essay structure, argumentation, and editing.",
  },
  history: {
    label: "History tutor",
    description: "Good with essay prep, timelines, and source analysis.",
  },
  languages: {
    label: "Language tutor",
    description: "Helps with grammar, vocabulary, and conversation practice.",
  },
  other: {
    label: "General tutor",
    description: "A generalist peer tutor — good starting point until we know more.",
  },
};

export function suggestTutorType(subject: string): SuggestedTutorType {
  const key = subject.toLowerCase().trim().replace(/\s+/g, "_");
  return SUBJECT_TUTOR_MAP[key] ?? SUBJECT_TUTOR_MAP.other;
}
