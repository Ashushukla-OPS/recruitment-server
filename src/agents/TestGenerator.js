import { safeParseLLMJSON } from "../lib/cleanCode.js";
import { llm } from "../services/ai.service.js";
import prompt from "../lib/prompt/testGenerator.js";

export async function testGenerator(state) {
  try {
    const skillsList =
      state.skills && state.skills.length > 0
        ? state.skills.join(", ")
        : "None specified";

    const entropy = `
    USER_ENTROPY:
    - userSeed: ${state.userSeed}
    - timestamp: ${Date.now()}
    - random: ${Math.random()}
    `;
    const forbiddenList =
      state.excludeQuestions && state.excludeQuestions.length > 0
        ? state.excludeQuestions.join("\n- ")
        : "None";
    // const fullPrompt = `
    // ${prompt}

    // IMPORTANT RULES (STRICT):
    // - Generate questions ONLY from this category: ${state.category}
    // - Generate questions ONLY based on the following skills:
    //   [${skillsList}]
    // - EACH question must clearly test at least ONE of the listed skills.
    // - AND MUST explicitly include a "skill" field using one of:
    // - [${skillsList}].
    // - If a question does NOT match the category OR skills, DO NOT generate it.
    // - Questions must be UNIQUE.
    // - DO NOT reuse any of the following questions:
    // - ${forbiddenList}

    // ${entropy}

    // TEST CONFIG:
    // ${JSON.stringify(state, null, 2)}

    // OUTPUT FORMAT:
    // Return valid JSON only.
    // `;

        const fullPrompt = `
        ${prompt}
        You are a strict test-question generation engine.

        You MUST follow ALL rules below without exception.

        RUNTIME CONTEXT (AUTHORITATIVE):
        - Allowed category: ${state.category}
        - Allowed skills list: [${skillsList}]

        GENERAL BEHAVIOR RULES (ABSOLUTE):
        - Output VALID JSON only.
        - Do NOT include markdown, explanations, comments, or extra text.
        - Do NOT wrap JSON in code blocks.
        - Do NOT include trailing commas.
        - If any rule cannot be satisfied, return an empty JSON object: {}.

        QUESTION GENERATION RULES (STRICT):
        - Generate questions ONLY from the allowed category: ${state.category}.
        - Generate questions ONLY using the allowed skills list: [${skillsList}].
        - EACH question MUST clearly test at least ONE allowed skill.
        - EACH question MUST explicitly include a "skill" field whose value is EXACTLY one item from the allowed skills list.
        - If a question does NOT match the allowed category OR allowed skills list, DO NOT generate it.
        - ALL questions MUST be UNIQUE.
        - DO NOT reuse any forbidden questions provided in the input.

        MCQ STRUCTURE RULES (NON-NEGOTIABLE):
        - Each question object MUST contain ALL of the following fields:
          - "question": string  
            (A clear, complete, standalone question with no implied context.)
          - "options": array of EXACTLY 4 strings
          - "correctAnswer": number  
            (Must be either 1 or 2 ONLY.)
          - "skill": string  
            (Must be exactly one value from [${skillsList}].)
          - "source": string  
            (Must be exactly "test")

        FORBIDDEN OUTPUTS:
        - ${forbiddenList}
        - DO NOT output options without a question.
        - DO NOT omit the "question" field.
        - DO NOT return partial, placeholder, or incomplete questions.
        - DO NOT invent skills or categories.

        FAILURE RULE:
        - If you cannot generate a FULLY VALID question object that satisfies ALL rules above, DO NOT generate that question.
        - If NO valid questions can be generated, return {}.

      ${entropy}

      TEST CONFIG:
      ${JSON.stringify(state, null, 2)}

    `;
    //     const fullPrompt = `

//     You are a strict question-generation engine.
//     ${prompt}
// You MUST generate questions using the runtime context below.
// You MUST preserve context across all generated questions.

// ────────────────────────────────────
// RUNTIME CONTEXT (AUTHORITATIVE)
// ────────────────────────────────────
// Allowed category: ${state.category}
// Allowed skills: [${skillsList}]
// Question type to generate: ${state.questionType}
// number of question to generate: ${state.questionCount} IMPORTANT

// (${state.questionType} is ALWAYS one of: "MCQ" OR "THEORY")
// VERY IMPORTANT :-
// -if "type": "THEORY" ,then all the question should be of theory 
// -else all the question should be of MCQ type
// ────────────────────────────────────
// GLOBAL RULES (ABSOLUTE)
// ────────────────────────────────────
// - Output VALID JSON only.
// - Do NOT include markdown, explanations, or extra text.
// - Do NOT wrap output in code blocks.
// - Do NOT invent skills or categories.
// - If rules cannot be satisfied, return {}.

// ────────────────────────────────────
// COMMON QUESTION RULES (ALL TYPES)
// ────────────────────────────────────
// - Generate questions ONLY from the allowed category.
// - Generate questions ONLY using the allowed skills list.
// - EACH question MUST test at least ONE allowed skill.
// - EACH question MUST explicitly include a "skill" field.
// - The "skill" value MUST be exactly one value from [${skillsList}].
// - Questions MUST be unique.
// - Forbidden questions MUST NOT be reused.

// ────────────────────────────────────
// TYPE-SPECIFIC RULES (CRITICAL)
// ────────────────────────────────────

// IF questionType = "mcq":
// - Generate ONLY MCQ questions.
// - DO NOT generate theory or code questions.

// MCQ STRUCTURE (NON-NEGOTIABLE):
// Each question object MUST contain:
// - "type": "mcq"
// - "question": string
// - "options": array of EXACTLY 4 strings
// - "correctAnswer": number (1 or 2 ONLY)
// - "skill": string (from allowed skills)
// - "source": "test"

// FORBIDDEN (MCQ):
// - DO NOT return options without a question.
// - DO NOT omit any required field.

// ────────────────────────────────────

// IF questionType = "THEORY" :
// - Generate ONLY theory or coding questions.
// - DO NOT generate MCQs.

// THEORY/CODE STRUCTURE:
// Each question object MUST contain:
// - "type": "theory" OR "code"
// - "question": string
// - "expectedAnswer": string
//   (High-level explanation for theory, or correct approach/output for code)
// - "skill": string (from allowed skills)
// - "source": "test"

// FORBIDDEN (THEORY/CODE):
// - DO NOT include options or correctAnswer.
// - DO NOT generate MCQ-style questions.

// ${entropy}
// ────────────────────────────────────
// OUTPUT FORMAT (STRICT)
// ────────────────────────────────────
// {
//   "questions": [
//     { /* type-specific question object */ }
//   ]
// }
//     `;

    const res = await llm.invoke(fullPrompt);
    const parsed = safeParseLLMJSON(res.content);

    return parsed;
  } catch (err) {
    console.error("❌ Failed to generate test questions:", err);
    throw err;
  }
}
