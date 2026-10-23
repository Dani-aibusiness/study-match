// Week 4 — static marketing/content data.
// Nothing here calls the AI SDK: this is pre-written brand, persona, and
// content-library data, the same way the Week 3 pricing tiers were static.

export type HeadlineVariant = "A" | "B";
export type CtaVariant = "A" | "B";

export const brand = {
  tagline: "Stuck on homework? Think it through, then get real help.",
  palette: [
    { name: "Slate 950", hex: "#020617", use: "Background" },
    { name: "Slate 100", hex: "#F1F5F9", use: "Primary text" },
    { name: "Emerald 500", hex: "#10B981", use: "Accent / CTA" },
    { name: "Slate 400", hex: "#94A3B8", use: "Secondary text" },
  ],
  voice: [
    "Direct, not corporate — talk like a classmate who's been there, not a sales rep.",
    "Encouraging without being cheesy — confidence, not hype.",
    "Practical over promotional — show what the product actually does before saying how great it is.",
  ],
};

export const persona = {
  name: "Mariana — 2nd-year engineering student",
  goals: [
    "Pass calc and physics without falling behind for the whole semester",
    "Actually understand concepts well enough to not panic on exams",
    "Avoid paying for a full-time private tutor she can't really afford",
  ],
  frustrations: [
    "ChatGPT gives her the answer, but she still doesn't get why it works",
    "Tutors are expensive and hard to schedule around her class blocks",
    "Doesn't want to feel dumb asking a human tutor an 'obvious' question",
  ],
  howStudyMatchHelps:
    "The AI walks her through the problem Socratically first — only if she's still stuck afterward does StudyMatch match her to a real peer tutor, instead of jumping straight to a flat answer or an expensive session.",
};

export const headlines: Record<HeadlineVariant, { headline: string; subheadline: string }> = {
  A: {
    headline: "Stuck on homework? Think it through before you give up.",
    subheadline:
      "StudyMatch pairs Socratic AI explanations with real peer tutors, so you actually learn — not just copy an answer.",
  },
  B: {
    headline: "AI tutoring that explains first — and calls in a human when you're still stuck.",
    subheadline:
      "No flat answers, no overpriced tutors on standby. Just help that actually gets you unstuck.",
  },
};

export const ctas: Record<CtaVariant, string> = {
  A: "Get Help Now",
  B: "Try It Free",
};

export type SocialPost = {
  id: string;
  platform: "Instagram" | "TikTok" | "X";
  copy: string;
};

export const socialPosts: SocialPost[] = [
  {
    id: "sp1",
    platform: "Instagram",
    copy:
      "POV: you ask the AI for help and it actually explains it instead of just handing you the answer. 🤯 That's StudyMatch. Link in bio. #StudyMatch #CDMX #StudentLife",
  },
  {
    id: "sp2",
    platform: "TikTok",
    copy:
      "Still stuck after the AI walks you through it? That's when we match you to a real tutor — not before. No wasted sessions, no wasted money. 🎓 #StudyTok #TutorTok",
  },
  {
    id: "sp3",
    platform: "X",
    copy:
      "Most \"AI tutors\" just give you the answer. StudyMatch makes you think it through first, then brings in a human if you're still lost. That's the difference between a crutch and actually learning.",
  },
  {
    id: "sp4",
    platform: "Instagram",
    copy:
      "3am. Calc homework due in 6 hours. You don't need a lecture, you need someone to explain THIS one step. That's literally what StudyMatch is for. 📚✨",
  },
  {
    id: "sp5",
    platform: "TikTok",
    copy:
      "Rating homework help apps as a broke engineering student: ChatGPT = answers with no explanation. Private tutor = $$$ I don't have. StudyMatch = explains it, escalates only if needed. 10/10.",
  },
  {
    id: "sp6",
    platform: "X",
    copy:
      "Built StudyMatch because I was tired of choosing between \"AI gives me the answer and I learn nothing\" and \"I pay $300/mo for a tutor I barely use.\" There's a middle option now.",
  },
  {
    id: "sp7",
    platform: "Instagram",
    copy:
      "Not every question needs a human tutor. Not every question is solved by an AI answer either. StudyMatch figures out which one you actually need — automatically. 🙌",
  },
  {
    id: "sp8",
    platform: "TikTok",
    copy:
      "Things that live in my StudyMatch history: a physics problem I actually understood for the first time, 2 calc proofs, and the tutor who saved my stats final. No cap.",
  },
  {
    id: "sp9",
    platform: "X",
    copy:
      "Free tier: unlimited Socratic AI help. Paid tiers: priority tutor matching + history. No subscription traps, no hidden per-session fees. studymatch.app",
  },
  {
    id: "sp10",
    platform: "Instagram",
    copy:
      "Tag a friend who needs this before finals week 👀 StudyMatch — think it through, then get real help when you need it.",
  },
];

export type VideoScript = {
  id: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
};

export const videoScripts: VideoScript[] = [
  {
    id: "vs1",
    title: "The 3am homework script (15s, TikTok/Reels)",
    hook: "\"It's 3am and I still don't get this calc problem.\"",
    body:
      "Show typing the question into StudyMatch. AI responds with a guiding question instead of the answer. Student has the \"oh wait, I get it\" moment. Quick cut to the solved problem.",
    cta: "\"StudyMatch — think it through, then get real help. Link in bio.\"",
  },
  {
    id: "vs2",
    title: "AI vs. tutor comparison (30s, Instagram/YouTube Shorts)",
    hook: "\"I tried 3 ways to get unstuck on homework. Here's what actually worked.\"",
    body:
      "Split-screen: (1) AI chatbot gives a flat answer, student still confused. (2) Private tutor — show a price tag and a scheduling headache. (3) StudyMatch — AI explains step by step, student gets it, no tutor needed this time.",
    cta: "\"Try the one that actually teaches you. studymatch.app\"",
  },
  {
    id: "vs3",
    title: "Founder explainer (45s, YouTube/LinkedIn)",
    hook: "\"I built StudyMatch because I was choosing between two bad options.\"",
    body:
      "Talk to camera: explain the gap — AI tools that just answer, tutors that are expensive and slow to book. Show the actual product: ask a question, get a Socratic explanation, escalate to a tutor only if still stuck. End on the dashboard showing real submissions.",
    cta: "\"If you've ever been stuck at midnight with no one to ask — this is for you. Try it free.\"",
  },
];

export type CampaignDay = {
  day: number;
  channel: string;
  theme: string;
};

export const campaignCalendar: CampaignDay[] = [
  { day: 1, channel: "Instagram", theme: "Launch announcement — what StudyMatch is and why it exists" },
  { day: 2, channel: "TikTok", theme: "3am homework script (video #1)" },
  { day: 3, channel: "X", theme: "Founder thread: the gap between AI answers and real tutors" },
  { day: 4, channel: "Instagram", theme: "Behind-the-scenes: how the AI explains before escalating" },
  { day: 5, channel: "TikTok", theme: "Comparison bit — AI vs. tutor vs. StudyMatch" },
  { day: 6, channel: "X", theme: "Free tier highlight — no subscription traps" },
  { day: 7, channel: "Instagram", theme: "Student testimonial / mock use-case story" },
  { day: 8, channel: "TikTok", theme: "\"Rating homework help apps\" bit" },
  { day: 9, channel: "X", theme: "Repost + quote-tweet engagement day (reply to student pain points)" },
  { day: 10, channel: "Instagram", theme: "Video #2 — AI vs. tutor comparison" },
  { day: 11, channel: "TikTok", theme: "Day-in-the-life of a stressed student using StudyMatch" },
  { day: 12, channel: "X", theme: "Data/number post — e.g. questions answered so far" },
  { day: 13, channel: "Instagram", theme: "Founder explainer video (video #3)" },
  { day: 14, channel: "TikTok + Instagram", theme: "\"Tag a friend before finals\" push + recap carousel" },
];
