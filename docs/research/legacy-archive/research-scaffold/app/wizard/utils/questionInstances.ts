import type { Message } from "@/app/types";
import { summarizeConversation } from "@/app/hooks/useQuestionOptions";

export type QuestionInstance = {
  id: string;
  messageId: string;
  messageIndex: number;
  questionIndex: number;
  questionText: string;
  conversationSummary: string;
};

export function extractQuestionLines(content: string): string[] {
  const questions: string[] = [];

  // First pass: lines ending with "?"
  const lines = content.split("\n").map((line) => line.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.endsWith("?")) {
      const cleaned = line
        .replace(/^\d+[\.\)]\s*/, "")
        .replace(/^\*\*.*?\*\*[:\s]*/, "")
        .replace(/^[-•]\s*/, "")
        .trim();
      if (cleaned.length > 10) {
        questions.push(cleaned);
      }
    }
  }

  // Second pass: if no line-level questions found, split on sentence boundaries with "?"
  if (questions.length === 0) {
    const sentences = content.split(/(?<=\?)\s+/);
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed.endsWith("?") && trimmed.length > 10) {
        const cleaned = trimmed
          .replace(/^\(\d+\)\s*/, "")
          .replace(/^\d+[\.\)]\s*/, "")
          .replace(/^[-•]\s*/, "")
          .trim();
        if (cleaned.length > 10) {
          questions.push(cleaned);
        }
      }
    }
  }

  return questions;
}

type GetQuestionInstancesOptions = {
  cap?: number;
  pendingAssistantMessageId?: string | null;
  dismissedInstanceIds?: Set<string>;
};

export function getQuestionInstances(
  messages: Message[],
  {
    cap = 5,
    pendingAssistantMessageId = null,
    dismissedInstanceIds = new Set(),
  }: GetQuestionInstancesOptions = {}
): QuestionInstance[] {
  const instances: QuestionInstance[] = [];

  for (let messageIndex = 0; messageIndex < messages.length; messageIndex++) {
    const message = messages[messageIndex];
    if (!message) continue;
    if (message.role !== "assistant") continue;
    if (pendingAssistantMessageId && message.id === pendingAssistantMessageId) {
      continue;
    }

    const questions = extractQuestionLines(message.content);
    if (questions.length === 0) continue;

    const summary = summarizeConversation(messages.slice(0, messageIndex + 1));
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const questionText = questions[questionIndex];
      if (!questionText) continue;

      const id = `${message.id}:${questionIndex}`;
      if (dismissedInstanceIds.has(id)) continue;

      instances.push({
        id,
        messageId: message.id,
        messageIndex,
        questionIndex,
        questionText,
        conversationSummary: summary,
      });
    }
  }

  if (instances.length <= cap) return instances;
  return instances.slice(instances.length - cap);
}

