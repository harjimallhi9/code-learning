import type { Analysis } from "@/types/prompt";

function sentenceCase(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function detectStatus(text: string): Analysis["status"] {
  const t = text.toLowerCase();
  const vague = ["better", "good", "best", "something", "stuff", "make it professional", "make it awesome"];
  const hasVague = vague.some((word) => t.includes(word));
  const hasGoal = /\b(want|need|create|write|explain|build|design|teach|analyze|generate|improve)\b/i.test(t);
  if (hasVague && !hasGoal) return "AMBIGUOUS";
  if (hasVague) return "NEEDS_CLARIFICATION";
  if (text.length < 35) return "NEEDS_CLARIFICATION";
  if (/\b(brief|short|concise)\b/i.test(t) && /\b(extremely|very|comprehensive|everything)\b/i.test(t)) return "AMBIGUOUS";
  if (text.length > 220 && /(please|must|should|also|and)/gi.test(text)) return "READY";
  return "ALREADY_GOOD";
}

function inferGoal(text: string) {
  const cleaned = sentenceCase(text);
  if (/python/i.test(cleaned)) return "learn Python with an AI tutor";
  if (/website|web app|app|application/i.test(cleaned)) return "define and improve a software product request";
  if (/email|message|post|caption/i.test(cleaned)) return "produce polished written communication";
  if (/image|visual|illustration|logo/i.test(cleaned)) return "create a visual asset";
  if (/research|analy/i.test(cleaned)) return "get a structured analysis or research result";
  return "get a reliable result from another AI system";
}

export function analyzePrompt(text: string): Analysis {
  const prompt = sentenceCase(text);
  const status = detectStatus(prompt);
  const strengths: string[] = [];
  const issues: string[] = [];
  const assumptions: string[] = [];
  const tradeoffs: string[] = [];
  const lower = prompt.toLowerCase();

  if (/\b(want|need|create|write|explain|build|design|teach|analyze|generate|improve)\b/i.test(prompt)) strengths.push("A recognizable goal is present.");
  if (prompt.length > 70) strengths.push("There is enough context to identify the general direction.");
  if (!strengths.length) strengths.push("The idea itself is a useful starting point; the next step is making the intended result more concrete.");

  if (/\b(better|best|good|professional|awesome|nice|perfect)\b/i.test(prompt)) issues.push("A key quality target is subjective, so different AIs could interpret it differently.");
  if (prompt.length < 35) issues.push("The request is short enough that an important part of the intended outcome may still be unstated.");
  if (/\b(everything|all possible|always|never|maximum|permanent)\b/i.test(prompt)) assumptions.push("The request uses an absolute requirement that may create an important trade-off.");
  if (/\b(short|concise)\b/i.test(lower) && /\b(detailed|everything|comprehensive)\b/i.test(lower)) issues.push("There may be a tension between brevity and completeness.");

  if (/\bmaximum detail\b/i.test(lower)) tradeoffs.push("Maximum detail can improve completeness, but adaptive detail is often better for simple requests.");
  if (/\bshortest|short|concise\b/i.test(lower) && /\bevery|everything\b/i.test(lower)) tradeoffs.push("Short prompts are easier to maintain, but removing important constraints can reduce reliability.");

  let question: string | undefined;
  if (status === "AMBIGUOUS") {
    question = "What exact result do you want the AI to produce?";
  } else if (/python/i.test(prompt) && !/(beginner|intermediate|advanced|experienced|level)/i.test(prompt)) {
    question = "What is your current Python level? That changes how the tutor prompt should be designed.";
  } else if (/make my prompt better|improve my prompt/i.test(lower) && !/(concise|detailed|precise|professional|reliable)/i.test(lower)) {
    question = "Which improvement matters most here: more concise, more precise, more detailed, or more reliable?";
  }

  const needsQuestion = Boolean(question);
  const action: Analysis["action"] = needsQuestion ? "ask" : issues.length || assumptions.length || tradeoffs.length ? "suggest" : "improve";
  const improvedPrompt = needsQuestion ? undefined : buildImprovedPrompt(prompt);
  const changes = improvedPrompt ? [
    "Made the intended outcome explicit.",
    "Removed vague wording where possible.",
    "Kept the prompt only as detailed as the goal requires."
  ] : undefined;

  return {
    status,
    action,
    summary: `I understand your request as: you want to ${inferGoal(prompt)}.`,
    strengths,
    issues,
    assumptions,
    tradeoffs,
    question,
    improvedPrompt,
    changes,
    lesson: "A reliable prompt is not the longest prompt. It contains the information that materially affects the intended result.",
  };
}

function buildImprovedPrompt(text: string) {
  const clean = sentenceCase(text);
  const goal = inferGoal(clean);
  if (/python/i.test(clean)) {
    return `Act as a supportive Python tutor. Help me ${goal}. Adapt explanations to my current level, use small examples, ask me to think before giving the final answer, and keep the lesson focused on the concept I am currently learning.`;
  }
  if (/make my prompt better|improve my prompt/i.test(clean.toLowerCase())) {
    return `Help me achieve the intended result described in my original request. Preserve the original goal, remove ambiguity, add only constraints that materially improve reliability, and use a clear output format when the format affects the result.`;
  }
  return `${clean}. Focus on the intended outcome, make important assumptions explicit, avoid unnecessary detail, and structure the response so the result is easy to use.`;
}
