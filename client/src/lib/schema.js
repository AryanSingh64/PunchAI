import { z } from "zod";

export const CardSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question cannot be empty"),
  answer: z.string().min(1, "Answer cannot be empty"),
  explanation: z.string().optional().default(""),
});

export const QuizSchema = z.object({
  id: z.string(),
  question: z.string().min(1, "Question cannot be empty"),
  options: z.array(z.string()).length(4, "Must have exactly 4 options"),
  correct: z.number().int().min(0).max(3),
  explanation: z.string().optional().default(""),
});

export const StudySchema = z.object({
  topic: z.string().default("Study Session"),
  cards: z.array(CardSchema).min(1, "Must have at least one card"),
  quiz: z.array(QuizSchema).min(1, "Must have at least one quiz question"),
  provider: z.string().optional(),
});

export function validateStudyData(raw) {
  const result = StudySchema.safeParse(raw);
  if (result.success) return { data: result.data, error: null };
  const msg = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
  return { data: null, error: `Schema validation failed: ${msg}` };
}
