(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8808bce1._.js",
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
"[project]/app/utils/spikelog.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Spikelog - Metric tracking utility
 * https://spikelog.com
 *
 * Features:
 * - Fire-and-forget (non-blocking)
 * - Fails silently if API key missing or request fails
 * - Aggregates high-frequency data before sending
 */ __turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "spikelog",
    ()=>spikelog
]);
const SPIKELOG_ENDPOINT = "https://api.spikelog.com/api/v1/ingest";
const aggregationBuffers = new Map();
const AGGREGATION_INTERVAL_MS = 10_000; // 10 seconds
// Session tracking for active sessions heartbeat
let sessionHeartbeatInterval = null;
let activeSessionCount = 0;
/**
 * Check if we're running on the server
 */ function isServer() {
    return ("TURBOPACK compile-time value", "undefined") === "undefined";
}
/**
 * Get API key from environment (server-side only)
 */ function getApiKey() {
    if (isServer()) {
        return process.env.SPIKELOG_API_KEY || null;
    }
    //TURBOPACK unreachable
    ;
}
/**
 * Send a metric to Spikelog (fire-and-forget)
 * - Server-side: sends directly to Spikelog API
 * - Client-side: sends to /api/spikelog which forwards to Spikelog
 */ function getEnvironmentTag() {
    return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "dev";
}
async function sendMetric(chart, value, tags) {
    try {
        const mergedTags = {
            env: getEnvironmentTag(),
            ...tags ?? {}
        };
        const body = {
            chart,
            value,
            tags: mergedTags
        };
        if (isServer()) {
            // Server-side: send directly to Spikelog
            const apiKey = getApiKey();
            if (!apiKey) return;
            fetch(SPIKELOG_ENDPOINT, {
                method: "POST",
                headers: {
                    "X-API-Key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }).catch(()=>{
            // Silently ignore errors
            });
        } else //TURBOPACK unreachable
        ;
    } catch  {
    // Silently ignore errors
    }
}
/**
 * Track a metric immediately (for low-frequency events)
 */ function track(chart, value, tags) {
    sendMetric(chart, value, tags);
}
/**
 * Track a metric with aggregation (for high-frequency events)
 * Collects values and sends average every AGGREGATION_INTERVAL_MS
 */ function trackAggregated(chart, value, tags) {
    const key = chart;
    const now = Date.now();
    let buffer = aggregationBuffers.get(key);
    if (!buffer) {
        buffer = {
            values: [],
            lastFlush: now
        };
        aggregationBuffers.set(key, buffer);
    }
    buffer.values.push(value);
    // Check if it's time to flush
    if (now - buffer.lastFlush >= AGGREGATION_INTERVAL_MS) {
        flushBuffer(chart, buffer, tags);
    }
}
/**
 * Flush an aggregation buffer - sends average of collected values
 */ function flushBuffer(chart, buffer, tags) {
    if (buffer.values.length === 0) return;
    const avg = buffer.values.reduce((a, b)=>a + b, 0) / buffer.values.length;
    sendMetric(chart, Math.round(avg), tags);
    // Reset buffer
    buffer.values = [];
    buffer.lastFlush = Date.now();
}
/**
 * Flush all aggregation buffers (call on app shutdown if needed)
 */ function flushAll() {
    aggregationBuffers.forEach((buffer, chart)=>{
        flushBuffer(chart, buffer);
    });
}
// =============================================================================
// METRIC TRACKING FUNCTIONS
// =============================================================================
/**
 * #1 & #2: API Response Time tracking
 * Aggregated every 10 seconds to avoid flooding
 */ function trackApiResponseTime(endpoint, durationMs) {
    const chart = endpoint === "chat" ? "API Response Time - Chat" : "API Response Time - Generate";
    trackAggregated(chart, durationMs, {
        endpoint
    });
}
/**
 * #3: Streaming Fallback Rate
 * Tracks when streaming fails and fallback is used
 */ function trackStreamingFallback(reason) {
    track("Streaming Fallback Rate", 1, {
        reason
    });
}
/**
 * #4: Wizard Starts
 */ function trackWizardStart(source) {
    track("Wizard Starts", 1, source ? {
        source
    } : undefined);
}
/**
 * #5: Wizard Completions
 */ function trackWizardCompletion() {
    track("Wizard Completions", 1);
}
/**
 * #6: Step Drop-off tracking
 * Tracks which step users are currently on
 */ function trackStepView(step, stepName) {
    track("Step Drop-off", step, {
        step_name: stepName
    });
}
/**
 * #7: Document Downloads
 */ function trackDocumentDownload(type, docCount) {
    track("Document Downloads", docCount ?? 1, {
        type,
        doc_count: docCount ?? 1
    });
}
/**
 * #8: OpenAI Token Usage
 */ function trackTokenUsage(promptTokens, completionTokens, stepName) {
    const totalTokens = promptTokens + completionTokens;
    track("OpenAI Token Usage", totalTokens, {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        ...stepName ? {
            step_name: stepName
        } : {}
    });
}
/**
 * #9: Active Sessions
 * Call startSessionHeartbeat() when a user enters the wizard
 * Call endSessionHeartbeat() when they leave
 */ function startSessionHeartbeat() {
    activeSessionCount++;
    // Only start interval if not already running
    if (!sessionHeartbeatInterval) {
        sessionHeartbeatInterval = setInterval(()=>{
            if (activeSessionCount > 0) {
                track("Active Sessions", activeSessionCount);
            }
        }, 30_000); // Every 30 seconds
    }
    // Send immediate count
    track("Active Sessions", activeSessionCount);
}
function endSessionHeartbeat() {
    activeSessionCount = Math.max(0, activeSessionCount - 1);
    // Stop interval if no more sessions
    if (activeSessionCount === 0 && sessionHeartbeatInterval) {
        clearInterval(sessionHeartbeatInterval);
        sessionHeartbeatInterval = null;
    }
}
/**
 * #10 & #11: API Errors
 */ function trackApiError(endpoint, errorType) {
    const chart = endpoint === "chat" ? "API Errors - Chat" : "API Errors - Generate";
    track(chart, 1, errorType ? {
        error_type: errorType
    } : undefined);
}
/**
 * #12: Generation Success Rate
 * Tracks success (1) or failure (0) - aggregate to get percentage
 */ function trackGenerationResult(success, stepName) {
    track("Generation Success Rate", success ? 1 : 0, {
        success,
        ...stepName ? {
            step_name: stepName
        } : {}
    });
}
/**
 * #13: Chat Messages Per Session
 * Track message count - will be aggregated to show average
 */ function trackChatMessage(stepName) {
    trackAggregated("Chat Messages Per Session", 1, {
        step_name: stepName
    });
}
/**
 * #14: Chat Response Time
 * Measures submit-to-first-answer latency per step
 */ function trackChatResponseTime(stepName, durationMs) {
    track("Chat Response Time", durationMs, {
        step_name: stepName
    });
}
/**
 * #15: Regeneration Attempts
 */ function trackRegeneration(stepName) {
    track("Regeneration Attempts", 1, {
        step_name: stepName
    });
}
/**
 * #16: Email Subscriptions
 */ function trackEmailSubscription(success) {
    track("Email Subscriptions", success ? 1 : 0, {
        success
    });
}
const spikelog = {
    // Core functions
    track,
    trackAggregated,
    flushAll,
    // Specific metrics
    trackApiResponseTime,
    trackStreamingFallback,
    trackWizardStart,
    trackWizardCompletion,
    trackStepView,
    trackDocumentDownload,
    trackTokenUsage,
    startSessionHeartbeat,
    endSessionHeartbeat,
    trackApiError,
    trackGenerationResult,
    trackChatMessage,
    trackChatResponseTime,
    trackRegeneration,
    trackEmailSubscription
};
const __TURBOPACK__default__export__ = spikelog;
}),
"[project]/app/api/chat/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/ai/dist/index.mjs [app-edge-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$aiProvider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/aiProvider.ts [app-edge-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/spikelog.ts [app-edge-route] (ecmascript)");
;
;
;
const runtime = "edge";
// Convert messages with images to Vercel AI SDK multimodal format
function buildMultimodalMessages(messages) {
    return messages.map((msg)=>{
        if (msg.images && msg.images.length > 0 && msg.role === "user") {
            const parts = [];
            if (msg.content) {
                parts.push({
                    type: "text",
                    text: msg.content
                });
            }
            for (const dataUrl of msg.images){
                const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
                if (match) {
                    parts.push({
                        type: "image",
                        image: match[2],
                        mimeType: match[1]
                    });
                }
            }
            return {
                role: msg.role,
                content: parts
            };
        }
        return {
            role: msg.role,
            content: msg.content
        };
    });
}
async function POST(req) {
    const startTime = Date.now();
    try {
        const { messages, systemPrompt, documentInputs, stream = true, aiProvider = "openai", aiModel = null } = await req.json();
        if (!messages || !Array.isArray(messages)) {
            return new Response("Invalid messages format", {
                status: 400
            });
        }
        // Get AI model based on provider selection
        let model;
        try {
            model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$aiProvider$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["getAIModel"])(aiProvider, {
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
        // Build full system prompt with document context if available
        let fullSystemPrompt = systemPrompt || "You are a helpful assistant.";
        if (documentInputs && Object.keys(documentInputs).length > 0) {
            let documentContext = "\n\n--- PREVIOUS DOCUMENTS FOR CONTEXT ---\n\n";
            for (const [key, value] of Object.entries(documentInputs)){
                documentContext += `### ${key}:\n${value}\n\n`;
            }
            documentContext += "--- END OF PREVIOUS DOCUMENTS ---\n";
            fullSystemPrompt = fullSystemPrompt + documentContext;
        }
        console.log("\n" + "=".repeat(80));
        console.log("CHAT API REQUEST");
        console.log("=".repeat(80));
        console.log(`\nProvider: ${aiProvider}, Model: ${aiModel || "default"}`);
        console.log("\nSystem Prompt:");
        console.log(fullSystemPrompt);
        console.log("\nMessages:");
        messages.forEach((msg, idx)=>{
            console.log(`\n[${idx + 1}] ${msg.role.toUpperCase()}:`);
            console.log(msg.content);
            if (msg.images?.length) {
                console.log(`  [${msg.images.length} image(s) attached]`);
            }
        });
        console.log("\n" + "=".repeat(80) + "\n");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const processedMessages = buildMultimodalMessages(messages);
        if (stream) {
            const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["streamText"])({
                model,
                system: fullSystemPrompt,
                messages: processedMessages
            });
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["spikelog"].trackApiResponseTime("chat", Date.now() - startTime);
            return result.toTextStreamResponse();
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["generateText"])({
            model,
            system: fullSystemPrompt,
            messages: processedMessages
        });
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["spikelog"].trackApiResponseTime("chat", Date.now() - startTime);
        return new Response(result.text, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8"
            }
        });
    } catch (error) {
        console.error("Chat API error:", error);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["spikelog"].trackApiError("chat", error instanceof Error ? error.name : "Unknown");
        return new Response(JSON.stringify({
            error: "Failed to process chat request"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__8808bce1._.js.map