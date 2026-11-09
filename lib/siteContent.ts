// Week 6: shared content for navigation, /demo, /docs, /impact, /roadmap.
// Plain data only, so it is easy to edit without touching page code.

export const PRIMARY_NAV = [
  { href: "/core", label: "Get Help" },
  { href: "/chat", label: "Chat" },
  { href: "/demo", label: "Demo" },
  { href: "/dashboard", label: "Dashboard" },
];

export const MORE_NAV = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/marketing", label: "Marketing" },
  { href: "/research", label: "Research" },
  { href: "/docs", label: "Docs & agent map" },
  { href: "/impact", label: "Impact check" },
  { href: "/roadmap", label: "Version 2 roadmap" },
];

export type DemoStep = {
  title: string;
  href: string;
  linkLabel: string;
  what: string;
  lookFor: string;
};

export const DEMO_STEPS: DemoStep[] = [
  {
    title: "1. The problem",
    href: "/research",
    linkLabel: "Open Research",
    what: "Students get stuck on homework and either give up, copy an answer, or pay for a tutor they cannot afford. Research compares existing tools and finds the gap: affordable, verified help with a human fallback.",
    lookFor: "The competitor table and the identified gap.",
  },
  {
    title: "2. Get help (intake)",
    href: "/core",
    linkLabel: "Open Get Help",
    what: "A student describes what they are stuck on. The intake classifies subject, level and urgency and saves a submission.",
    lookFor: "Submit one request, then see it appear on the Dashboard.",
  },
  {
    title: "3. Guided assistant",
    href: "/chat",
    linkLabel: "Open Chat",
    what: "A scripted assistant (no AI model, labelled on the page) asks 3 questions and returns a 3-step plan. It blocks crisis messages, personal data and requests to cheat, and lets the student decide whether a human tutor reviews it.",
    lookFor: "Try 'just give me the answers to my exam' to see the guardrail.",
  },
  {
    title: "4. Product, pricing and marketing",
    href: "/pricing",
    linkLabel: "Open Pricing",
    what: "The product page defines the offer, pricing runs revenue scenarios, and marketing runs real A/B votes on headlines and calls to action.",
    lookFor: "Change a pricing assumption and save a scenario; vote on a headline.",
  },
  {
    title: "5. Records and proof",
    href: "/dashboard",
    linkLabel: "Open Dashboard",
    what: "Everything above leaves a record in the database. The dashboard reads counts and recent rows from it. Private transcripts are never shown.",
    lookFor: "The numbers should change after you use steps 2 to 4.",
  },
  {
    title: "6. Impact and what is next",
    href: "/impact",
    linkLabel: "Open Impact check",
    what: "A practical impact check lists the benefits we can and cannot claim yet, the risks and their safeguards, and the version 2 roadmap.",
    lookFor: "What is marked 'not yet measured'. That honesty is intentional.",
  },
];

export const PROMPT_LIBRARY = [
  {
    name: "Course macro-prompt (Build Discipline Packet)",
    note: "Course-provided pattern, used to force the plan before any code.",
    text: `ROLE: You are my disciplined AI-native product architect and coding partner.
COURSE RULE: Do not let me code before the plan is clear.
TASK: Help me complete this week's Build Discipline Packet, then create a precise implementation prompt for Codex or Claude Code.
CONSTRAINTS:
- Free tools only.
- Next.js/React + Tailwind + Vercel + GitHub + Supabase when data is needed.
- Build small, testable features.
- No paid APIs required. If AI output is simulated, label it clearly.
- Require acceptance criteria before coding.
OUTPUT FORMAT:
1. Problem definition  2. User definition  3. Product spec  4. UX mockup prompt  5. Architecture sketch  6. Tech stack  7. DevOps plan  8. Test plan  9. Implementation prompt  10. Scope cuts`,
  },
  {
    name: "Week 6 add-on (integration)",
    note: "Course-provided weekly add-on.",
    text: `THIS WEEK: Integrated Agentic Venture + Impact & Viability
REQUIRED LIVE PAGE: /demo
FEATURES: full navigation, /dashboard shows records, /docs has prompt library/build logs, /demo guided walkthrough, agent map, 5 total external users, practical impact check, version 2 roadmap.
TESTING: 5 external users total + full-site regression test.
Before giving me code, force me to complete the Build Discipline Packet. Then create a precise prompt that implements only the agreed scope.`,
  },
  {
    name: "Working agreement: packet first, then code",
    note: "Template for how this project is built.",
    text: `Propose the Build Discipline Packet in chat first. Wait for my approval. Then write complete files I can copy into my project, a SQL migration for Supabase if data is needed, and step-by-step instructions. I cannot run code locally and use GitHub Desktop, so list commits and what to tick for each.`,
  },
  {
    name: "Regression check request",
    note: "Template for the full-site test.",
    text: `Write a regression checklist for every route in this site. For each item give: what to do, what should happen, and a Pass/Fail box. Include mobile width and the guardrail cases. Do not mark anything as passed; I will run each check myself.`,
  },
];

export const BUILD_LOGS = [
  {
    week: "Week 1",
    route: "/core",
    built: "Intake page that classifies a student's question (subject, topic, level, urgency) and saves a submission.",
    data: "submissions",
  },
  {
    week: "Module 2",
    route: "/research",
    built: "Competitor research table with an identified market gap, plus a research snapshot on the dashboard.",
    data: "competitors",
  },
  {
    week: "Week 3",
    route: "/product, /pricing",
    built: "Product definition page and an interactive pricing and revenue scenario tool.",
    data: "pricing_scenarios",
  },
  {
    week: "Week 4",
    route: "/marketing, /",
    built: "Homepage rewrite and a marketing page with real A/B votes on headlines and calls to action.",
    data: "headline_votes, marketing_snapshots",
  },
  {
    week: "Week 5",
    route: "/chat",
    built: "Scripted guided assistant with guardrails (crisis, personal data, cheating), a human checkpoint, and thumbs feedback. Labelled as not an AI model.",
    data: "chat_sessions, chat_feedback",
  },
  {
    week: "Week 6",
    route: "/demo, /docs, /dashboard, /impact, /roadmap",
    built: "Full navigation, guided demo with a tester feedback form, prompt library, agent map, rebuilt dashboard, impact check and version 2 roadmap.",
    data: "tester_feedback, dashboard_stats()",
  },
];

export type AgentNode = {
  name: string;
  kind: "Rule-based (no AI)" | "Human decision" | "Database" | "Page";
  does: string;
  decides: string;
  ifItFails: string;
};

export const AGENT_MAP: AgentNode[] = [
  {
    name: "Student input",
    kind: "Page",
    does: "The student picks a subject, describes what they are stuck on, and chooses how urgent it is.",
    decides: "The student decides what to share.",
    ifItFails: "Fields are validated before anything moves on.",
  },
  {
    name: "Guardrail checker",
    kind: "Rule-based (no AI)",
    does: "Scans every message for crisis wording, emails, phone or card numbers, and requests to cheat.",
    decides: "Blocks the message and shows a safe reply. Never forwards blocked text for answering.",
    ifItFails: "Fails closed: a flagged message is blocked, and the block is counted. Rules are simple patterns, so some cases can be missed (see Impact check).",
  },
  {
    name: "Stuck validator",
    kind: "Rule-based (no AI)",
    does: "Checks that the description has enough detail (at least 8 characters and 2 words, at most 500).",
    decides: "Asks the student to add detail instead of guessing.",
    ifItFails: "The student is asked again; nothing is saved.",
  },
  {
    name: "Response builder",
    kind: "Rule-based (no AI)",
    does: "Builds a 3-step first-step plan from the subject and urgency. This is scripted text, not model output.",
    decides: "Decides whether to offer a human checkpoint (urgent today, or the student sounds lost).",
    ifItFails: "Falls back to the generic 3-step plan.",
  },
  {
    name: "Human checkpoint",
    kind: "Human decision",
    does: "Asks the student whether a human tutor should review the plan.",
    decides: "The student decides. The system never escalates on its own.",
    ifItFails: "Declining is saved as 'checkpoint declined'.",
  },
  {
    name: "Supabase log",
    kind: "Database",
    does: "Stores one row per finished chat and each thumbs rating. Public visitors can write but cannot read transcripts.",
    decides: "Row-level security allows insert only.",
    ifItFails: "The student still sees their plan; the save error is shown.",
  },
  {
    name: "Dashboard",
    kind: "Page",
    does: "Shows counts and recent rows through one stats function. No transcripts are returned.",
    decides: "A human reads the numbers and decides what to fix.",
    ifItFails: "Shows a visible error message instead of blank numbers.",
  },
];

export const RISKS = [
  {
    risk: "Students use it to cheat",
    safeguard: "Cheating phrases are blocked, and the plan gives first steps, not final answers.",
    limit: "Pattern matching can be worded around. Needs human spot-checks.",
  },
  {
    risk: "Wrong or unhelpful advice",
    safeguard: "The assistant is scripted and labelled as such; thumbs feedback is collected; a human checkpoint exists.",
    limit: "Scripted plans are generic and may not fit every problem.",
  },
  {
    risk: "Personal data is typed into a free-text box",
    safeguard: "Emails, phone numbers and card-like numbers are blocked before saving. Tester names are first name only.",
    limit: "Names or addresses written in words are not detected.",
  },
  {
    risk: "A student in distress uses the chat",
    safeguard: "Crisis wording is blocked and answered with a safe message, and the block is counted. It is not escalated to a person automatically.",
    limit: "It is not a crisis service and does not replace one. A real launch needs a local-resources review.",
  },
  {
    risk: "Public database is abused (spam rows)",
    safeguard: "Insert-only policies, length limits on text fields, no reading of private tables.",
    limit: "No rate limiting yet; spam is possible.",
  },
];

export const IMPACT_CLAIMS = [
  {
    claim: "Students get a clear first step faster than starting from nothing",
    measure: "Chat thumbs up/down ratio and tester 'clarity' ratings (1 to 5).",
    status: "Early signal only: a handful of testers. Not proof.",
  },
  {
    claim: "Students learn instead of copying",
    measure: "Would need follow-up: did the student solve a similar problem unaided?",
    status: "Not yet measured.",
  },
  {
    claim: "Human tutors are used only when needed",
    measure: "Share of chats that reached the checkpoint and how many chose a human.",
    status: "Measurable now from chat records, but the sample is small.",
  },
  {
    claim: "Willingness to pay",
    measure: "Pricing scenarios are assumptions; marketing votes show message preference, not payment.",
    status: "Not yet measured. No one has been charged.",
  },
];

export const ROADMAP = [
  {
    phase: "Now (built)",
    items: [
      { what: "Intake, scripted guided assistant, product, pricing, marketing, research, dashboard, demo", why: "The full loop works end to end on free tools." },
    ],
  },
  {
    phase: "Next (weeks to a month)",
    items: [
      { what: "Rate limiting and basic abuse protection on public inserts", why: "Build because the database is public-write today." },
      { what: "Real AI explanations, behind the same guardrails", why: "Build only if testers rate the scripted plans as too generic." },
      { what: "Larger external test (20+ students)", why: "Needed before any claim about learning outcomes." },
    ],
  },
  {
    phase: "Later (needs evidence first)",
    items: [
      { what: "Student accounts and saved history", why: "Build if testers ask to come back to earlier questions." },
      { what: "Real human tutor matching and scheduling", why: "Build only if enough students choose the human checkpoint." },
      { what: "Payments", why: "Build only after willingness to pay is tested with real people." },
    ],
  },
];
export const NOT_DOING = [
  "Claiming learning outcomes before they are measured",
  "Storing student personal data without accounts, consent and a privacy review",
  "Handling crisis situations beyond showing a safe message",
];
