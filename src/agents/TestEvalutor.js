import { llm } from "../services/ai.service.js";
import { safeParseLLMJSON } from "../lib/cleanCode.js";

export async function evaluateTest({ questions, answers }) {
  const prompt = `
You are not a teacher — You are a strict AI exam evaluator.

Rules:
1. Return ONLY JSON (no explanation outside JSON).
2. Score question between 0–1 unless stated otherwise.
3. If answer is partially correct → score = 0.5
4. If completely wrong → score = 0
5. You MUST respond in this structure:

{
  "totalScore": Number,
  "percentage": Number,
  "passed": Boolean,
  "results": [
    {
      "question": String,
      "expectedAnswer": String,
      "userAnswer": String,
      "score": Number,
      "feedback": String
    }
  ]
}

Evaluate Now ⬇️

QUESTIONS:
${JSON.stringify(questions, null, 2)}

ANSWERS:
${JSON.stringify(answers, null, 2)}
`;

  const aiResponse = await llm.invoke(prompt);
  return safeParseLLMJSON(aiResponse.content);
}
