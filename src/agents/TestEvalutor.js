import { llm } from "../services/ai.service.js";
import { safeParseLLMJSON } from "../lib/cleanCode.js";
import evaluationPrompt from "../lib/prompt/answerEvaluatorPrompt.js";

export async function evaluateTest({ questions, answers, passingScore , testPrompt}) {
  const prompt = `${evaluationPrompt}

QUESTIONS:
${JSON.stringify(questions, null, 2)}

ANSWERS:
${JSON.stringify(answers, null, 2)}

PROMPT:
${JSON.stringify(testPrompt, null, 2)}

`;

  const aiResponse = await llm.invoke(prompt);
  const parsed = safeParseLLMJSON(aiResponse.content) || {};

  let { results = [], totalScore, percentage, passed } = parsed;

  if (!Array.isArray(results)) results = [];
  let computedScore =
    typeof totalScore === "number" && !Number.isNaN(totalScore)
      ? totalScore
      : 0;

  if ((!computedScore || computedScore === 0) && results.length > 0) {
    computedScore = results.reduce(
      (sum, r) => sum + (typeof r.score === "number" ? r.score : 0),
      0
    );
  }

  const totalQuestions =
    results.length ||
    (Array.isArray(questions) ? questions.length : 0) ||
    (Array.isArray(answers) ? answers.length : 0);

  let computedPercentage =
    typeof percentage === "number" && percentage >= 0
      ? percentage
      : totalQuestions > 0
      ? (computedScore / totalQuestions) * 100
      : 0;

  let computedPassed =
    typeof passed === "boolean"
      ? passed
      : typeof passingScore === "number"
      ? computedPercentage >= passingScore
      : false;

  return {
    totalScore: computedScore,
    percentage: Number(computedPercentage.toFixed(2)),
    passed: computedPassed,
    results,
  };
}
