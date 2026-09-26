export type PromptStatus = "READY" | "NEEDS_CLARIFICATION" | "AMBIGUOUS" | "ALREADY_GOOD";
export type Action = "answer" | "suggest" | "ask" | "challenge" | "improve";
export type MessageRole = "user" | "assistant";

export interface Analysis {
  status: PromptStatus;
  summary: string;
  strengths: string[];
  issues: string[];
  assumptions: string[];
  tradeoffs: string[];
  question?: string;
  improvedPrompt?: string;
  changes?: string[];
  lesson?: string;
  action: Action;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  analysis?: Analysis;
  createdAt: number;
}

export interface Chat {
  id: string;
  title: string;
  folderId: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
}
