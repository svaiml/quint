(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__6c0c5f0e._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/app/utils/aiProvider.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAIModel",
    ()=>getAIModel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/openai/dist/index.mjs [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$openrouter$2f$ai$2d$sdk$2d$provider$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@openrouter/ai-sdk-provider/dist/index.mjs [app-edge-route] (ecmascript)");
;
;
function getAIModel(provider, options = {}) {
    const { useOptionsModel = false, model = null } = options;
    console.log(`[getAIModel] Provider: ${provider}, model: ${model}, useOptionsModel: ${useOptionsModel}`);
    if (provider === "openrouter") {
        const apiKey = process.env.OPENROUTER_API_KEY;
        console.log(`[getAIModel] OpenRouter API key present: ${!!apiKey}`);
        if (!apiKey) {
            throw new Error("OPENROUTER_API_KEY is not configured");
        }
        const openrouter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$openrouter$2f$ai$2d$sdk$2d$provider$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createOpenRouter"])({
            apiKey: apiKey
        });
        // Use selected model, env var, or default
        const modelName = model || process.env.OPENROUTER_MODEL || "x-ai/grok-code-fast-1";
        console.log(`[getAIModel] Using OpenRouter model: ${modelName}`);
        return openrouter(modelName);
    }
    // Default: OpenAI
    const apiKey = process.env.OPENAI_API_KEY;
    console.log(`[getAIModel] OpenAI API key present: ${!!apiKey}`);
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY is not configured");
    }
    const openai = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$openai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["createOpenAI"])({
        apiKey: apiKey
    });
    // For options generation, prefer OPENAI_OPTIONS_MODEL if set
    const modelName = useOptionsModel ? process.env.OPENAI_OPTIONS_MODEL || process.env.OPENAI_MODEL || "gpt-4o" : process.env.OPENAI_MODEL || "gpt-4o";
    console.log(`[getAIModel] Using OpenAI model: ${modelName}`);
    return openai(modelName);
}
}),
"[project]/app/schemas/questionOptions.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "questionOptionsSchema",
    ()=>questionOptionsSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-edge-route] (ecmascript) <export * as z>");
;
const forbiddenOptionSet = new Set([
    "other",
    "none of the above",
    "something else"
]);
const optionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(3, "Option must be at least 3 characters long");
const questionOptionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    reasoning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1),
    options: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(optionSchema).min(3).max(6),
    recommendedIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().nullable(),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
        "weak",
        "medium",
        "strong"
    ])
}).superRefine((data, ctx)=>{
    const normalizedOptions = data.options.map((option)=>option.trim().toLowerCase());
    const seen = new Set();
    for (const normalizedOption of normalizedOptions){
        if (seen.has(normalizedOption)) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: "Options must be distinct",
                path: [
                    "options"
                ]
            });
            break;
        }
        seen.add(normalizedOption);
    }
    const forbidden = normalizedOptions.find((option)=>forbiddenOptionSet.has(option));
    if (forbidden) {
        ctx.addIssue({
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
            message: "Options must not include generic choices",
            path: [
                "options"
            ]
        });
    }
    if (data.recommendedIndex !== null) {
        if (data.recommendedIndex < 0 || data.recommendedIndex >= data.options.length) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: "recommendedIndex must be within options bounds",
                path: [
                    "recommendedIndex"
                ]
            });
        }
    }
});
}),
"[project]/app/api/generate-options/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$aiProvider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/aiProvider.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/schemas/questionOptions.ts [app-edge-route] (ecmascript)");
;
;
;
const runtime = "edge";
const systemPrompt = [
    "You generate multiple-choice options for a clarifying question in a product requirements chat.",
    "",
    "Hard rules:",
    '- Return JSON that matches the provided schema exactly, with keys in this order: reasoning, options, recommendedIndex, confidence.',
    "- reasoning MUST come first and be a brief analysis before committing to options.",
    "- options MUST be 3-6 distinct, specific, concrete options that are plausible answers to the question.",
    '- Do not include generic options like "Other", "None of the above", or vague placeholders.',
    '- Never include: "Other", "None of the above", "Something else".',
    "- recommendedIndex MUST be a 0-based index into options or null if no safe recommendation.",
    '- confidence MUST be one of: "weak" | "medium" | "strong".'
].join("\n");
async function POST(req) {
    try {
        const body = await req.json();
        const questionText = body?.questionText;
        const conversationSummary = body?.conversationSummary;
        if (typeof questionText !== "string" || questionText.trim().length === 0) {
            return new Response("questionText is required", {
                status: 400
            });
        }
        const aiProvider = body?.aiProvider || "openai";
        const aiModel = body?.aiModel || null;
        let model;
        try {
            model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$aiProvider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getAIModel"])(aiProvider, {
                useOptionsModel: true,
                model: aiModel
            });
        } catch (error) {
            return new Response(JSON.stringify({
                error: error instanceof Error ? error.message : "Failed to initialize AI provider"
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
        const prompt = [
            "CONVERSATION SUMMARY:",
            typeof conversationSummary === "string" && conversationSummary.trim().length > 0 ? conversationSummary.trim() : "(none)",
            "",
            "QUESTION:",
            questionText.trim()
        ].join("\n");
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamObject"])({
            model,
            system: systemPrompt,
            prompt,
            schema: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["questionOptionsSchema"]
        });
        return result.toTextStreamResponse();
    } catch (error) {
        console.error("Generate options API error:", error);
        return new Response(JSON.stringify({
            error: "Failed to generate options"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__6c0c5f0e._.js.map