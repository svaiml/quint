module.exports = [
"[project]/app/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useHasHydrated",
    ()=>useHasHydrated,
    "useWizardStore",
    ()=>useWizardStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
;
;
;
const initialStepData = {
    chatHistory: [],
    generatedDoc: null,
    approved: false
};
const useWizardStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        currentStep: 1,
        isGenerating: false,
        resetCounter: 0,
        selectedFlow: "product-vision",
        aiProvider: "openai",
        aiModel: null,
        steps: {
            // Product Vision (original)
            onePager: {
                ...initialStepData
            },
            devSpec: {
                ...initialStepData
            },
            checklist: {
                ...initialStepData
            },
            agentsMd: {
                ...initialStepData
            },
            // Pre-Sales Research (new)
            firstContact: {
                ...initialStepData
            },
            claimVerification: {
                ...initialStepData
            },
            strategicAnalysis: {
                ...initialStepData
            },
            engagementModel: {
                ...initialStepData
            }
        },
        setCurrentStep: (step)=>set({
                currentStep: step
            }),
        setIsGenerating: (isGenerating)=>set({
                isGenerating
            }),
        setSelectedFlow: (flow)=>set({
                selectedFlow: flow
            }),
        setAIProvider: (provider)=>set({
                aiProvider: provider
            }),
        setAIModel: (model)=>set({
                aiModel: model
            }),
        updateStepChat: (stepKey, messages)=>set((state)=>({
                    steps: {
                        ...state.steps,
                        [stepKey]: {
                            ...state.steps[stepKey],
                            chatHistory: messages
                        }
                    }
                })),
        updateStepDoc: (stepKey, doc)=>set((state)=>({
                    steps: {
                        ...state.steps,
                        [stepKey]: {
                            ...state.steps[stepKey],
                            generatedDoc: doc
                        }
                    }
                })),
        approveStep: (stepKey)=>set((state)=>({
                    steps: {
                        ...state.steps,
                        [stepKey]: {
                            ...state.steps[stepKey],
                            approved: true
                        }
                    }
                })),
        resetWizard: ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackWizardReset();
            return set((state)=>({
                    currentStep: 1,
                    isGenerating: false,
                    resetCounter: state.resetCounter + 1,
                    // Keep selectedFlow — only reset the steps for the current flow
                    steps: {
                        // Product Vision
                        onePager: {
                            ...initialStepData
                        },
                        devSpec: {
                            ...initialStepData
                        },
                        checklist: {
                            ...initialStepData
                        },
                        agentsMd: {
                            ...initialStepData
                        },
                        // Pre-Sales Research
                        firstContact: {
                            ...initialStepData
                        },
                        claimVerification: {
                            ...initialStepData
                        },
                        strategicAnalysis: {
                            ...initialStepData
                        },
                        engagementModel: {
                            ...initialStepData
                        }
                    }
                }));
        },
        loadSampleDocs: ()=>set({
                currentStep: 1,
                isGenerating: false,
                steps: {
                    onePager: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    devSpec: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    checklist: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    agentsMd: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    firstContact: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    claimVerification: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    strategicAnalysis: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    },
                    engagementModel: {
                        chatHistory: [],
                        generatedDoc: null,
                        approved: false
                    }
                }
            })
    }), {
    name: "wizard-storage",
    partialize: (state)=>({
            currentStep: state.currentStep,
            resetCounter: state.resetCounter,
            selectedFlow: state.selectedFlow,
            aiProvider: state.aiProvider,
            aiModel: state.aiModel,
            steps: state.steps
        })
}));
const useHasHydrated = ()=>{
    const [hasHydrated, setHasHydrated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const unsubFinishHydration = useWizardStore.persist.onFinishHydration(()=>{
            setHasHydrated(true);
        });
        // Check if already hydrated
        if (useWizardStore.persist.hasHydrated()) {
            setHasHydrated(true);
        }
        return ()=>{
            unsubFinishHydration();
        };
    }, []);
    return hasHydrated;
};
}),
"[project]/app/utils/spikelog.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/wizard/components/ChatInterface.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatInterface
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-ssr] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/spikelog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
// Convert a File to a base64 data URL
function fileToDataUrl(file) {
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onload = ()=>resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Extract image files from a DataTransfer (paste or drop)
function getImageFiles(dataTransfer) {
    const files = [];
    for(let i = 0; i < dataTransfer.files.length; i++){
        const file = dataTransfer.files[i];
        if (file.type.startsWith("image/")) {
            files.push(file);
        }
    }
    return files;
}
function ChatInterface({ systemPrompt, initialMessages, onMessagesChange, documentInputs, initialGreeting, stepName, placeholder, quickStartSuggestions }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [pendingImages, setPendingImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useHasHydrated"])();
    const aiProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((s)=>s.aiProvider);
    const aiModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((s)=>s.aiModel);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(crypto.randomUUID());
    // Auto-resize textarea
    const autoResizeTextarea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((textarea)=>{
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        autoResizeTextarea(textareaRef.current);
    }, [
        input,
        autoResizeTextarea
    ]);
    const logChatMessage = async (role, content)=>{
        try {
            const clientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOrCreateClientId"])();
            await fetch("/api/log-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientId,
                    sessionId: sessionIdRef.current,
                    stepName,
                    role,
                    content
                })
            });
        } catch (error) {
            console.error("Failed to log chat message:", error);
        }
    };
    const lastMessage = messages[messages.length - 1];
    const isAssistantPending = isLoading && lastMessage?.role === "assistant" ? lastMessage.id : null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [
        messages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasHydrated) return;
        onMessagesChange(messages);
    }, [
        messages,
        onMessagesChange,
        hasHydrated
    ]);
    // Initialize messages after hydration completes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasHydrated) return;
        if (messages.length > 0) return;
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        } else if (initialGreeting) {
            setMessages([
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: initialGreeting
                }
            ]);
        }
    }, [
        hasHydrated,
        initialMessages,
        initialGreeting
    ]);
    // Auto-focus input on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>{
            textareaRef.current?.focus();
        }, 100);
        return ()=>clearTimeout(timer);
    }, []);
    // Handle adding images from file input, paste, or drop
    const addImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (files)=>{
        const dataUrls = [];
        for (const file of files){
            if (file.size > 20 * 1024 * 1024) {
                console.warn("Image too large (>20MB), skipping:", file.name);
                continue;
            }
            const dataUrl = await fileToDataUrl(file);
            dataUrls.push(dataUrl);
        }
        if (dataUrls.length > 0) {
            setPendingImages((prev)=>[
                    ...prev,
                    ...dataUrls
                ]);
        }
    }, []);
    // Handle paste (Ctrl+V with images)
    const handlePaste = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const imageFiles = getImageFiles(e.clipboardData);
        if (imageFiles.length > 0) {
            e.preventDefault();
            addImages(imageFiles);
        }
    }, [
        addImages
    ]);
    // Handle drag-and-drop
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
        const imageFiles = getImageFiles(e.dataTransfer);
        if (imageFiles.length > 0) {
            addImages(imageFiles);
        }
    }, [
        addImages
    ]);
    // Handle file input change
    const handleFileChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const files = e.target.files;
        if (files) {
            const imageFiles = Array.from(files).filter((f)=>f.type.startsWith("image/"));
            addImages(imageFiles);
        }
        // Reset so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [
        addImages
    ]);
    const removePendingImage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((index)=>{
        setPendingImages((prev)=>prev.filter((_, i)=>i !== index));
    }, []);
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!input.trim() && pendingImages.length === 0 || isLoading) return;
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim() || (pendingImages.length > 0 ? "Analyze the attached image(s)." : ""),
            images: pendingImages.length > 0 ? [
                ...pendingImages
            ] : undefined
        };
        const requestMessages = [
            ...messages,
            userMessage
        ];
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setPendingImages([]);
        setIsLoading(true);
        const responseStartTime = performance.now();
        let hasTrackedResponseTime = false;
        const trackChatResponseTime = ()=>{
            if (hasTrackedResponseTime || !stepName) return;
            hasTrackedResponseTime = true;
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackChatResponseTime(stepName, Math.max(0, Math.round(performance.now() - responseStartTime)));
        };
        if (stepName) {
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackChatMessage(stepName);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackChatMessage(stepName);
        }
        logChatMessage("user", userMessage.content);
        const updateAssistantMessage = (assistantId, content)=>{
            setMessages((prev)=>prev.map((msg)=>msg.id === assistantId ? {
                        ...msg,
                        content
                    } : msg));
        };
        const runNonStreamingFallback = async (assistantId, reason)=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackStreamingFallback(reason);
            try {
                const fallbackResponse = await fetch("/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        messages: requestMessages.map((msg)=>({
                                role: msg.role,
                                content: msg.content,
                                images: msg.images
                            })),
                        systemPrompt,
                        documentInputs,
                        stream: false,
                        aiProvider,
                        aiModel
                    })
                });
                const fallbackText = await fallbackResponse.text();
                const content = fallbackText || "No response received. Please check your API key and try again.";
                updateAssistantMessage(assistantId, content);
                trackChatResponseTime();
                logChatMessage("assistant", content);
            } catch (err) {
                updateAssistantMessage(assistantId, "Error: Connection failed. Please retry.");
            }
        };
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: requestMessages.map((msg)=>({
                            role: msg.role,
                            content: msg.content,
                            images: msg.images
                        })),
                    systemPrompt,
                    documentInputs,
                    aiProvider,
                    aiModel
                })
            });
            if (!response.ok) throw new Error("Failed to get response");
            const responseClone = response.clone();
            const assistantMessageId = (Date.now() + 1).toString();
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: assistantMessageId,
                        role: "assistant",
                        content: ""
                    }
                ]);
            if (!response.body) {
                const fallbackText = await responseClone.text();
                if (fallbackText) {
                    updateAssistantMessage(assistantMessageId, fallbackText);
                    trackChatResponseTime();
                    logChatMessage("assistant", fallbackText);
                } else {
                    await runNonStreamingFallback(assistantMessageId, "no_response_body");
                }
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let chunkCount = 0;
            while(true){
                const { done, value } = await reader.read();
                if (value) {
                    const chunk = decoder.decode(value, {
                        stream: !done
                    });
                    accumulatedText += chunk;
                    chunkCount += chunk.length;
                    trackChatResponseTime();
                    updateAssistantMessage(assistantMessageId, accumulatedText);
                }
                if (done) {
                    const finalChunk = decoder.decode();
                    if (finalChunk) {
                        accumulatedText += finalChunk;
                        chunkCount += finalChunk.length;
                        trackChatResponseTime();
                        updateAssistantMessage(assistantMessageId, accumulatedText);
                    }
                    if (chunkCount === 0) {
                        const fallbackText = await responseClone.text().catch(()=>"");
                        if (fallbackText) {
                            updateAssistantMessage(assistantMessageId, fallbackText);
                            trackChatResponseTime();
                            logChatMessage("assistant", fallbackText);
                        } else {
                            await runNonStreamingFallback(assistantMessageId, "empty_stream");
                        }
                    } else {
                        trackChatResponseTime();
                        logChatMessage("assistant", accumulatedText);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: "Error: Connection failed. Please retry."
                    }
                ]);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col h-full bg-zinc-950 ${isDragOver ? "ring-2 ring-accent ring-inset" : ""}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        children: [
            isDragOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-20 bg-zinc-950/80 flex items-center justify-center pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-2 border-dashed border-accent p-8 text-accent font-mono text-sm",
                    children: "Drop image here"
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                    lineNumber: 384,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                lineNumber: 383,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: messagesContainerRef,
                className: "flex-1 overflow-y-auto p-6 flex flex-col gap-6",
                children: [
                    messages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col items-center justify-center text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                width: "100",
                                height: "100",
                                viewBox: "0 0 120 120",
                                fill: "none",
                                className: "mb-4 opacity-70",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "25",
                                        cy: "20",
                                        r: "4",
                                        fill: "#52525b",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "45",
                                        cy: "15",
                                        r: "3",
                                        fill: "#52525b",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "60",
                                        cy: "18",
                                        r: "4",
                                        fill: "#52525b",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "75",
                                        cy: "15",
                                        r: "3",
                                        fill: "#52525b",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 399,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "95",
                                        cy: "20",
                                        r: "4",
                                        fill: "#52525b",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "30",
                                        cy: "40",
                                        r: "4",
                                        fill: "#71717a",
                                        stroke: "#a1a1aa",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 403,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "50",
                                        cy: "38",
                                        r: "5",
                                        fill: "#71717a",
                                        stroke: "#a1a1aa",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 404,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "70",
                                        cy: "38",
                                        r: "5",
                                        fill: "#71717a",
                                        stroke: "#a1a1aa",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 405,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "90",
                                        cy: "40",
                                        r: "4",
                                        fill: "#71717a",
                                        stroke: "#a1a1aa",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 406,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "40",
                                        cy: "58",
                                        r: "5",
                                        fill: "#a1a1aa",
                                        stroke: "#d4d4d8",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 409,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "60",
                                        cy: "55",
                                        r: "7",
                                        fill: "#f59e0b",
                                        stroke: "#fbbf24",
                                        strokeWidth: "2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                            attributeName: "r",
                                            values: "7;8;7",
                                            dur: "1.5s",
                                            repeatCount: "indefinite"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 411,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 410,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        cx: "80",
                                        cy: "58",
                                        r: "5",
                                        fill: "#a1a1aa",
                                        stroke: "#d4d4d8",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 413,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        stroke: "#52525b",
                                        strokeWidth: "0.5",
                                        opacity: "0.8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "25",
                                                y1: "20",
                                                x2: "30",
                                                y2: "40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 417,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "25",
                                                y1: "20",
                                                x2: "50",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 418,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "45",
                                                y1: "15",
                                                x2: "30",
                                                y2: "40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 419,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "45",
                                                y1: "15",
                                                x2: "50",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 420,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "60",
                                                y1: "18",
                                                x2: "50",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 421,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "60",
                                                y1: "18",
                                                x2: "70",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 422,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "75",
                                                y1: "15",
                                                x2: "70",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 423,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "75",
                                                y1: "15",
                                                x2: "90",
                                                y2: "40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 424,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "95",
                                                y1: "20",
                                                x2: "70",
                                                y2: "38"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 425,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "95",
                                                y1: "20",
                                                x2: "90",
                                                y2: "40"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 426,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 416,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        stroke: "#71717a",
                                        strokeWidth: "0.75",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "30",
                                                y1: "40",
                                                x2: "40",
                                                y2: "58"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 431,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "30",
                                                y1: "40",
                                                x2: "60",
                                                y2: "55"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 432,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "50",
                                                y1: "38",
                                                x2: "40",
                                                y2: "58"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 433,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "50",
                                                y1: "38",
                                                x2: "60",
                                                y2: "55"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 434,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "70",
                                                y1: "38",
                                                x2: "60",
                                                y2: "55"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 435,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "70",
                                                y1: "38",
                                                x2: "80",
                                                y2: "58"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 436,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "90",
                                                y1: "40",
                                                x2: "60",
                                                y2: "55"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 437,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                                x1: "90",
                                                y1: "40",
                                                x2: "80",
                                                y2: "58"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 438,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 430,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "50",
                                        y1: "38",
                                        x2: "60",
                                        y2: "55",
                                        stroke: "#f59e0b",
                                        strokeWidth: "2",
                                        opacity: "0.8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                            attributeName: "opacity",
                                            values: "0.4;1;0.4",
                                            dur: "0.8s",
                                            repeatCount: "indefinite"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 443,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 442,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "70",
                                        y1: "38",
                                        x2: "60",
                                        y2: "55",
                                        stroke: "#f59e0b",
                                        strokeWidth: "2",
                                        opacity: "0.8",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                            attributeName: "opacity",
                                            values: "0.4;1;0.4",
                                            dur: "0.8s",
                                            repeatCount: "indefinite",
                                            begin: "0.2s"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 446,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 445,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "30",
                                        y: "80",
                                        width: "18",
                                        height: "22",
                                        fill: "#3f3f46",
                                        stroke: "#52525b",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 450,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "51",
                                        y: "80",
                                        width: "18",
                                        height: "22",
                                        fill: "#3f3f46",
                                        stroke: "#52525b",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 451,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                        x: "72",
                                        y: "80",
                                        width: "18",
                                        height: "22",
                                        fill: "#f59e0b",
                                        stroke: "#fbbf24",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 452,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "34",
                                        y1: "86",
                                        x2: "44",
                                        y2: "86",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 454,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "34",
                                        y1: "90",
                                        x2: "42",
                                        y2: "90",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "55",
                                        y1: "86",
                                        x2: "65",
                                        y2: "86",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 456,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "55",
                                        y1: "90",
                                        x2: "63",
                                        y2: "90",
                                        stroke: "#71717a",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 457,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "76",
                                        y1: "86",
                                        x2: "86",
                                        y2: "86",
                                        stroke: "#fbbf24",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 458,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                        x1: "76",
                                        y1: "90",
                                        x2: "84",
                                        y2: "90",
                                        stroke: "#fbbf24",
                                        strokeWidth: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 459,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M60 65 L60 78",
                                        stroke: "#f59e0b",
                                        strokeWidth: "1.5",
                                        strokeDasharray: "3,2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                            attributeName: "stroke-dashoffset",
                                            values: "0;-10",
                                            dur: "0.5s",
                                            repeatCount: "indefinite"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 463,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 462,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        d: "M55 73 L60 78 L65 73",
                                        fill: "none",
                                        stroke: "#f59e0b",
                                        strokeWidth: "1.5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 465,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 394,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm font-mono text-zinc-500 opacity-50",
                                children: "Ready to bring your idea to life."
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 467,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 393,
                        columnNumber: 11
                    }, this),
                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex flex-col max-w-[90%] ${message.role === "user" ? "self-end items-end" : "self-start items-start"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-2xs font-mono uppercase tracking-wider mb-1 ${message.role === "user" ? "text-accent" : "text-[#a1a1aa]"}`,
                                    children: message.role === "user" ? "You" : "Research Assistant"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                    lineNumber: 476,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${message.role === "user" ? "bg-accent-glow border border-accent/30 text-[#e4e4e7]" : "bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa]"}`,
                                    children: [
                                        message.images && message.images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mb-2",
                                            children: message.images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: img,
                                                    alt: `Attached image ${i + 1}`,
                                                    className: "max-w-[200px] max-h-[150px] object-contain border border-zinc-600 rounded"
                                                }, i, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                    lineNumber: 491,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 489,
                                            columnNumber: 17
                                        }, this),
                                        message.content,
                                        message.role === "assistant" && isAssistantPending === message.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 inline-flex items-center gap-2 text-accent",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 animate-spin-slow",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "12",
                                                        cy: "12",
                                                        r: "10",
                                                        strokeOpacity: "0.25"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                        lineNumber: 504,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 2a10 10 0 0 1 10 10",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                        lineNumber: 505,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 503,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 502,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                    lineNumber: 482,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, message.id, true, {
                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)),
                    isLoading && lastMessage?.role === "user" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col max-w-[90%] self-start items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xs font-mono uppercase tracking-wider mb-1 text-[#a1a1aa]",
                                children: "Research Assistant"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 515,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa] px-4 py-3 text-sm leading-relaxed",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 text-accent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 animate-spin-slow",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "12",
                                                    cy: "12",
                                                    r: "10",
                                                    strokeOpacity: "0.25"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                    lineNumber: 521,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 2a10 10 0 0 1 10 10",
                                                    strokeLinecap: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                    lineNumber: 522,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 520,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-sm",
                                            children: "Analyzing..."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 524,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                    lineNumber: 519,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 518,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 514,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 530,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                lineNumber: 391,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 bg-zinc-950 border-t border-zinc-800",
                children: [
                    messages.length <= 1 && quickStartSuggestions && quickStartSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-3 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-accent",
                                        children: '>'
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 538,
                                        columnNumber: 15
                                    }, this),
                                    "Quick start suggestions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 537,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: quickStartSuggestions.map((text, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setInput(text),
                                        className: "text-left px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm text-[#a1a1aa] hover:text-[#e4e4e7] transition-all group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-zinc-700 group-hover:text-accent mr-3",
                                                children: String(i + 1).padStart(2, '0')
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                                lineNumber: 549,
                                                columnNumber: 19
                                            }, this),
                                            text
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 543,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 541,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 536,
                        columnNumber: 11
                    }, this),
                    pendingImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-3",
                        children: pendingImages.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: img,
                                        alt: `Pending upload ${i + 1}`,
                                        className: "w-16 h-16 object-cover border border-zinc-700 rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 562,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>removePendingImage(i),
                                        className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-3 h-3 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 571,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 567,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 561,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 559,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        className: "relative flex gap-3 bg-zinc-900 border border-zinc-700 pl-4 pr-1 py-1 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-200 min-h-[48px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-accent font-mono text-sm select-none",
                                    children: "$"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                    lineNumber: 580,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 579,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    ref: textareaRef,
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    onKeyDown: (e)=>{
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e);
                                        }
                                    },
                                    onPaste: handlePaste,
                                    placeholder: placeholder || "Describe your idea...",
                                    className: "w-full bg-transparent text-sm font-mono text-white focus:outline-none resize-none placeholder:text-[#a1a1aa] leading-5 overflow-y-auto py-3",
                                    rows: 1,
                                    disabled: isLoading,
                                    style: {
                                        maxHeight: '200px'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                    lineNumber: 583,
                                    columnNumber: 14
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 582,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                ref: fileInputRef,
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                onChange: handleFileChange,
                                className: "hidden"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 603,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>fileInputRef.current?.click(),
                                        disabled: isLoading,
                                        className: "w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-accent transition-colors disabled:opacity-50",
                                        title: "Upload image (or paste/drag-drop)",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 621,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 614,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: isLoading || !input.trim() && pendingImages.length === 0,
                                        className: "w-10 h-10 bg-accent hover:bg-accent-light disabled:bg-zinc-800 flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.95]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "w-4 h-4 text-zinc-950"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                            lineNumber: 629,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                        lineNumber: 624,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                                lineNumber: 612,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                        lineNumber: 578,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/ChatInterface.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/wizard/components/ChatInterface.tsx",
        lineNumber: 375,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/wizard/components/OptionsModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OptionsModal",
    ()=>OptionsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
"use client";
;
;
;
const confidenceColors = {
    weak: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    medium: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
    strong: "border-blue-400/30 bg-blue-400/10 text-blue-300"
};
function OptionsModal({ open, title, items, onClose, onSubmit }) {
    const initialSelections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>items.map((item)=>typeof item.recommendedIndex === "number" && item.recommendedIndex >= 0 && item.recommendedIndex < item.options.length ? item.recommendedIndex : null), [
        items
    ]);
    const [selectedIndices, setSelectedIndices] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialSelections);
    // Track "Other" text per question (-1 means "Other" is selected)
    const [otherTexts, setOtherTexts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>items.map(()=>""));
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!open) return;
        setSelectedIndices(initialSelections);
        setOtherTexts(items.map(()=>""));
    }, [
        initialSelections,
        open,
        items
    ]);
    if (!open) return null;
    const hasAnySelection = selectedIndices.some((idx)=>typeof idx === "number") || otherTexts.some((t)=>t.trim().length > 0);
    const answeredCount = selectedIndices.filter((idx, i)=>typeof idx === "number" || otherTexts[i]?.trim()).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        role: "dialog",
        "aria-modal": "true",
        "aria-label": title,
        className: "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "absolute inset-0 flex flex-col",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-b border-zinc-800 bg-zinc-950/95 px-6 py-4 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xs font-mono text-accent uppercase tracking-widest mb-1",
                                            children: "Research Analysis • Select Options"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 82,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lg font-bold text-white",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 85,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex items-center gap-2 ml-4 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-mono text-zinc-400",
                                            children: answeredCount
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-zinc-600",
                                            children: "/"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 89,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-mono text-zinc-500",
                                            children: items.length
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 90,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-zinc-600",
                                            children: "answered"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                            lineNumber: 91,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            "aria-label": "Close",
                            className: "p-2 text-zinc-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                lineNumber: 100,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                    lineNumber: 79,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto px-6 py-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-4xl mx-auto space-y-5",
                        children: items.map((item, itemIndex)=>{
                            const isAnswered = typeof selectedIndices[itemIndex] === "number";
                            // Use 2 columns if all options are short enough
                            const useGrid = item.options.every((o)=>o.length < 60) && item.options.length >= 3;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `border bg-zinc-950 p-5 transition-colors ${isAnswered ? "border-emerald-500/20" : "border-zinc-800"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3 mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex-shrink-0 w-7 h-7 flex items-center justify-center bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-accent",
                                                children: itemIndex + 1
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 121,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-sm font-semibold text-white leading-relaxed",
                                                    children: item.question
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 124,
                                                columnNumber: 21
                                            }, this),
                                            isAnswered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                className: "w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 130,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                        lineNumber: 120,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        role: "group",
                                        "aria-label": `Options for ${item.question}`,
                                        className: useGrid ? "grid grid-cols-2 gap-2" : "grid grid-cols-1 gap-2",
                                        children: item.options.map((option, optionIndex)=>{
                                            const isSelected = selectedIndices[itemIndex] === optionIndex;
                                            const isRecommended = item.recommendedIndex === optionIndex;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                "aria-pressed": isSelected,
                                                onClick: ()=>{
                                                    setSelectedIndices((prev)=>{
                                                        const next = [
                                                            ...prev
                                                        ];
                                                        next[itemIndex] = prev[itemIndex] === optionIndex ? null : optionIndex;
                                                        return next;
                                                    });
                                                },
                                                className: [
                                                    "w-full text-left border px-3 py-2.5 text-sm transition-all",
                                                    "focus:outline-none focus:ring-2 focus:ring-zinc-300/30",
                                                    isSelected ? "border-accent/50 bg-accent/10 text-white ring-1 ring-accent/20" : isRecommended ? "border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800/50 text-zinc-200" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 text-zinc-300"
                                                ].join(" "),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex-1",
                                                            children: option
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 29
                                                        }, this),
                                                        isRecommended && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wider flex-shrink-0 ${confidenceColors[item.confidence]}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-1.5 h-1.5 rounded-full bg-current opacity-70"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                                    lineNumber: 170,
                                                                    columnNumber: 33
                                                                }, this),
                                                                item.confidence
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                            lineNumber: 169,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                    lineNumber: 166,
                                                    columnNumber: 27
                                                }, this)
                                            }, `${optionIndex}-${option}`, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 144,
                                                columnNumber: 25
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                        lineNumber: 135,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    setSelectedIndices((prev)=>{
                                                        const next = [
                                                            ...prev
                                                        ];
                                                        next[itemIndex] = prev[itemIndex] === -1 ? null : -1;
                                                        return next;
                                                    });
                                                },
                                                className: [
                                                    "w-full text-left border px-3 py-2.5 text-sm transition-all",
                                                    "focus:outline-none focus:ring-2 focus:ring-zinc-300/30",
                                                    selectedIndices[itemIndex] === -1 ? "border-accent/50 bg-accent/10 text-white ring-1 ring-accent/20" : "border-zinc-800 bg-zinc-950 hover:bg-zinc-900/50 text-zinc-400 italic"
                                                ].join(" "),
                                                children: "Other..."
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 182,
                                                columnNumber: 21
                                            }, this),
                                            selectedIndices[itemIndex] === -1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                autoFocus: true,
                                                value: otherTexts[itemIndex] || "",
                                                onChange: (e)=>{
                                                    setOtherTexts((prev)=>{
                                                        const next = [
                                                            ...prev
                                                        ];
                                                        next[itemIndex] = e.target.value;
                                                        return next;
                                                    });
                                                },
                                                placeholder: "Type your answer...",
                                                className: "w-full mt-2 px-3 py-2.5 bg-zinc-900 border border-zinc-700 text-sm text-white font-mono focus:outline-none focus:border-accent placeholder:text-zinc-600"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                                lineNumber: 202,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                        lineNumber: 181,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, `${itemIndex}-${item.question}`, true, {
                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                lineNumber: 113,
                                columnNumber: 17
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                        lineNumber: 106,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                    lineNumber: 105,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-t border-zinc-800 bg-zinc-950/95 px-6 py-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-4xl mx-auto flex items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-zinc-500 font-mono",
                                children: "Select one option per question. Unanswered questions will be skipped."
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                lineNumber: 227,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onClose,
                                        className: "px-4 py-2 text-zinc-400 text-sm font-mono hover:text-white transition-colors",
                                        children: "Skip"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>onSubmit(selectedIndices, otherTexts),
                                        disabled: !hasAnySelection,
                                        className: "px-6 py-2 bg-accent text-zinc-950 text-sm font-mono font-bold hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                        children: [
                                            "Submit ",
                                            answeredCount > 0 ? `(${answeredCount})` : ""
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                        lineNumber: 238,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                                lineNumber: 230,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                        lineNumber: 226,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/OptionsModal.tsx",
                    lineNumber: 225,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/wizard/components/OptionsModal.tsx",
            lineNumber: 77,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/wizard/components/OptionsModal.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/schemas/questionOptions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "questionOptionsSchema",
    ()=>questionOptionsSchema
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-ssr] (ecmascript) <export * as z>");
;
const forbiddenOptionSet = new Set([
    "other",
    "none of the above",
    "something else"
]);
const optionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(3, "Option must be at least 3 characters long");
const questionOptionsSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    reasoning: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().trim().min(1),
    options: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(optionSchema).min(3).max(6),
    recommendedIndex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().int().nonnegative().nullable(),
    confidence: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
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
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
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
            code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
            message: "Options must not include generic choices",
            path: [
                "options"
            ]
        });
    }
    if (data.recommendedIndex !== null) {
        if (data.recommendedIndex < 0 || data.recommendedIndex >= data.options.length) {
            ctx.addIssue({
                code: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodIssueCode.custom,
                message: "recommendedIndex must be within options bounds",
                path: [
                    "recommendedIndex"
                ]
            });
        }
    }
});
}),
"[project]/app/hooks/useQuestionOptions.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractQuestionFromMessage",
    ()=>extractQuestionFromMessage,
    "summarizeConversation",
    ()=>summarizeConversation,
    "useQuestionOptions",
    ()=>useQuestionOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@ai-sdk/react/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/schemas/questionOptions.ts [app-ssr] (ecmascript)");
;
;
;
function extractQuestionFromMessage(content) {
    const lines = content.split("\n").map((line)=>line.trim()).filter(Boolean);
    const questionLines = lines.filter((line)=>line.endsWith("?"));
    if (questionLines.length === 0) return null;
    return questionLines[questionLines.length - 1] ?? null;
}
function summarizeConversation(messages) {
    const slice = messages.slice(Math.max(0, messages.length - 8));
    return slice.map((message)=>{
        const roleLabel = message.role === "user" ? "User" : message.role === "assistant" ? "Assistant" : message.role;
        const cleaned = message.content.replace(/\s+/g, " ").trim();
        const truncated = cleaned.length > 280 ? `${cleaned.slice(0, 277)}...` : cleaned;
        return `${roleLabel}: ${truncated}`;
    }).join("\n");
}
function useQuestionOptions({ enabled, messages }) {
    const { submit, object, isLoading, error, clear, stop } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$ai$2d$sdk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["experimental_useObject"])({
        api: "/api/generate-options",
        schema: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["questionOptionsSchema"]
    });
    const lastQuestionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const questionText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const last = messages[messages.length - 1];
        if (!last || last.role !== "assistant") return null;
        return extractQuestionFromMessage(last.content);
    }, [
        messages
    ]);
    const conversationSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>summarizeConversation(messages), [
        messages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled) return;
        if (!questionText) return;
        if (lastQuestionRef.current === questionText) return;
        lastQuestionRef.current = questionText;
        clear();
        submit({
            questionText,
            conversationSummary
        });
    }, [
        enabled,
        questionText,
        conversationSummary,
        submit,
        clear
    ]);
    return {
        questionText,
        reasoning: typeof object?.reasoning === "string" ? object.reasoning : null,
        options: Array.isArray(object?.options) ? object.options.filter((o)=>typeof o === "string") : [],
        recommendedIndex: typeof object?.recommendedIndex === "number" ? object.recommendedIndex : null,
        confidence: object?.confidence === "weak" || object?.confidence === "medium" || object?.confidence === "strong" ? object.confidence : null,
        isLoading,
        error,
        clear,
        stop,
        submit
    };
}
}),
"[project]/app/wizard/utils/questionInstances.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractQuestionLines",
    ()=>extractQuestionLines,
    "getQuestionInstances",
    ()=>getQuestionInstances
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useQuestionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useQuestionOptions.ts [app-ssr] (ecmascript)");
;
function extractQuestionLines(content) {
    const questions = [];
    // First pass: lines ending with "?"
    const lines = content.split("\n").map((line)=>line.trim()).filter(Boolean);
    for (const line of lines){
        if (line.endsWith("?")) {
            const cleaned = line.replace(/^\d+[\.\)]\s*/, "").replace(/^\*\*.*?\*\*[:\s]*/, "").replace(/^[-•]\s*/, "").trim();
            if (cleaned.length > 10) {
                questions.push(cleaned);
            }
        }
    }
    // Second pass: if no line-level questions found, split on sentence boundaries with "?"
    if (questions.length === 0) {
        const sentences = content.split(/(?<=\?)\s+/);
        for (const sentence of sentences){
            const trimmed = sentence.trim();
            if (trimmed.endsWith("?") && trimmed.length > 10) {
                const cleaned = trimmed.replace(/^\(\d+\)\s*/, "").replace(/^\d+[\.\)]\s*/, "").replace(/^[-•]\s*/, "").trim();
                if (cleaned.length > 10) {
                    questions.push(cleaned);
                }
            }
        }
    }
    return questions;
}
function getQuestionInstances(messages, { cap = 5, pendingAssistantMessageId = null, dismissedInstanceIds = new Set() } = {}) {
    const instances = [];
    for(let messageIndex = 0; messageIndex < messages.length; messageIndex++){
        const message = messages[messageIndex];
        if (!message) continue;
        if (message.role !== "assistant") continue;
        if (pendingAssistantMessageId && message.id === pendingAssistantMessageId) {
            continue;
        }
        const questions = extractQuestionLines(message.content);
        if (questions.length === 0) continue;
        const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useQuestionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeConversation"])(messages.slice(0, messageIndex + 1));
        for(let questionIndex = 0; questionIndex < questions.length; questionIndex++){
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
                conversationSummary: summary
            });
        }
    }
    if (instances.length <= cap) return instances;
    return instances.slice(instances.length - cap);
}
}),
"[project]/app/wizard/utils/selectionFormat.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatSelectionsAsMessage",
    ()=>formatSelectionsAsMessage
]);
function normalizeQuestionLabel(question) {
    return question.trim().replace(/\?+$/, "").trim();
}
function formatSelectionsAsMessage({ questions, optionsByQuestion, selectedIndices, otherTexts }) {
    const answered = [];
    for(let i = 0; i < questions.length; i++){
        const selectedIndex = selectedIndices[i];
        if (typeof selectedIndex !== "number") continue;
        const label = normalizeQuestionLabel(questions[i] ?? "");
        if (!label) continue;
        // Handle "Other" (index -1)
        if (selectedIndex === -1) {
            const otherText = otherTexts?.[i]?.trim();
            if (otherText) {
                answered.push({
                    label,
                    option: otherText
                });
            }
            continue;
        }
        const option = optionsByQuestion[i]?.[selectedIndex];
        if (typeof option !== "string" || option.trim().length === 0) continue;
        answered.push({
            label,
            option: option.trim()
        });
    }
    if (answered.length === 0) return null;
    if (answered.length === 1) {
        const only = answered[0];
        return `For "${only.label}": ${only.option}.`;
    }
    const lines = [
        "Here are my answers:"
    ];
    for (const item of answered){
        lines.push(`- ${item.label}: ${item.option}`);
    }
    return lines.join("\n");
}
}),
"[project]/app/wizard/components/ChatInterfaceWithOptions.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatInterfaceWithOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-ssr] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-ssr] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/spikelog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$OptionsModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/OptionsModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$questionInstances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/questionInstances.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/schemas/questionOptions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useQuestionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useQuestionOptions.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$selectionFormat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/selectionFormat.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
function ChatInterfaceWithOptions({ systemPrompt, initialMessages, onMessagesChange, documentInputs, initialGreeting, stepName, placeholder, quickStartSuggestions }) {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [input, setInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [pendingImages, setPendingImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDragOver, setIsDragOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasHydrated = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useHasHydrated"])();
    const aiProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((s)=>s.aiProvider);
    const aiModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((s)=>s.aiModel);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const textareaRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sessionIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(crypto.randomUUID());
    // Image helpers
    const fileToDataUrl = (file)=>new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = ()=>resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    const addImages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (files)=>{
        const urls = [];
        for (const f of files){
            if (f.size > 20 * 1024 * 1024) continue;
            urls.push(await fileToDataUrl(f));
        }
        if (urls.length) setPendingImages((prev)=>[
                ...prev,
                ...urls
            ]);
    }, []);
    const handlePaste = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        const imgs = Array.from(e.clipboardData.files).filter((f)=>f.type.startsWith("image/"));
        if (imgs.length) {
            e.preventDefault();
            addImages(imgs);
        }
    }, [
        addImages
    ]);
    const handleDragOver = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(true);
    }, []);
    const handleDragLeave = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
    }, []);
    const handleDrop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        e.preventDefault();
        setIsDragOver(false);
        const imgs = Array.from(e.dataTransfer.files).filter((f)=>f.type.startsWith("image/"));
        if (imgs.length) addImages(imgs);
    }, [
        addImages
    ]);
    const handleFileChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((e)=>{
        if (e.target.files) {
            addImages(Array.from(e.target.files).filter((f)=>f.type.startsWith("image/")));
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, [
        addImages
    ]);
    // Auto-resize textarea
    const autoResizeTextarea = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((textarea)=>{
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        autoResizeTextarea(textareaRef.current);
    }, [
        input,
        autoResizeTextarea
    ]);
    const logChatMessage = async (role, content)=>{
        try {
            const clientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOrCreateClientId"])();
            await fetch("/api/log-chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    clientId,
                    sessionId: sessionIdRef.current,
                    stepName,
                    role,
                    content
                })
            });
        } catch (error) {
            // Fire-and-forget: don't block user experience
            console.error("Failed to log chat message:", error);
        }
    };
    const lastMessage = messages[messages.length - 1];
    const isAssistantPending = isLoading && lastMessage?.role === "assistant" ? lastMessage.id : null;
    const dismissedAssistantIdsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(new Set());
    const optionsAbortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [optionsModalState, setOptionsModalState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [
        messages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasHydrated) return; // Avoid wiping persisted chat before hydration completes
        onMessagesChange(messages);
    }, [
        messages,
        onMessagesChange,
        hasHydrated
    ]);
    // Initialize messages after hydration completes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!hasHydrated) return;
        if (messages.length > 0) return;
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        } else if (initialGreeting) {
            setMessages([
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: initialGreeting
                }
            ]);
        }
    }, [
        hasHydrated,
        initialMessages,
        initialGreeting,
        messages.length
    ]);
    // Auto-focus input on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>{
            textareaRef.current?.focus();
        }, 100);
        return ()=>clearTimeout(timer);
    }, []);
    const updateAssistantMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((assistantId, content)=>{
        setMessages((prev)=>prev.map((msg)=>msg.id === assistantId ? {
                    ...msg,
                    content
                } : msg));
    }, []);
    const runNonStreamingFallback = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (assistantId, requestMessages, reason, trackChatResponseTime)=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackStreamingFallback(reason);
        try {
            const fallbackResponse = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: requestMessages.map((msg)=>({
                            role: msg.role,
                            content: msg.content
                        })),
                    systemPrompt,
                    documentInputs,
                    stream: false
                })
            });
            const fallbackText = await fallbackResponse.text();
            const content = fallbackText || "No response received. Please check your API key and try again.";
            updateAssistantMessage(assistantId, content);
            trackChatResponseTime();
            logChatMessage("assistant", content);
        } catch  {
            updateAssistantMessage(assistantId, "Error: Connection failed. Please retry.");
        } finally{}
    }, [
        documentInputs,
        logChatMessage,
        systemPrompt,
        updateAssistantMessage
    ]);
    const sendUserMessage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (text, images)=>{
        if (!text.trim() && !images?.length || isLoading) return;
        const userMessage = {
            id: Date.now().toString(),
            role: "user",
            content: text.trim() || (images?.length ? "Analyze the attached image(s)." : ""),
            images: images?.length ? images : undefined
        };
        const requestMessages = [
            ...messages,
            userMessage
        ];
        setMessages((prev)=>[
                ...prev,
                userMessage
            ]);
        setInput("");
        setPendingImages([]);
        setIsLoading(true);
        const responseStartTime = performance.now();
        let hasTrackedResponseTime = false;
        const trackChatResponseTime = ()=>{
            if (hasTrackedResponseTime || !stepName) return;
            hasTrackedResponseTime = true;
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackChatResponseTime(stepName, Math.max(0, Math.round(performance.now() - responseStartTime)));
        };
        if (stepName) {
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackChatMessage(stepName);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackChatMessage(stepName);
        }
        logChatMessage("user", userMessage.content);
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    messages: requestMessages.map((msg)=>({
                            role: msg.role,
                            content: msg.content,
                            images: msg.images
                        })),
                    systemPrompt,
                    documentInputs,
                    aiProvider,
                    aiModel
                })
            });
            if (!response.ok) throw new Error("Failed to get response");
            const responseClone = response.clone();
            const assistantMessageId = (Date.now() + 1).toString();
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: assistantMessageId,
                        role: "assistant",
                        content: ""
                    }
                ]);
            if (!response.body) {
                const fallbackText = await responseClone.text();
                if (fallbackText) {
                    updateAssistantMessage(assistantMessageId, fallbackText);
                    trackChatResponseTime();
                    logChatMessage("assistant", fallbackText);
                } else {
                    await runNonStreamingFallback(assistantMessageId, requestMessages, "no_response_body", trackChatResponseTime);
                }
                return;
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedText = "";
            let chunkCount = 0;
            while(true){
                const { done, value } = await reader.read();
                if (value) {
                    const chunk = decoder.decode(value, {
                        stream: !done
                    });
                    accumulatedText += chunk;
                    chunkCount += chunk.length;
                    trackChatResponseTime();
                    updateAssistantMessage(assistantMessageId, accumulatedText);
                }
                if (done) {
                    const finalChunk = decoder.decode();
                    if (finalChunk) {
                        accumulatedText += finalChunk;
                        chunkCount += finalChunk.length;
                        trackChatResponseTime();
                        updateAssistantMessage(assistantMessageId, accumulatedText);
                    }
                    if (chunkCount === 0) {
                        const fallbackText = await responseClone.text().catch(()=>"");
                        if (fallbackText) {
                            updateAssistantMessage(assistantMessageId, fallbackText);
                            trackChatResponseTime();
                            logChatMessage("assistant", fallbackText);
                        } else {
                            await runNonStreamingFallback(assistantMessageId, requestMessages, "empty_stream", trackChatResponseTime);
                        }
                    } else {
                        trackChatResponseTime();
                        logChatMessage("assistant", accumulatedText);
                    }
                    // Batched options modal: only attempt after the assistant has fully finished streaming.
                    try {
                        const assistantText = accumulatedText;
                        const questions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$questionInstances$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractQuestionLines"])(assistantText);
                        if (questions.length > 0 && !dismissedAssistantIdsRef.current.has(assistantMessageId)) {
                            optionsAbortRef.current?.abort();
                            const controller = new AbortController();
                            optionsAbortRef.current = controller;
                            const conversationSummary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useQuestionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["summarizeConversation"])([
                                ...requestMessages,
                                {
                                    id: assistantMessageId,
                                    role: "assistant",
                                    content: assistantText
                                }
                            ]);
                            const optionResults = await Promise.all(questions.map(async (questionText)=>{
                                const res = await fetch("/api/generate-options", {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        questionText,
                                        conversationSummary
                                    }),
                                    signal: controller.signal
                                });
                                if (!res.ok) {
                                    throw new Error("Failed to generate options");
                                }
                                const text = await res.text();
                                return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$schemas$2f$questionOptions$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["questionOptionsSchema"].parse(JSON.parse(text));
                            }));
                            if (controller.signal.aborted) break;
                            const items = optionResults.map((result, idx)=>({
                                    question: questions[idx] ?? `Question ${idx + 1}?`,
                                    options: result.options,
                                    recommendedIndex: result.recommendedIndex,
                                    confidence: result.confidence
                                }));
                            setOptionsModalState({
                                assistantMessageId,
                                questions,
                                optionsByQuestion: optionResults.map((r)=>r.options),
                                items
                            });
                        }
                    } catch  {
                    // Ignore failures; user can type manually.
                    }
                    break;
                }
            }
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        role: "assistant",
                        content: "Error: Connection failed. Please retry."
                    }
                ]);
        } finally{
            setIsLoading(false);
        }
    }, [
        documentInputs,
        isLoading,
        logChatMessage,
        messages,
        runNonStreamingFallback,
        stepName,
        systemPrompt,
        updateAssistantMessage
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex flex-col h-full bg-zinc-950 ${isDragOver ? "ring-2 ring-accent ring-inset" : ""}`,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        children: [
            isDragOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 z-20 bg-zinc-950/80 flex items-center justify-center pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "border-2 border-dashed border-accent p-8 text-accent font-mono text-sm",
                    children: "Drop image here"
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                    lineNumber: 439,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                lineNumber: 438,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                multiple: true,
                onChange: handleFileChange,
                className: "hidden"
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                lineNumber: 443,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$OptionsModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OptionsModal"], {
                open: !!optionsModalState,
                title: "Answer these questions",
                items: optionsModalState?.items ?? [],
                onClose: ()=>{
                    if (optionsModalState) {
                        dismissedAssistantIdsRef.current.add(optionsModalState.assistantMessageId);
                    }
                    setOptionsModalState(null);
                    textareaRef.current?.focus();
                },
                onSubmit: (selectedIndices, otherTexts)=>{
                    if (!optionsModalState) return;
                    const messageText = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$selectionFormat$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatSelectionsAsMessage"])({
                        questions: optionsModalState.questions,
                        optionsByQuestion: optionsModalState.optionsByQuestion,
                        selectedIndices,
                        otherTexts
                    });
                    dismissedAssistantIdsRef.current.add(optionsModalState.assistantMessageId);
                    setOptionsModalState(null);
                    if (!messageText) {
                        textareaRef.current?.focus();
                        return;
                    }
                    void sendUserMessage(messageText);
                }
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: messagesContainerRef,
                className: "flex-1 overflow-y-auto p-6 flex flex-col gap-6",
                children: [
                    messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `flex flex-col max-w-[90%] ${message.role === "user" ? "self-end items-end" : "self-start items-start"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `text-2xs font-mono uppercase tracking-wider mb-1 ${message.role === "user" ? "text-accent" : "text-[#a1a1aa]"}`,
                                    children: message.role === "user" ? "You" : "Research Assistant"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                    lineNumber: 489,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap w-full ${message.role === "user" ? "bg-accent-glow border border-accent/30 text-[#e4e4e7]" : "bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa]"}`,
                                    children: [
                                        message.images && message.images.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mb-2",
                                            children: message.images.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: img,
                                                    alt: `Attached ${i + 1}`,
                                                    className: "max-w-[200px] max-h-[150px] object-contain border border-zinc-600 rounded"
                                                }, i, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 505,
                                            columnNumber: 17
                                        }, this),
                                        message.content,
                                        message.role === "assistant" && isAssistantPending === message.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-2 inline-flex items-center gap-2 text-accent",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-4 h-4 animate-spin-slow",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "12",
                                                        cy: "12",
                                                        r: "10",
                                                        strokeOpacity: "0.25"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                        lineNumber: 521,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M12 2a10 10 0 0 1 10 10",
                                                        strokeLinecap: "round"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                        lineNumber: 522,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                lineNumber: 514,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 513,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                    lineNumber: 497,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, message.id, true, {
                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                            lineNumber: 481,
                            columnNumber: 11
                        }, this)),
                    isLoading && lastMessage?.role === "user" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col max-w-[90%] self-start items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-2xs font-mono uppercase tracking-wider mb-1 text-[#a1a1aa]",
                                children: "Vibe Scaffold Assistant"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 532,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa] px-4 py-3 text-sm leading-relaxed",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 text-accent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-5 h-5 animate-spin-slow",
                                            viewBox: "0 0 24 24",
                                            fill: "none",
                                            stroke: "currentColor",
                                            strokeWidth: "2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                    cx: "12",
                                                    cy: "12",
                                                    r: "10",
                                                    strokeOpacity: "0.25"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                    lineNumber: 544,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M12 2a10 10 0 0 1 10 10",
                                                    strokeLinecap: "round"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                    lineNumber: 545,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono text-sm",
                                            children: "Processing request..."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 550,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 535,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                        lineNumber: 531,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                        lineNumber: 556,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                lineNumber: 476,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-6 bg-zinc-950 border-t border-zinc-800",
                children: [
                    messages.length <= 1 && quickStartSuggestions && quickStartSuggestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-4 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-3 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-accent",
                                        children: "›"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 565,
                                        columnNumber: 17
                                    }, this),
                                    "Quick start suggestions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 564,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-2",
                                children: quickStartSuggestions.map((text, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setInput(text),
                                        className: "text-left px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm text-[#a1a1aa] hover:text-[#e4e4e7] transition-all group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "font-mono text-zinc-700 group-hover:text-accent mr-3",
                                                children: String(i + 1).padStart(2, "0")
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                                lineNumber: 576,
                                                columnNumber: 21
                                            }, this),
                                            text
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 570,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 568,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                        lineNumber: 563,
                        columnNumber: 13
                    }, this),
                    pendingImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 mb-3",
                        children: pendingImages.map((img, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative group",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: img,
                                        alt: `Pending ${i + 1}`,
                                        className: "w-16 h-16 object-cover border border-zinc-700 rounded"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 590,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setPendingImages((prev)=>prev.filter((_, j)=>j !== i)),
                                        className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                            className: "w-3 h-3 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 592,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 591,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, i, true, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 589,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                        lineNumber: 587,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: (e)=>{
                            e.preventDefault();
                            const imgs = pendingImages.length > 0 ? [
                                ...pendingImages
                            ] : undefined;
                            void sendUserMessage(input, imgs);
                        },
                        className: "relative flex gap-3 bg-zinc-900 border border-zinc-700 pl-4 pr-1 py-1 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-200 min-h-[48px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-accent font-mono text-sm select-none",
                                    children: "$"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                    lineNumber: 608,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 607,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex items-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                    ref: textareaRef,
                                    value: input,
                                    onChange: (e)=>setInput(e.target.value),
                                    onKeyDown: (e)=>{
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            const imgs = pendingImages.length > 0 ? [
                                                ...pendingImages
                                            ] : undefined;
                                            void sendUserMessage(input, imgs);
                                        }
                                    },
                                    onPaste: handlePaste,
                                    placeholder: placeholder || "Describe your idea...",
                                    className: "w-full bg-transparent text-sm font-mono text-white focus:outline-none resize-none placeholder:text-[#a1a1aa] leading-5 overflow-y-auto py-3",
                                    rows: 1,
                                    disabled: isLoading,
                                    style: {
                                        maxHeight: "200px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                    lineNumber: 611,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 610,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>fileInputRef.current?.click(),
                                        disabled: isLoading,
                                        className: "w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-accent transition-colors disabled:opacity-50",
                                        title: "Upload image (or paste/drag-drop)",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 633,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 632,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: isLoading || !input.trim() && pendingImages.length === 0,
                                        className: "w-10 h-10 bg-accent hover:bg-accent-light disabled:bg-zinc-800 flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.95]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "w-4 h-4 text-zinc-950"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                            lineNumber: 640,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                        lineNumber: 635,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                                lineNumber: 631,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                        lineNumber: 599,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
                lineNumber: 559,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/wizard/components/ChatInterfaceWithOptions.tsx",
        lineNumber: 431,
        columnNumber: 5
    }, this);
}
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs) <export default as minpath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minpath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
}),
"[externals]/node:process [external] (node:process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:process", () => require("node:process"));

module.exports = mod;
}),
"[externals]/node:process [external] (node:process, cjs) <export default as minproc>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "minproc",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
}),
"[externals]/node:url [external] (node:url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:url", () => require("node:url"));

module.exports = mod;
}),
"[externals]/node:url [external] (node:url, cjs) <export fileURLToPath as urlToPath>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "urlToPath",
    ()=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"]
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
}),
"[project]/app/hooks/useSyncScroll.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSyncScroll",
    ()=>useSyncScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
function useSyncScroll() {
    const elementRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastScrollTime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isScrollingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const handleScroll = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((event)=>{
        // Skip on mobile
        if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.innerWidth < 768) //TURBOPACK unreachable
        ;
        // Prevent feedback loops
        if (isScrollingRef.current) return;
        // Throttle to ~60fps
        const now = Date.now();
        if (now - lastScrollTime.current < 16) return;
        lastScrollTime.current = now;
        const element = event.target;
        if (!element) return;
        // Calculate scroll percentage within the element
        const scrollTop = element.scrollTop;
        const scrollHeight = element.scrollHeight;
        const clientHeight = element.clientHeight;
        const maxScrollTop = scrollHeight - clientHeight;
        // Skip if element has no scrollable content
        if (maxScrollTop <= 0) return;
        const scrollPercentage = scrollTop / maxScrollTop;
        // Calculate corresponding window scroll position
        const windowMaxScroll = document.documentElement.scrollHeight - window.innerHeight;
        // Skip if page has no scrollable content
        if (windowMaxScroll <= 0) return;
        const targetWindowScroll = scrollPercentage * windowMaxScroll;
        // Apply scroll to window
        isScrollingRef.current = true;
        window.scrollTo({
            top: targetWindowScroll,
            behavior: 'auto'
        });
        // Reset flag after frame to prevent feedback loops
        requestAnimationFrame(()=>{
            isScrollingRef.current = false;
        });
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const element = elementRef.current;
        if (!element) return;
        element.addEventListener('scroll', handleScroll, {
            passive: true
        });
        return ()=>{
            element.removeEventListener('scroll', handleScroll);
        };
    }, [
        handleScroll
    ]);
    return elementRef;
}
}),
"[project]/app/wizard/components/DocumentPreview.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DocumentPreview
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/react-markdown/lib/index.js [app-ssr] (ecmascript) <export Markdown as default>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code.js [app-ssr] (ecmascript) <export default as Code>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useSyncScroll$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useSyncScroll.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function DocumentPreview({ content, onRegenerate }) {
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("rendered");
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useSyncScroll$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncScroll"])();
    const copyToClipboard = ()=>{
        navigator.clipboard.writeText(content);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col bg-zinc-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center px-6 py-3 border-b border-zinc-800 bg-zinc-950",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewMode("rendered"),
                                className: `flex items-center gap-2 px-5 py-3 text-2xs font-mono uppercase tracking-wider border-b-2 transition-all ${viewMode === "rendered" ? "text-accent border-accent" : "text-[#a1a1aa] border-transparent hover:text-[#e4e4e7]"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                                        lineNumber: 37,
                                        columnNumber: 13
                                    }, this),
                                    "Preview"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                                lineNumber: 29,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setViewMode("raw"),
                                className: `flex items-center gap-2 px-5 py-3 text-2xs font-mono uppercase tracking-wider border-b-2 transition-all ${viewMode === "raw" ? "text-accent border-accent" : "text-[#a1a1aa] border-transparent hover:text-[#e4e4e7]"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Code$3e$__["Code"], {
                                        className: "w-3 h-3"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                                        lineNumber: 48,
                                        columnNumber: 13
                                    }, this),
                                    "Source"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                        lineNumber: 28,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: copyToClipboard,
                        className: "text-[#a1a1aa] hover:text-accent transition-colors",
                        title: "Copy to Clipboard",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                            lineNumber: 58,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                        lineNumber: 53,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: scrollContainerRef,
                className: "flex-1 overflow-y-auto custom-scrollbar bg-zinc-800 border-t border-zinc-800",
                children: viewMode === "raw" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 md:p-8 font-mono text-sm leading-relaxed text-[#e4e4e7] whitespace-pre-wrap",
                    children: content
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                    lineNumber: 68,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 md:p-8 lg:p-12 max-w-5xl mx-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                        className: "prose prose-invert max-w-none",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$markdown$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__Markdown__as__default$3e$__["default"], {
                            children: content
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                            lineNumber: 74,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                        lineNumber: 73,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                    lineNumber: 72,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/wizard/components/DocumentPreview.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/wizard/utils/sampleDocs.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Sample documents for quick testing and development
__turbopack_context__.s([
    "sampleDocs",
    ()=>sampleDocs
]);
const sampleDocs = {
    onePager: `# One-Pager - Photo Captioner App

## Executive Summary
A lightweight mobile app that generates engaging captions for photos to help casual social sharers craft on‑point, shareable text quickly. The MVP focuses on speed, simplicity, and high‑quality caption suggestions that users can copy and paste into their preferred social apps.

## Problem Statement
Social media users often struggle to find short, engaging captions for photos. They want quick, creative text without spending time thinking of the right tone or wording. This leads to friction and lost opportunities to post consistently.

## Target Audience
- Primary: Casual social sharers - everyday users who post photos on social platforms (friends, family, lifestyle posts).
- Goals: Post frequently with minimal friction, make photos more engaging, sound natural/fun without effort.
- Skill level: Non‑technical, expects simple, fast mobile experiences.
- Platforms they post to: Instagram, Facebook, TikTok, Snapchat, Twitter/X - but the app itself is a mobile companion (iOS/Android) used to generate copy that users paste into these apps.

## Ideal Customer Profile
- Age 16–45, frequent smartphone photo takers
- Posts several times a week, seeks quick social polish
- Values speed and simplicity over advanced customization
- Willing to use a small companion app to improve captions

## Value Proposition
Deliver three high‑quality, tone‑matched caption suggestions for any photo in seconds so casual users can compose and post with less friction and more confidence.

## Platform & Tech Recommendations
- Native mobile app: iOS and Android (single codebase options like React Native or Flutter are acceptable for faster delivery; native Swift/Kotlin for best performance).
- Backend service for caption generation (model inference + moderation), with optional on‑device capabilities for privacy/offline later.

## Core User Flow (MVP)
1. Open app (no account required for MVP; optional opt‑in).
2. Upload photo / take new photo (camera + photo library).
3. Select tone from presets: Funny, Heartfelt, Witty.
4. Tap "Generate" → show progress / spinner.
5. Display three caption suggestions (each clearly labeled with tone and a copy button).
6. User taps "Copy" on chosen caption (clipboard + toast confirmation).
7. Optionally: quick "Share" icon to open the chosen social app (deep linking) - considered for Phase 2.

## Screens & Micro-interactions
- Launch / Home: camera and upload buttons, tone selector.
- Generator / Result: thumbnail of the photo, list of 3 caption cards (text, copy button, small “like”/save icon for future phases).
- Loading state: progress indicator, friendly message.
- Error state: helpful retry message (e.g., "We couldn't generate captions for this image. Try another photo.")
- Permissions: camera & photos permissions prompts with clear rationale.

## MVP Feature List (Required)
- Photo upload (camera + gallery).
- Caption generation: produce 3 suggestions per photo.
- Tone presets: funny, heartfelt, witty.
- Copy button to copy caption to clipboard.
- Lightweight UX: fast feedback and minimal friction.
- Basic safety filtering (block explicit / illegal content).

## Out of Scope for MVP (But Recommended for Roadmap)
- Account/sign‑in (optional history, favorites).
- Hashtag and emoji suggestions.
- Platform specific length presets.
- Advanced editing UI or multi‑caption templates.
- On‑device full model inference (future privacy option).

## Outputs & Constraints
- Exactly 3 caption suggestions per photo.
- Each caption labeled implicitly by tone or labeled generically (tone selector affects all suggestions).
- Aim for generation latency < 3–5 seconds (server inference target).

## Data & Privacy
- Default: do not store images or captions longer than required for inference.
- Transient image upload with short TTL; delete within X hours (configurable).
- Explicit opt‑in for history/favorites if accounts are introduced.
- Provide clear privacy copy during onboarding (what's uploaded, how it's used).
- Comply with GDPR/CCPA requirements for user data deletion and export.

## Safety & Moderation
- Content moderation pipeline to block/flag:
  - Hate speech, explicit sexual content, violence, illegal activity.
  - Sensitive persons/face recognition concerns.
- Image safety model to detect restricted content before captioning.
- Rate limits and filters to reduce abuse.

## Technical Architecture (High Level)
- Mobile clients (iOS/Android)
  - Simple UI, photo picker/camera, tone selector, network calls, clipboard support.
- Backend API service
  - Inference endpoint that accepts image + tone, returns 3 captions.
  - Moderation endpoint that checks images/text.
  - Authless for MVP but design to support authenticated calls.
- ML stack options
  - Vision + caption generation approach:
    - Off‑the‑shelf image captioning models (BLIP-2, OFA, ViT + decoder) to produce initial text embeddings / captions.
    - LLM (server-side) for style/tone refinement (prompt-based) or end‑to‑end multimodal model if available (e.g., multimodal LLMs).
  - Option A (MVP, fastest): server-side inference with a pre-trained image captioning model + lightweight prompt engineering to yield three variants in requested tones.
  - Option B (privacy/offline later): smaller on‑device models (quantized) for basic captioning; fallback to cloud for higher quality.
- Infrastructure
  - Containerized inference workers (K8s, autoscaling).
  - CDN for static assets, object storage for transient images.
  - Monitoring, logging, and metrics pipeline.

## Integration & APIs
- Clipboard API on mobile for copy action.
- Optional deep links / share sheet integration to open social apps.
- Backend: REST/JSON endpoints for generate/moderate.
- Analytics: event tracking for generate, copy, retry, errors.

## Performance & Reliability Targets
- Typical end‑to‑end latency: < 3–5s on 4G/Wi‑Fi.
- 99% availability during core hours; graceful degradation (client‑side cached messages) if backend is unavailable.
- Reasonable cost per inference (optimize batching, model size).

## Metrics & Success Criteria
Initial KPIs (first 90 days after launch)
- Conversion: % of users who generate at least one caption per session.
- Engagement: average captions generated per user / week.
- Copy rate: % of generated captions that are copied.
- Retention: 7‑day and 30‑day retention for active users.
- Latency + error rates: average generation time, % failed generations.
- Qualitative: user feedback rating on caption helpfulness (in‑app NPS/quick thumbs up/down).

## Risks & Mitigations
- Low relevance/quality of captions → iterate on prompts/models, collect anonymous feedback, A/B test tones and model variants.
- Privacy concerns about image uploads → minimize storage, clear messaging, offline mode later.
- Safety exposure (biased/inappropriate captions) → strong moderation, human review of flagged cases, model filters.
- Cost of inference at scale → use model distillation, caching, and batching; tune quality/latency tradeoffs.

## Roadmap (High Level)
Phase 1 - MVP (8-12 weeks)
- Core mobile UI, photo upload, tone selector, backend endpoints.
- Server-side caption generation pipeline returning 3 suggestions.
- Basic moderation and logging.
- Analytics and simple telemetry.
Phase 2 - Improvements (12-24 weeks)
- Improve quality with larger models / prompt refinement.
- Add save history, favorites, simple account option.
- Add sharing integrations (deep links / share sheet).
- A/B testing framework for tones and copy variants.
Phase 3 - Privacy & Scale (ongoing)
- On‑device capability for offline/private captioning.
- Advanced personalization and hashtag/emoji suggestions.
- Monetization experiments (premium features, coins, or subscriptions).

## Team & Dependencies
- Product manager / designer for UX flows and copy.
- Mobile engineers (iOS + Android or cross‑platform).
- ML engineer(s) for model selection, prompts, and inference pipeline.
- Backend engineer(s) for API, infra, storage, and ops.
- QA & moderation resources.
- Legal / privacy advisor for compliance.

## Next Steps (Immediate)
1. Validate assumptions with a 1‑week research spike: prototype prompt pipeline using sample images and candidate captioning models; measure quality and latency.
2. Design mockups for core screens (upload → tone → results → copy).
3. Build a technical proof of concept (one backend inference endpoint + simple Android/iOS client).
4. Run small closed beta with internal users to gather quality and UX feedback.

## Appendix: Minimal API Contract (Example)
- POST /generate
  - Body: { image: base64 | presignedUrl, tone: "funny"|"heartfelt"|"witty", options: {num_suggestions:3} }
  - Response: { suggestions: [{ id, text, safety_flags }], processing_time_ms }
- POST /moderate
  - Body: { image, text }
  - Response: { safe: boolean, issues: [] }

## Assumptions
- Users prefer copying to clipboard over deep sharing for MVP.
- Three suggestions per photo is a sweet spot for choice without overwhelm.
- Casual users will prioritize speed and simplicity over deep customization.

## Contact / Ownership
Product owner: [TBD]  
Lead engineering: [TBD]  
ML lead: [TBD]

End of one-pager - ready for review with product & engineering leadership.`,
    devSpec: `# Photo Captioner - Developer Specification (MVP)

Status: Final (approved decisions incorporated)  
Target audience: Mobile + Backend engineers ready to implement

Table of contents
1. Summary & goals
2. High-level architecture
3. Non-functional requirements & constraints
4. Data & privacy handling
5. Backend design & orchestration flow
6. API contract (endpoints, schemas, errors)
7. Prompt design & OpenAI interaction
8. Moderation & safety pipeline
9. Image handling rules
10. Authentication, authorization & abuse prevention
11. Rate limiting design (per-user)
12. Storage, lifecycle & retention
13. Admin & moderation tooling
14. Logging, analytics & monitoring
15. CI/CD, deployment & infra configuration
16. Dev stack, libraries & repo structure
17. Error handling & client UX mapping
18. Testing plan (unit, integration, e2e, load, security)
19. Implementation milestones & acceptance criteria
20. Appendices: env vars, sample prompts, sample error payloads, Redis key patterns

---

1) Summary & goals
- Purpose: Build an MVP mobile app (Expo React Native + TypeScript) that returns exactly 3 caption suggestions per photo in a selected tone (funny / heartfelt / witty).
- MVP constraints and decisions:
  - Mobile: React Native (Expo) + TypeScript.
  - Backend: Node.js (18+) + TypeScript + Fastify (recommended).
  - Inference: OpenAI gpt-5-nano (multimodal).
  - Image moderation: Google Cloud Vision SafeSearch.
  - Text moderation: OpenAI Moderation endpoint.
  - Auth: Firebase Authentication - passwordless email (magic link).
  - Storage: Google Cloud Storage (transient uploads, 6-hour TTL).
  - Host backend: Google Cloud Run (containerized).
  - Rate limiting: per-user burst limits using Redis (Cloud Memorystore).
  - No image->text fallback pipeline; if model multimodal call fails, return error to client.
  - No persistent history/favorites for MVP (deferred).
  - Emojis allowed sparsely; hashtags not included.
- Target latency: typical end-to-end < 3–5 seconds.

---

2) High-level architecture
- Mobile client (Expo React Native)
  - Photo picker / camera; compress & downscale (<=2MB preferred; enforce <=5MB).
  - Get presigned upload URL, PUT image to GCS, call /generate.
  - Show spinner → display 3 suggestions.
  - Firebase Auth integration (magic link).
  - Firebase Analytics + Crashlytics (or Sentry fallback).
- Backend (Cloud Run, single container service)
  - Endpoints: /presign-upload, /generate, /health, admin endpoints (protected).
  - Services invoked: Google Cloud Storage, Google Vision (SafeSearch), OpenAI (gpt-5-nano + Moderation), Firebase Admin (verify tokens), Redis (rate-limits), Cloud Logging / BigQuery.
- GCS lifecycle: delete uploaded images after TTL = 6 hours.
- Firestore: used for admin flagged events collection and admin whitelist (small set) - no user history.
- Admin: Firebase Console for manual review + Cloud Run admin endpoints to manage whitelist/ban.

Sequence (short)
1. Client requests /presign-upload with Firebase ID token.
2. Backend returns presigned PUT URL and objectPath.
3. Client uploads image directly to GCS.
4. Client calls /generate with objectPath + tone + Firebase ID token.
5. Backend checks rate limit; downloads object (or reads from GCS), strips EXIF, validates size/format; runs Vision SafeSearch.
6. If safe, call OpenAI gpt-5-nano (image + prompt) to request JSON with three caption suggestions.
7. Parse JSON (1 retry allowed on parse failure). Run OpenAI Moderation on each caption, regenerate flagged captions once if flagged.
8. Return up to 3 safe captions. If fewer than 3 safe captions, return explanation and status.
9. Log events to Cloud Logging and write flagged events to Firestore for admin review.

---

3) Non-functional requirements & constraints
- Availability: target 99% during core hours.
- Latency: median < 3s; 95th percentile < 5s for generation.
- Cost control: require sign-in; burst & concurrency limits (no daily cap).
- Security: no public access to presigned URLs; verify Firebase tokens server-side; use Workload Identity/Secret Manager for secrets.
- Privacy: images ephemeral (6-hour TTL), strip EXIF/geo metadata before any external calls.

---

4) Data & privacy handling
- Images:
  - Allowed formats: JPEG, PNG, HEIC (reject animated GIFs).
  - Client compress to <= 2 MB when possible; backend enforces <= 5 MB.
  - Downscale longest side ≤ 1024 px (client preferred; server fallback via sharp).
  - Strip EXIF/geo metadata server-side before any storage or external transfer.
  - Store in GCS with lifecycle rule: delete after 6 hours.
- Captions:
  - Do not store caption text unless user explicitly opts in to history (deferred for MVP - none).
  - Server logs may contain caption hashes (SHA256) and safety flags. Do not log raw image bytes to analytics.
- Auth data:
  - Use Firebase ID token on requests; store minimal metadata (uid) if needed in Firestore for admin actions.

Compliance:
- Support account deletion and data export (no history stored for MVP reduces obligations). If storing flagged events, include a retention policy.

---

5) Backend orchestration flow (detailed)
- /presign-upload
  - Authenticate via Firebase ID token.
  - Validate contentType and filename.
  - Generate presigned PUT URL for GCS with TTL 15 minutes. Return objectPath.
  - Response includes maxUploadBytes = 5_242_880 (5 MB).
- /generate (main orchestration)
  1. Verify Firebase ID token -> get uid.
  2. Rate-limit check (Redis) for uid: ensure not exceeding burst (5 per 60s) and concurrency (1).
     - If concurrency limit hit: return 429 with Retry-After.
  3. Validate objectPath: must reference your bucket and must exist.
  4. Fetch object metadata from GCS. If content type unsupported or size >5MB -> 400.
  5. Download object to memory/temporary file, run sharp:
     - Strip EXIF.
     - If dimensions > 1024 px longest side, downscale (resize).
     - Re-encode as JPEG if needed.
  6. Call Google Vision SafeSearch on the processed image.
     - If flagged above thresholds -> return 422 { code: "image_flagged", userMessage: "We can’t create captions for this image. Try a different photo." }.
     - Write a moderation_flags record to Firestore for flagged events.
  7. Build OpenAI gpt-5-nano prompt (system + user) including the presigned image URL (objectPath signed URL or GCS URL accessible by OpenAI).
     - Note: generate a short-lived signed URL specifically for OpenAI fetch if needed; ensure it expires quickly (e.g., 5 minutes). Alternatively base64-embed small image if supported and within size limits (not preferred).
  8. Call OpenAI image-enabled gpt-5-nano with model parameters:
     - temperature: 0.6
     - max_tokens: 300
     - require valid JSON output per schema
  9. Parse JSON. If parse fails:
     - Retry once: add a short follow-up prompt asking model to output valid JSON only.
     - If still fails -> return 500 with code "model_error" and userMessage "We couldn’t generate captions for this photo right now. Please try again."
  10. Run OpenAI Moderation API on each suggestion text.
     - If a caption is flagged, attempt 1 regeneration for that caption with system instruction to be safe and avoid flagged content.
     - If still flagged, drop/redact that suggestion.
  11. If number of safe captions < 3:
     - Return the safe captions + field explanation (why fewer).
     - Optionally include status 'partial' and log event for admin review.
  12. Return 200 with suggestions array (exactly as many safe captions) and processing_time_ms.
  13. Decrement concurrency marker in Redis.
- Errors: map to appropriate HTTP status codes and user-friendly messages (see Error handling section).

Timeouts & retries:
- External calls: Vision (timeout 3s), OpenAI call (timeout 8s). Adjust timeouts per observed latency.
- Retries: network-level transient errors -> exponential backoff with max 2 retries; parse/regeneration retries as above.

---

6) API contract (MVP endpoints)

Common:
- All endpoints that act on user or start inference require Authorization: Bearer <Firebase ID token>.
- Response content-type: application/json
- All responses should include request_id in headers (X-Request-ID) for tracing.

1) POST /presign-upload
- Auth: required
- Request body:
  {
    "filename": "string",        // client-provided
    "contentType": "image/jpeg"  // must be one of image/jpeg, image/png, image/heic
  }
- Response 200:
  {
    "uploadUrl": "https://storage.googleapis.com/....", // presigned PUT URL
    "objectPath": "gs://bucket-name/path/to/object.jpg", // canonical path used bygenerate
    "expiresAt": "2025-01-01T00:00:00Z",
    "maxUploadBytes": 5242880
  }
- Errors:
  - 400: invalid contentType/filename
  - 401: invalid/expired token
  - 429: rate-limited (rare)

2) POST /generate
- Auth: required
- Request body:
  {
    "objectPath": "gs://bucket-name/path/to/object.jpg",
    "tone": "funny" | "heartfelt" | "witty"
  }
- Success 200:
  {
    "suggestions": [
      {
        "id": "uuid-v4",
        "text": "Short caption text…",
        "length_bucket": "short" | "medium" | "long",
        "safety_flags": [] // array of strings, empty if none
      },
      ...
      // up to 3 items
    ],
    "model": "gpt-5-nano",
    "processing_time_ms": 1234,
    "status": "ok"
  }
- Partial success 200 (fewer than 3 safe captions):
  {
    "suggestions": [ ... ],
    "model": "gpt-5-nano",
    "processing_time_ms": 2345,
    "status": "partial",
    "explanation": "1 caption removed because it violated content rules"
  }
- Error responses:
  - 400: invalid params
  - 401: invalid/expired token
  - 403: user banned/forbidden
  - 422: image failed safety checks (error body includes code=image_flagged)
  - 429: rate limit (with Retry-After header; body code=rate_limited)
  - 500: internal server error (code=model_error/server_error)
- Error body schema:
  {
    "error": {
      "code": "image_flagged" | "rate_limited" | "model_error" | "server_error" | "auth_error",
      "userMessage": "string",
      "retryAfterSeconds": number | null
    }
  }

3) GET /health
- No auth required (or lightweight token)
- Response:
  {
    "status": "ok",
    "deps": {
      "openai": true,
      "vision": true,
      "storage": true,
      "redis": true
    }
  }

4) Admin endpoints (protected via GCP IAM or admin keyed service account; accessible only by the admin service account)
- POST /admin/whitelist
  - Body: { "uid": "firebase-uid", "action": "add" | "remove" }
- GET /admin/flags?limit=50
  - Returns flagged moderation events from Firestore.

Note: Admin endpoints should be accessible only to the single admin service account (configured in IAM) or via a signed header checked by backend.

---

7) Prompt design & OpenAI interaction
- Model: gpt-5-nano (image-capable)
- Model settings:
  - temperature: 0.6
  - max_tokens: 300
  - n: 1
  - stop: none (use JSON enforcement)
- Response format: Strict JSON (validate server-side). Allowed one parse retry.
- System message (example):
  You are Captioner, a concise caption writer. RULES: 1) Output valid JSON ONLY matching the provided schema. 2) NEVER identify or speculate about people's identities, ages, or locations. 3) DO NOT include hashtags. 4) Emojis allowed sparsely. 5) Provide exactly three captions with length buckets short/medium/long. 6) Keep language appropriate and safe. If unable to follow rules, return an empty suggestions array and a short explanation.
- User message (example):
  "Image: <signed_image_url>
   Tone: funny
   Requirements: Return a JSON object with field 'suggestions'  - an array of 3 objects, each with id (uuid), text (string), length_bucket ('short' | 'medium' | 'long'), safety_flags (array of strings, can be empty). Short <= 70 chars, Medium 71-140, Long 141-280. No hashtags, minimal emojis allowed. JSON only. Do not include any commentary outside JSON."
- Server-side enforcement:
  - Validate JSON schema, length buckets.
  - If any item violates length rule, attempt one regeneration for that specific caption.
  - On parse failure, retry once with a follow-up instructing to "Fix your JSON and return only the JSON."
- Sample JSON schema (server-side validation):
  {
    "suggestions": [
      {
        "id": "uuid-v4",
        "text": "string",
        "length_bucket": "short" | "medium" | "long",
        "safety_flags": ["sexual","violence"] // optional; backend ignores and enforces own moderation
      }
    ],
    "explanation": "string (optional)"
  }

Notes:
- Include the exact signed image URL in the prompt. Create a signed URL with limited TTL for OpenAI to fetch.
- If OpenAI account/region doesn't permit image URLs, call returns error and we will return model_error to client (no fallback).

---

8) Moderation & safety pipeline (image + text)
- Image SafeSearch (Google Vision):
  - Fields checked: adult, violence, racy, spoof.
  - Thresholds (configurable):
    - Reject if any of [adult, violent, racy] is POSSIBLE or above.
    - Tune threshold in config (e.g., REJECT_LIKELIHOOD = POSSIBLE).
  - If rejected: create Firestore moderation_flags doc, return 422 image_flagged.
- Text moderation (OpenAI Moderation):
  - After captions generated, call moderation endpoint for each caption text.
  - If moderation flagged:
    - Attempt one regeneration for that caption (with stricter system message: "Avoid sexual content, hate, violence, illegal content").
    - If still flagged: remove that caption.
  - Log moderation flags to Firestore (admin review).
- Human-in-the-loop:
  - All flagged events are written to a Firestore collection moderation_flags: { request_id, uid, objectPath, flags, captions, timestamp }.
  - Admin (service account) examines Firestore via Firebase Console for appeals/whitelisting/bans.
- Safety logging:
  - Do not store raw images in moderation_flags; store objectPath and small thumbnail (if user opted in to save images - but for MVP history is disabled, so don't store thumbnails).
  - Store minimal metadata for review.

---

9) Image handling rules (client & server)
- Client-side:
  - Allowed formats: .jpeg/.jpg, .png, .heic.
  - Max file size: client should try to compress ≤ 2 MB prior to upload.
  - Downscale if longer side > 1024 px.
  - Show upload progress and friendly permission prompts.
- Server-side:
  - Enforce contentType & max size 5MB.
  - If format unsupported or size >5MB => 400 error.
  - Use sharp to strip EXIF and downscale to ≤ 1024 px if needed.
  - Re-encode to JPEG to standardize before Vision & sending to OpenAI (helps avoid HEIC edge cases).
- Reject animated GIFs.
- Security: remove any geolocation metadata.

---

10) Authentication, authorization & abuse prevention
- Auth: Firebase Auth (passwordless email sign-in / magic link).
  - Client uses Firebase SDK to sign-in; obtains ID token, sends Authorization: Bearer <id_token> to backend.
  - Backend verifies with Firebase Admin SDK.
- Auth flow server-side:
  - Verify token on every request that consumes quota or sensitive operations.
  - Extract uid for rate-limit keys.
- Admin:
  - Single admin service account configured with IAM access to Firestore and Cloud Run.
  - Admin endpoints accessible only to that account (restrict via IAM and server-side checks).
- Abuse prevention:
  - No anonymous access - sign-in required.
  - Rate limiting (see next section).
  - Global protection: Cloud Run concurrency & autoscale limits, Cloud Monitoring alerts for excess usage.
- Secret management:
  - Use Secret Manager for OpenAI API key and any other secrets. Grant Cloud Run service account access via IAM.
  - Avoid storing secrets in code or repo.

---

11) Rate limiting & concurrency (per-user rules)
- User-level limits (Option A selected):
  - Burst: max 5 generate requests per 60 seconds per uid.
  - Concurrency: only 1 in-flight /generate per uid. If a user attempts a second concurrent generate, return 429 with Retry-After (recommended 60s).
  - No sustained daily cap.
- Implementation details (Redis / Cloud Memorystore):
  - Use token-bucket or leaky bucket algorithm. Simpler approach: use Redis INCR with TTL.
  - Keys:
    - bucket_count:{uid}
      - INCR on each generate; set EXPIRE 60s on first create. If > 5 -> reject.
    - inflight:{uid}
      - SETNX key with short TTL (e.g., 300s) at request start. If key exists -> return 429 concurrency.
      - Delete key near request completion. Use Lua script or ensure atomicity.
  - Global QPS safeguard: in addition to per-user rules, maintain a global counter to avoid system overload.
- Admin whitelisting:
  - The single admin service account may add uids to a Firestore collection whitelist_uids allowing them to bypass sustained limits (no daily limits exist) - in MVP this is optional and used for beta testers.
- Rate-limit response:
  - HTTP 429, include Retry-After header and JSON body:
    { "error": { "code": "rate_limited", "userMessage": "You’re generating captions too quickly. Try again in a minute.", "retryAfterSeconds": 60 } }

---

12) Storage, lifecycle & retention
- GCS bucket for uploads:
  - Bucket: photos-uploads-{project}
  - ACL: private
  - Lifecycle: delete objects older than 6 hours.
  - Signed URLs for PUT (upload) expire in 15 minutes; signed URLs for OpenAI fetch expire in 5 minutes.
- Firestore:
  - Collections:
    - moderation_flags (store flagged events)
    - admin_whitelist (optional)
  - Read/write patterns small-scale for MVP.
- Logs & analytics:
  - Cloud Logging (structured JSON) + export to BigQuery for analysis and KPI dashboards.
  - Avoid storing raw images or caption text in analytics; use hashed values if needed.

---

13) Admin & moderation tooling
- Minimal admin workflow:
  - Use Firebase Console to view Firestore moderation_flags collection.
  - Provide small Cloud Run admin endpoints for:
    - GET /admin/flags (query Firestore)
    - POST /admin/ban (add uid to banned collection)
    - POST /admin/whitelist
  - Secure admin endpoints to admin service account via IAM or require an admin header (x-admin-key) stored in Secret Manager and only provided to admin account.
- Admin data stored in Firestore only; retention policy: keep flagged events for 90 days (configurable).
- No custom admin UI in MVP - use Firebase Console.

---

14) Logging, analytics & monitoring
- Client:
  - Firebase Analytics events:
    - app_open
    - auth_sign_in / auth_sign_out
    - generate_request (tone, success/failure, latency_bucket)
    - copy_caption (length_bucket, index)
    - generate_error (error_code)
    - photo_upload_start / photo_upload_complete (size_bytes)
  - Crash reporting: Firebase Crashlytics; Sentry as fallback for JS-only errors if Crashlytics not available with Expo.
- Server:
  - Cloud Logging structured logs include:
    - request_id, uid, objectPath hash, tone, latencies, openai_response_time, vision_response, moderation_flags.
  - Export important logs to BigQuery daily.
  - Metrics & alerts:
    - Monitor OpenAI error rate > 1% -> alert.
    - Monitor high cost/excess usage -> alert.
    - Monitor Cloud Run CPU/memory and request latency -> alert.
- Sensitive data:
  - Never log raw images or full caption texts to analytics.
  - For debugging, store caption text in a separate protected Firestore collection only if absolutely necessary and only for short retention with admin-only access.

---

15) CI/CD, deployment & infra configuration
- Repo & main branches:
  - main (production), develop (staging), feature/* for PRs.
- Backend CI/CD (GitHub Actions):
  - PR build: run lint, typecheck, unit tests.
  - On merge to develop: build Docker image, push to Artifact Registry, deploy to Cloud Run staging with image tag.
  - On merge to main: build & push, deploy to Cloud Run production.
  - Use Workload Identity Federation or GCP service account via GitHub Secrets for authentication.
- Mobile CI/CD:
  - Expo + EAS builds via GitHub Actions.
  - On develop: produce internal builds and upload to TestFlight / Play Internal.
  - On main: produce release candidates.
- IaC:
  - Provide Terraform scripts (recommended) for:
    - Cloud Run service (container, memory, concurrency default 10).
    - GCS bucket with lifecycle rule.
    - Cloud Memorystore Redis instance.
    - Firestore setup.
    - IAM roles for service accounts (Cloud Run SA, admin SA).
- Cloud Run recommended settings:
  - Concurrency: 10 (tune based on experiment).
  - Request timeout: 60s (but target < 10s for generate).
  - Min instances: 0 (development), set to >0 in production if cold start impact unacceptable.
- Secrets:
  - Store OpenAI keys, admin keys, and Firebase service account in Secret Manager.

---

16) Dev stack, libraries & repo structure
- Backend stack:
  - Node.js 18+, TypeScript
  - Fastify (or Express)
  - @google-cloud/storage
  - @google-cloud/vision
  - firebase-admin
  - openai official Node SDK
  - sharp (image processing)
  - ioredis (Redis client)
  - pino/winston for logging
  - jest + supertest for unit/integration tests
- Mobile stack:
  - Expo + React Native + TypeScript
  - expo-image-picker or react-native-image-crop-picker
  - expo-file-system for temp files/compression
  - expo-firebase-auth or react-native-firebase for Firebase Auth
  - expo-secure-store for storing ID token
  - firebase-analytics SDK
- Example repo layout (backend):
  - src/
    - routes/
      - presign.ts
      - generate.ts
      - admin.ts
    - services/
      - auth.ts (Firebase token verification)
      - storage.ts (presign, fetch)
      - vision.ts (safeSearch)
      - openai.ts (invoke gpt, moderation)
      - rateLimit.ts (redis helpers)
      - imageProc.ts (sharp helpers)
    - lib/
      - validators.ts (schema)
      - logger.ts
    - index.ts
  - Dockerfile
  - tsconfig.json
  - .github/workflows/

---

17) Error handling & client UX mapping
- Backend returns machine-friendly error payloads (see API contract).
- Client mapping (recommended messages):
  - 500 / model_error -> "We couldn’t generate captions for this photo right now. Please try again."
  - 422 / image_flagged -> "We can’t create captions for this image. Try a different photo."
  - 429 / rate_limited -> "You’re generating captions too quickly. Try again in a minute."
  - 401 -> "Please sign in to continue."
- Retry & backoff:
  - Client should allow user to retry manually via Retry button; optionally disable Retry during Retry-After.
- Logging:
  - All error details logged server-side (stack, OpenAI raw responses) with request_id. Do not leak raw internals to the client.

---

18) Testing plan

Unit tests
- For backend functions:
  - validate objectPath parsing, contentType enforcement, image size checks.
  - rate limit functions (simulate Redis).
  - prompt generation helpers produce expected system/user messages.
  - JSON parsing logic & reformatting.
- For mobile:
  - image compress & resizing functions; auth flows mocked.

Integration tests
- Mock OpenAI & Vision APIs to assert workflow:
  - Safe path returns 3 suggestions with length buckets.
  - Vision flags -> 422 returned.
  - OpenAI returns unparsable -> retry path exercised.
  - Moderation flags -> caption regeneration path validated.
- Use test Firebase project & test GCS bucket.

End-to-end tests
- Full flow with staging Cloud Run, staging OpenAI keys:
  - Upload image, call generate, assert response shape and latency < 5s median.
- Manual QA:
  - Test with images across categories (people, scenery, food, low-light).
  - Test PII scenarios (people faces, potential personal info) to confirm model doesn't identify.

Load testing
- Simulate realistic traffic patterns using k6 or Locust:
  - Validate rate limiting works under concurrent users.
  - Validate Cloud Run scaling behavior.
- Monitor OpenAI error rates & costs.

Security & privacy tests
- Confirm EXIF stripped.
- Ensure tokens validated & unverified calls rejected.
- Penetration test around presigned URLs (ensure they expire & are scoped).

Acceptance criteria (MVP)
- End-to-end generation success with 3 captions for 95% of sample images within median < 3s (staging).
- Safety: flagged images are rejected; flagged captions not returned.
- Auth: only signed-in users can call /generate.
- Rate limiting: burst & concurrency enforced.
- No persistent image retention beyond 6 hours.
- Admin can view flagged events in Firestore.

---

19) Implementation milestones & timeline (suggested)
Sprint 0 (1 week) - Spike & POC
- Quick POC: local backend with OpenAI gpt-5-nano image call + sample image -> returns 3 captions JSON.
- Sample Expo client to upload and call POC.
- Measure raw latency.

Sprint 1 (2 weeks) - Core infra & endpoints
- Implement /presign-upload, basic GCS upload integration, Firebase Auth verification.
- Implement /generate orchestration up to Vision SafeSearch and OpenAI call; return raw response.
- Add unit tests for core services.

Sprint 2 (2 weeks) - Moderation & rate limiting
- Add OpenAI Moderation integration and caption filtering/regeneration logic.
- Integrate Redis for rate limiting & concurrency.
- Add Cloud Run deployment CI via GitHub Actions.

Sprint 3 (1-2 weeks) - Client integration & UX
- Build Expo client screens: upload, tone selector, spinner, result cards, copy action.
- Integrate Firebase Auth passwordless.
- Hook up analytics.

Sprint 4 (1 week) - Monitoring, admin & polish
- Add Firestore logging for flagged events, admin endpoints.
- Add Cloud Logging -> BigQuery export.
- Run load tests and fix performance issues.

Sprint 5 (1 week) - QA & release prep
- Run tests, fix discovered issues, produce staging builds, prepare release.

Total MVP estimate: ~6–8 weeks (team dependent).

---

20) Appendices

A) Environment variables (important)
- NODE_ENV=production
- PORT=8080
- PROJECT_ID=gcp-project-id
- GCS_BUCKET=photos-uploads-{project}
- OPENAI_API_KEY=stored_in_secret_manager
- FIREBASE_PROJECT_ID
- FIREBASE_ADMIN_CREDENTIALS=path or use Workload Identity
- REDIS_HOST, REDIS_PORT, REDIS_PASSWORD (Cloud Memorystore)
- ADMIN_UID (single admin service account uid or email to validate admin routes)
- RATE_LIMIT_BURST=5
- RATE_LIMIT_WINDOW_SECONDS=60
- CONCURRENCY_KEY_TTL_SECONDS=300

B) Redis key patterns & pseudo-logic
- burst key: rate:burst:{uid}
  - INCR -> if first set EXPIRE to RATE_LIMIT_WINDOW_SECONDS
  - If value > RATE_LIMIT_BURST => reject.
- concurrency key: rate:inflight:{uid}
  - SETNX (value=request_id) with TTL CONCURRENCY_KEY_TTL_SECONDS
  - If SETNX fails -> reject concurrency
  - DEL at end of request (ensure DEL in finally block).

C) Sample error payloads
- Rate limit:
  HTTP 429
  {
    "error": {
      "code": "rate_limited",
      "userMessage": "You’re generating captions too quickly. Try again in a minute.",
      "retryAfterSeconds": 60
    }
  }
- Image flagged:
  HTTP 422
  {
    "error": {
      "code": "image_flagged",
      "userMessage": "We can’t create captions for this image. Try a different photo.",
      "retryAfterSeconds": null
    }
  }
- Model error:
  HTTP 500
  {
    "error": {
      "code": "model_error",
      "userMessage": "We couldn’t generate captions for this photo right now. Please try again.",
      "retryAfterSeconds": null
    }
  }

D) Sample prompt (concise)
System:
"You are Captioner. Output valid JSON only. Do not identify people, ages, locations. No hashtags. Emojis OK. Return exactly three captions with fields {id,text,length_bucket,safety_flags}. Short<=70, Medium 71-140, Long 141-280. If you cannot comply, return suggestions:[] and explanation."

User:
"ImageURL: <SIGNED_URL>
Tone: funny
Return JSON only."

E) Security checklist
- Firebase Admin SDK used to validate tokens.
- Cloud Run service account only has least privilege (GCS read on bucket, Vision permission, Secret Manager access).
- Admin endpoints only accessible by admin service account via IAM.
- Secrets in Secret Manager.
- Presigned URLs expire quickly.

F) Acceptance test cases (examples)
- Upload a family photo - ensure model does not identify people (no "This is Alice") and returns 3 captions.
- Upload an explicit/racy image - ensure 422 returned.
- Rapidly submit >5 generates in 60s - ensure 429 after the 5th.
- Call /generate without token - 401 returned.`,
    promptPlan: `# Prompt Plan - Photo Captioner (MVP)

## Purpose
This Prompt Plan is a step-by-step, test-driven plan to implement the Photo Captioner MVP described in the provided devSpec. The plan breaks the work into incremental stages and small, verifiable steps. Each step includes a code-generation LLM prompt (text block) that instructs an LLM agent to implement that exact piece of functionality with tests. After each prompt, a todo checklist captures the deliverables and changes the prompt should produce.

## Guiding Principles
- TDD-first: every implemented piece must come with unit tests (Jest) and appropriate mocks.
- Small increments: implement one service/route/component at a time so manual verification is easy.
- Integration points mocked in unit tests; integration tests use lightweight local or test doubles.
- No orphaned code: each new file or module is imported/used by the next step so everything is wired up.
- Keep to devSpec requirements: Node 18+, TypeScript, Fastify, Sharp, Firebase Auth verification, GCS presigned uploads, Google Vision SafeSearch, OpenAI gpt-5-nano, Redis rate limiting, Cloud Run/Docker, Expo React Native client.
- Provide manual setup steps where infrastructure is required (GCP, Firebase, Redis, Secret Manager).

## How to Use This Plan
- Work prompts in order. Each prompt is executable by a code-generation LLM that writes code and tests.
- Run tests locally after each step. Tests are designed to be fast using mocks.
- For steps that require cloud resources, perform the listed manual setup tasks before running integration tests; unit tests should still run without cloud access using mocks.
- Mark the todo checkboxes after verifying the outputs.

## Overall Stage Breakdown
Stage A - Project and infra scaffolding (repo, packages, infra manual steps)
Stage B - Core backend primitives & auth (Firebase verification, storage presign)
Stage C - Media processing & safety (image processing, Vision SafeSearch)
Stage D - Model orchestration (OpenAI calls, parsing, moderation)
Stage E - Orchestration endpoint (/generate) with rate limiting and logging
Stage F - Admin flows & Firestore flagged-events
Stage G - Client (Expo) + integration testing + CI/CD + deployment

## Prompt List
Each numbered prompt below is a separate code-tagged prompt for a code-generation LLM. After each code block is a todo checklist.

### Prompt 0 - Repo Scaffolding and Toolchain (Backend)
Goal: Create the backend repository skeleton, package.json, TypeScript configs, lint, jest config, basic Fastify server, and an initial test to verify test harness. Provide Dockerfile skeleton and workspace structure consistent with devSpec.

Code-generation prompt:
text
You are to generate the initial backend repository scaffold for the Photo Captioner MVP.

Requirements:
- Language: TypeScript, Node 18+
- Framework: Fastify
- Test runner: Jest (ts-jest)
- Linter: ESLint (TypeScript rules)
- Formatter: Prettier
- Other libs (dev dependencies): supertest, @types/jest, @types/node, nodemon (dev)
- Project structure:
  - src/
    - index.ts (starts Fastify server with /health route)
    - routes/
    - services/
    - lib/
    - config/
  - test/
    - health.test.ts
  - package.json, tsconfig.json, jest.config.js, .eslintrc.js, .prettierrc
  - Dockerfile (base skeleton; final tuning later)
  - .github/workflows/ci.yml (skeleton; final tuning later)

Deliverables:
1) A package.json with scripts:
   - "dev": ts-node-dev src/index.ts
   - "build": tsc
   - "start": node dist/index.js
   - "test": jest --runInBand
   - "lint": eslint src --ext .ts
2) tsconfig.json suitable for Node 18 and ES2022 module target
3) Minimal Fastify server that exposes GET /health returning {status:"ok"} and depends on env PORT with default 8080. When started in dev mode, it should log a single line.
4) Unit test test/health.test.ts that launches the server (in-memory) and asserts /health status and shape.
5) Dockerfile skeleton (multi-stage build; node:18-alpine base; installs dependencies and copies built dist).

Testing:
- Running npm test should run the Jest test and pass.

Write code files in TypeScript and tests, and ensure CI-friendly scripts are present. Use small, clear error handling.

Return: All source files (content) that should be placed into the repo. Also include README.md with next steps.

Be explicit in code comments about TODOs for secret values and infra setup which will come in later prompts.


Todo checklist:
- [ ] Create package.json with scripts and dependencies
- [ ] Add tsconfig.json, jest.config.js, ESLint/Prettier configs
- [ ] Implement src/index.ts with /health route
- [ ] Add test/health.test.ts and ensure npm test passes locally
- [ ] Add Dockerfile skeleton and README.md next steps

### Prompt 1 - Manual Infrastructure & Credentials Checklist (Manual)
Goal: Provide explicit manual steps to create required cloud resources and secrets so later prompts can assume those exist (or provide mocks). This is a manual setup step; not code-generated.

Manual-setup instructions (to be performed by developer before cloud integration tests):
text
Perform these tasks in your GCP and Firebase console for the project you will use for staging:

1) Firebase
- Create Firebase project (or use an existing one).
- Enable Firebase Authentication (Email/passwordless / magic link). Note project ID.
- Create a service account for backend and download service account JSON (or configure Workload Identity). Keep file safe.
- (Optional) Create a small test user account (email) for manual mobile testing.

2) Google Cloud Storage
- Create a bucket named photos-uploads-{project_id}.
- Configure bucket permissions so only service account has write/read except signed URLs are used.
- Add lifecycle rule: delete objects older than 6 hours.

3) Google Vision API
- Enable Cloud Vision API.
- Ensure backend service account has roles/vision.apiUser or similar.

4) Redis (Cloud Memorystore)
- Create a small Redis instance or plan to run a local Redis for dev.
- Note host, port, and any auth required.

5) Secret Manager
- Store OpenAI API key in Secret Manager (or note it for local .env usage).
- Store Firebase service account (if not using Workload Identity).

6) Firestore
- Set up Firestore in native mode (for moderation_flags and admin_whitelist).

7) OpenAI
- Ensure you have API access and an API key for gpt-5-nano and Moderation endpoints.
- Test a simple curl to verify key works.

6) Locally for dev
- Create a .env.local with:
  - PORT=8080
  - PROJECT_ID=<gcp_project_id>
  - GCS_BUCKET=photos-uploads-<project_id>
  - FIREBASE_ADMIN_CREDENTIALS=/path/to/service-account.json (or set env var for Workload Identity)
  - OPENAI_API_KEY=<openai_key>
  - REDIS_HOST=<host>
  - REDIS_PORT=<port>
  - RATE_LIMIT_BURST=5
  - RATE_LIMIT_WINDOW_SECONDS=60
  - CONCURRENCY_KEY_TTL_SECONDS=300

Notes:
- Do not commit secrets to the repo.
- If you want to avoid cloud costs, you can run local emulators:
  - Use Firebase emulator suite (auth + firestore) for integration tests.
  - Use a local Redis instance for rate-limit tests.
  - Mock OpenAI & Vision using the next-step mocks.


Todo checklist (manual):
- [ ] Create Firebase project and enable Auth
- [ ] Create GCS bucket with lifecycle rule (6 hours)
- [ ] Enable Vision API & give service account access
- [ ] Provision Redis or plan local Redis for dev
- [ ] Store OpenAI key in Secret Manager or local .env
- [ ] Set up Firestore (native mode)
- [ ] Create local .env with required variables for dev

### Prompt 2 - Auth Service: Firebase Token Verification
Goal: Implement auth service module to verify Firebase ID tokens; unit tests mock firebase-admin. Provide middleware for Fastify to verify Authorization header and attach uid to request.

Code-generation prompt:
text
Implement an auth service module and Fastify plugin that verifies Firebase ID tokens.

Requirements:
- Create src/services/auth.ts which exposes:
  - verifyIdToken(idToken: string): Promise<{ uid: string; claims: any }>
  - a Fastify preHandler hook plugin verifyFirebaseAuth that:
    - reads Authorization: Bearer <id_token>
    - calls verifyIdToken
    - on success attaches request.user = { uid, claims }
    - on failure returns 401 with error payload per devSpec error schema
- Use firebase-admin SDK but in tests mock firebase-admin to simulate token verification.
- Add unit tests in test/auth.test.ts covering:
  - valid token -> request proceeds, request.user populated
  - invalid token -> 401 returned

Constraints & behavior:
- The verify method should throw specific errors (AuthError) with code "auth_error" and userMessage suitable for client mapping.
- Provide typed RequestWithUser interface in types file.

Write code and tests. Use ts-jest mocking or jest.mock to mock firebase-admin. Do not require actual GCP/Firebase for tests.

Return the new files and test output (Jest).


Todo checklist:
- [ ] Implement src/services/auth.ts
- [ ] Implement Fastify plugin verifyFirebaseAuth
- [ ] Add types for RequestWithUser
- [ ] Add test/auth.test.ts mocking firebase-admin
- [ ] Ensure npm test passes locally without Firebase credentials

### Prompt 3 - Storage Service: GCS Presign and Canonical objectPath
Goal: Implement GCS storage service for presigned uploads: generate presigned PUT URL, return objectPath (gs://...), and enforce content type validation. Provide unit tests with GCS mocked.

Code-generation prompt:
text
Implement the GCS storage service for presigned uploads.

Requirements:
- Create src/services/storage.ts exposing:
  - generateUploadPresign({ filename, contentType, uid }): Promise<{ uploadUrl: string, objectPath: string, expiresAt: string, maxUploadBytes: number }>
  - validateObjectPath(objectPath: string): { bucket: string, name: string } | throw Error
  - getSignedUrlForObjectFetch(objectPath: string, ttlSeconds: number): Promise<string> (used later for OpenAI fetch)
- Use @google-cloud/storage library in implementation but write unit tests that mock the storage client.
- Enforce allowed content types: image/jpeg, image/png, image/heic (error 400 for others).
- Presign TTLs: upload presign 15 minutes; fetch presign for OpenAI 5 minutes.
- MaxUploadBytes constant: 5_242_880 (5MB). Expose from module.

Unit tests:
- Valid filename/contentType -> returns uploadUrl and objectPath (mock storage signed URL).
- Invalid contentType -> throw 400-like error.
- validateObjectPath parses valid gs:// bucket paths and throws on invalid.

Notes:
- Use a deterministic objectPath naming strategy: uploads/{uid}/{timestamp}-{randomSuffix}.{ext}
- Do not upload any bytes now; only presign logic and objectPath generation + tests.
- Ensure code uses Secret/Env variables for bucket name fallback.

Write code and tests; use jest mocks for @google-cloud/storage in tests.


Todo checklist:
- [ ] Implement src/services/storage.ts with generateUploadPresign, validateObjectPath, getSignedUrlForObjectFetch
- [ ] Add constants for allowed content types and maxUploadBytes
- [ ] Add unit tests mocking @google-cloud/storage
- [ ] Ensure tests run without GCP credentials

### Prompt 4 - Presign Endpoint Route and Integration Test
Goal: Add Fastify route POST /presign-upload using verifyFirebaseAuth plugin and storage service. Add integration test using Fastify instance and mocked storage service.

Code-generation prompt:
text
Add the /presign-upload route to the Fastify app.

Requirements:
- Endpoint: POST /presign-upload
- Auth: require verifyFirebaseAuth preHandler (from auth plugin)
- Request body schema:
  { filename: string, contentType: string }
- Validate inputs; call storage.generateUploadPresign({filename, contentType, uid})
- Return response per devSpec:
  { uploadUrl, objectPath, expiresAt, maxUploadBytes }
- Error cases:
  - 400 for invalid contentType or filename
  - 401 if auth plugin rejected (auth handled by plugin)
  - 429 (rare) not necessary here

Integration tests:
- Use Fastify in-memory server (import src/index.ts or create a test-only server builder) and supertest to call the route.
- Mock storage.generateUploadPresign to return sample data and assert response shape and status 200.
- Test invalid payload -> 400.

Also:
- Wire route into src/index.ts routes register
- Add route file src/routes/presign.ts with validation and export.

Write route code and tests (jest + supertest). Ensure tests run without external services by mocking storage.


Todo checklist:
- [ ] Implement src/routes/presign.ts
- [ ] Register route in server startup
- [ ] Add integration tests test/presign.test.ts using supertest mocking storage
- [ ] Validate JSON schema and error mapping

### Prompt 5 - Image Processing Service (Sharp): Strip EXIF, Resize, Re-encode
Goal: Implement image processing utilities that accept a Buffer/stream and return processed JPEG buffer with EXIF removed, longest side <= 1024 px, and recompressed. Provide unit tests using sample images in test/fixtures.

Code-generation prompt:
text
Implement an image processing service using sharp.

Requirements:
- Create src/services/imageProc.ts with:
  - processImageBuffer(input: Buffer): Promise<{ buffer: Buffer, width: number, height: number, format: string }>
    - Behavior:
      - Detect image format (reject animated GIFs)
      - Remove EXIF metadata
      - If longest side > 1024 px, resize to max 1024 preserving aspect ratio
      - Re-encode to JPEG with reasonable quality (e.g., 80)
      - If input size > 5MB -> still process but note that upstream /generate will reject >5MB before processing; still handle gracefully.
- Add helper isAnimated(buffer): Promise<boolean> to detect animated GIFs and reject them.
- Unit tests:
  - Use a few small fixture images (jpeg, png) placed under test/fixtures/ to validate:
    - EXIF removal is performed (can't inspect metadata easily for all images, but ensure no metadata keys returned from sharp.metadata())
    - Resize behavior: use a large fixture with dimensions > 1024 and assert output dims <= 1024 longest side
    - Reject animated gif fixture -> expect thrown error indicating 'animated_gif_not_supported'

Constraints:
- Tests should run locally without network; use local fixture images (small).
- Use jest to run tests.

Write code and tests. Include comments about performance and memory considerations. Throw a custom ImageProcessingError for error cases.


Todo checklist:
- [ ] Implement src/services/imageProc.ts with processImageBuffer and isAnimated
- [ ] Add test fixtures (jpeg, png, large sample, animated gif)
- [ ] Add unit tests test/imageProc.test.ts
- [ ] Ensure tests pass locally

### Prompt 6 - Google Vision SafeSearch Wrapper (Mockable)
Goal: Implement Vision service wrapper that accepts image buffer and returns SafeSearchResult. Provide unit tests that mock @google-cloud/vision.

Code-generation prompt:
text
Implement a Vision SafeSearch wrapper.

Requirements:
- Create src/services/vision.ts exposing:
  - safeSearchForImage(buffer: Buffer): Promise<{ adult: Likelihood, violence: Likelihood, racy: Likelihood, spoof: Likelihood }>
    - Likelihood type: "UNKNOWN"|"VERY_UNLIKELY"|"UNLIKELY"|"POSSIBLE"|"LIKELY"|"VERY_LIKELY"
- Implementation should use @google-cloud/vision ImageAnnotatorClient in production, but tests must mock the client.
- Add configurable threshold logic in a checker utility module src/lib/safety.ts:
  - isImageRejected(safeSearch): boolean -> returns true if any of adult, violence, racy >= POSSIBLE (configurable env var)
- Unit tests:
  - Mocked client returning various likelihoods and assert isImageRejected behavior.
  - Unit test safeSearchForImage with mocked @google-cloud/vision client to return a fixture response.

Notes:
- Do not call external API in unit tests (mock).
- Add JSDoc to explain thresholds and how they map to devSpec.


Todo checklist:
- [ ] Implement src/services/vision.ts wrapper
- [ ] Implement src/lib/safety.ts with isImageRejected
- [ ] Add unit tests test/vision.test.ts mocking @google-cloud/vision
- [ ] Ensure tests assert detection and thresholds

### Prompt 7 - Rate Limiting & Concurrency Service (Redis) with Mocks
Goal: Implement Redis-based rate limiting helper functions (burst counter and inflight key) using ioredis, but ensure unit tests mock Redis or run against a local test Redis. Provide functions used by /generate.

Code-generation prompt:
text
Implement rate-limiting helpers backed by Redis.

Requirements:
- Create src/services/rateLimit.ts exposing:
  - tryAcquireBurst(uid: string): Promise<{ allowed: boolean, remaining: number, retryAfterSeconds?: number }>
    - Uses key rate:burst:{uid}, increments with TTL RATE_LIMIT_WINDOW_SECONDS, rejects if value > RATE_LIMIT_BURST.
  - acquireInFlight(uid: string, requestId: string): Promise<boolean>
    - Uses SETNX on key rate:inflight:{uid} with TTL CONCURRENCY_KEY_TTL_SECONDS; returns true if acquired, false if already inflight.
  - releaseInFlight(uid: string, requestId: string): Promise<void>
    - Removes inflight key but only if value matches requestId (to avoid races) - use Lua script or GET+DEL with caution.
- Use ioredis client; ensure redis connection is created lazily via src/lib/redisClient.ts
- Unit tests:
  - Mock ioredis using jest mocks (simulate INCR/EXPIRE responses)
  - Test tryAcquireBurst boundary conditions
  - Test acquireInFlight and releaseInFlight behavior (including stale requestId not deleting)
- Error handling: on Redis errors, degrade gracefully by returning allowed=false with retryAfterSeconds set (fail-closed to be safe).

Write code and tests. Include strong typing and comments about atomicity and race conditions.


Todo checklist:
- [ ] Implement src/lib/redisClient.ts
- [ ] Implement src/services/rateLimit.ts with tryAcquireBurst, acquireInFlight, releaseInFlight
- [ ] Add unit tests test/rateLimit.test.ts mocking ioredis
- [ ] Document behavior in comments

### Prompt 8 - OpenAI Wrapper: Prompt Builder, Call, and Strict JSON Parsing with Retry
Goal: Implement OpenAI wrapper that builds the system + user prompts per devSpec, calls gpt-5-nano with image URL, and enforces strict JSON output with a single retry on parse failure.

Code-generation prompt:
text
Implement an OpenAI service wrapper that calls gpt-5-nano with an image and strict JSON enforcement.

Requirements:
- Create src/services/openai.ts exposing:
  - buildCaptionPrompt({ signedImageUrl, tone }): { system: string, user: string }
    - System message per devSpec ("You are Captioner... JSON ONLY... etc.")
    - User message includes signedImageUrl and tone and JSON schema instructions.
  - requestCaptions(signedImageUrl: string, tone: "funny"|"heartfelt"|"witty"): Promise<{ rawText: string, parsed: any, model: string, latencyMs: number }>
    - Behavior:
      - Build prompt
      - Make OpenAI API call (use official openai npm client)
      - If response is unparsable JSON:
        - Retry once with a follow-up instruction "Fix your JSON and return ONLY the JSON matching schema."
      - Track and return model name and latency
- Include typed schema for expected JSON (suggestions: [{id,text,length_bucket,safety_flags}] )
- Unit tests:
  - Mock openai client (jest.mock) and simulate:
    - Well-formed JSON -> parsed successfully
    - Malformed -> first call returns bad text; second returns good JSON -> ensures retry logic runs
    - Both malformed -> throw model_error with appropriate output
- Implement robust parsing helpers that handle minor model artifacts (strip leading/trailing text) but do not attempt to salvage heavily malformed output.
- Add OpenAI call timeouts and retries for transient network failures (2 retries with exponential backoff) but keep overall wrapper deterministic for unit tests using mocks.

Write code, tests, and include sample prompts printed in tests for inspection.


Todo checklist:
- [ ] Implement src/services/openai.ts with buildCaptionPrompt and requestCaptions
- [ ] Add JSON schema types and parsing helpers
- [ ] Add unit tests test/openai.test.ts mocking OpenAI client
- [ ] Ensure retry-on-parse logic tested

### Prompt 9 - OpenAI Moderation Wrapper and Caption Regeneration Logic
Goal: Implement moderation wrapper and logic to re-generate flagged captions (single attempt per caption) and record moderation flags.

Code-generation prompt:
text
Implement text moderation helper and caption-regeneration logic.

Requirements:
- Create src/services/moderation.ts exposing:
  - moderateText(text: string): Promise<{ flagged: boolean, categories: string[] }>
    - Calls OpenAI Moderation endpoint (mocked in unit tests)
  - sanitizeCaptions(captions: Array<{id,text,length_bucket}>, tone, signedImageUrl): Promise<Array<{id,text,length_bucket,safety_flags}>>
    - For each caption:
      - Call moderateText()
      - If flagged -> attempt one regeneration by calling openai.requestCaptions with a focused prompt to re-generate that one caption (system message stricter)
      - If regenerated caption still flagged -> drop it
      - Build safety_flags array per caption
    - Return array of safe captions (up to 3)
- Unit tests:
  - Mock moderation client to flag some captions and ensure regeneration attempted
  - Simulate regeneration returning safe caption -> assert caption included
  - Simulate regen flagged -> caption removed
- Ensure no raw captions are logged (only hashed or safety flags in logs). For tests, assert that sanitizeCaptions returns correct safety_flags details.

Write code and tests. Use dependency injection so OpenAI client from previous module can be mocked/injected.


Todo checklist:
- [ ] Implement src/services/moderation.ts with moderateText and sanitizeCaptions
- [ ] Add unit tests test/moderation.test.ts mocking moderation responses and openai regeneration
- [ ] Ensure sanitized captions match devSpec constraints

### Prompt 10 - /generate Route Orchestration (Core Flow) with Integration Tests
Goal: Implement /generate endpoint orchestrating the full server-side flow: auth, rate-limit, storage validate/fetch, image processing, Vision SafeSearch, OpenAI call, moderation, response mapping, logging, and Redis concurrency behavior. Provide integration tests with dependencies mocked.

Code-generation prompt:
text
Implement the /generate orchestration route.

Requirements:
- Endpoint: POST /generate
- Auth: verifyFirebaseAuth preHandler
- Request body:
  { objectPath: "gs://bucket/name", tone: "funny"|"heartfelt"|"witty" }
- Flow implementation (per devSpec):
  1. Verify uid from request.user
  2. Rate-limit:
     - tryAcquireBurst(uid) -> if not allowed -> 429 with retryAfter header/body
     - acquireInFlight(uid, requestId) -> if false -> 429 concurrency with Retry-After
  3. validateObjectPath(objectPath) and ensure it references configured bucket
  4. Use storage.getSignedUrlForObjectFetch(...) to obtain signed URL (5m TTL) and download object bytes (but for now use mocked download in tests: simulate returning a Buffer)
  5. Use imageProc.processImageBuffer to strip EXIF, resize and re-encode
  6. Call vision.safeSearchForImage on the processed buffer
     - If isImageRejected -> write moderation_flags to Firestore and return 422 image_flagged
  7. Call openai.requestCaptions(signedImageUrl, tone)
  8. Parse and validate JSON (length buckets, length constraints). If parse fails -> retry logic occurs within openai.service
  9. Call moderation.sanitizeCaptions to ensure captions safe
 10. If safeCaptions.length < 3 -> status: partial and explanation (why)
 11. Return 200 with suggestions array formatted per devSpec, model: gpt-5-nano, processing_time_ms, status
 12. Always releaseInFlight(uid, requestId) in finally block
- Logging:
  - Emit structured logs containing request_id, uid, tone, processing_time_ms, counts, but do not log raw image or full caption text
- Error mapping:
  - Map failures to devSpec error codes (image_flagged, rate_limited, model_error, server_error)
- Integration tests:
  - Use Fastify test server and supertest; mock these services (storage, imageProc, vision, openai, moderation, rateLimit, Firestore)
  - Test scenarios:
    - Happy path returns 3 captions
    - Vision flagged -> 422 image_flagged
    - Rate limit exceeded -> 429
    - OpenAI parse failure twice -> 500 model_error
    - Moderation removes some captions -> return partial with explanation
- The integration tests should assert headers (X-Request-ID), response shape, and Redis concurrency keys were created/released (mocked).

Implementation notes:
- Use a small orchestrator file src/routes/generate.ts for the route and delegate to a src/services/generateOrchestrator.ts which contains the flow logic for easier unit testing.
- Use a consistent request_id generator per request (UUID) and include it in logs/response headers.

Write code and tests. Ensure all external calls are abstracted via services to allow mocking.


Todo checklist:
- [ ] Implement src/services/generateOrchestrator.ts encapsulating core flow
- [ ] Implement src/routes/generate.ts and register route
- [ ] Add integration tests test/generate.integration.test.ts mocking services
- [ ] Ensure finally block always calls releaseInFlight

### Prompt 11 - Firestore moderation_flags Writer & Admin Endpoints
Goal: Implement Firestore writer for flagged events and admin endpoints to list flags and manage whitelist/ban. Tests must mock Firestore.

Code-generation prompt:
text
Implement Firestore-backed moderation_flags writer and small admin endpoints.

Requirements:
- Create src/services/moderationStore.ts exposing:
  - writeFlaggedEvent({ requestId, uid, objectPath, reason, visionResult?, captions?, timestamp? })
  - queryFlags(limit, after?) - returns flagged events
  - addWhitelist(uid) / removeWhitelist(uid) (admin operations)
- Use firebase-admin firestore client in implementation, but unit tests must mock firestore.
- Admin endpoints:
  - src/routes/admin.ts exposing:
    - GET /admin/flags?limit=50 (requires admin auth check - for now, check request.user.uid === ADMIN_UID env var or check a config)
    - POST /admin/whitelist body { uid, action: "add"|"remove" } (only admin user)
- Unit tests:
  - Mock Firestore client to assert writeFlaggedEvent stores correct docs
  - Admin routes return 403 for non-admin and success for admin
- Security:
  - Document in code comments that admin endpoints should be protected via IAM in production; here we use an ADMIN_UID env var for dev.

Write code and tests. Ensure test coverage for storage and admin routes.


Todo checklist:
- [ ] Implement src/services/moderationStore.ts
- [ ] Implement src/routes/admin.ts with admin check (ENV ADMIN_UID)
- [ ] Add tests test/moderationStore.test.ts and test/admin.test.ts mocking Firestore
- [ ] Ensure admin endpoints are only accessible to admin UID in tests

### Prompt 12 - Dockerfile Finalization, Docker Compose for Local Dependencies
Goal: Finalize the Dockerfile suitable for Cloud Run and create a docker-compose.yml for local development (Fastify app + Redis). Provide tests to ensure container builds.

Code-generation prompt:
text
Finalize Dockerfile for production and add docker-compose for local dev.

Requirements:
- Dockerfile:
  - Multi-stage build: builder (node:18) -> produce dist, final image node:18-alpine
  - Install only production deps in final image
  - Expose PORT from env
  - Healthcheck to /health
- docker-compose.yml for local development:
  - service app: build local Dockerfile, map port 8080:8080, mount local src for hot-reload (dev override).
  - service redis: use redis:6-alpine
  - Optional: firestore emulator & firebase emulator not required in compose but add comments
- Add a GitHub Actions workflow skeleton .github/workflows/build.yml to build the Docker image and run tests (unit).
- Add a small script ./scripts/local-build.sh that builds the image and runs docker-compose up -d

Add minimal integration test to confirm Docker image starts and /health reachable (run container in CI or as local script). For CI we will run tests against code, not containers; include placeholder.

Write Dockerfile, docker-compose.yml, and CI skeleton.


Todo checklist:
- [ ] Finalize Dockerfile multi-stage build
- [ ] Add docker-compose.yml with app and redis services
- [ ] Add CI workflow skeleton .github/workflows/build.yml
- [ ] Add scripts/local-build.sh and README instructions

### Prompt 13 - Backend CI: GitHub Actions Full Workflow
Goal: Provide a complete CI GitHub Actions workflow that lints, tests, builds, and (optionally) builds and pushes Docker images when secrets are present. Include steps to run unit tests with cached node modules.

Code-generation prompt:
text
Create a GitHub Actions workflow .github/workflows/ci.yml that:

- Triggers: push and PR
- Jobs:
  - test:
    - Runs on ubuntu-latest
    - Steps:
      - checkout
      - setup-node 18
      - cache node modules
      - install dependencies
      - run lint (npm run lint)
      - run unit tests (npm test)
  - docker-build (optional, runs on 'push' to develop or main):
    - build docker image and push to registry if DOCKER_REGISTRY and credentials (secrets) are configured
    - Use GCP or GitHub Container Registry skeleton steps with comments where to insert service account or PAT

- Store secrets in GitHub Secrets (mention OPENAI_API_KEY, FIREBASE_SERVICE_ACCOUNT, GCP creds)

- Ensure workflow is idempotent and prints test results.

Write YAML workflow file with comments about secret usage and required repo settings.


Todo checklist:
- [ ] Add .github/workflows/ci.yml with lint/test steps
- [ ] Document optional docker-build job requiring secrets
- [ ] Ensure workflow uses node 18 and caches dependencies

### Prompt 14 - Expo React Native Client Skeleton with Auth and Upload Flow (Client Scaffolding)
Goal: Create an Expo TypeScript app skeleton with Firebase passwordless auth (magic link) flow, image picker, image compression/resizing (client-side best effort), and UI screens for upload and tone selection. Include unit tests or e2e guidance.

Code-generation prompt:
text
Generate an Expo React Native (managed) TypeScript app skeleton.

Requirements:
- Screens:
  - AuthScreen: start magic-link flow via Firebase Auth (email input). Use react-native-firebase or Firebase JS SDK with web compatibility instructions for Expo.
  - HomeScreen: pick/take photo (expo-image-picker) and choose tone (funny/heartfelt/witty)
  - UploadScreen: compress down to <=2MB and downscale longest side <=1024 using expo-image-manipulator, show upload progress, call backend /presign-upload and then PUT to uploadUrl, then call /generate and show spinner and results screen.
  - ResultsScreen: show up to 3 captions with copy button; analytics events logged to Firebase Analytics.
- Authentication:
  - Use Firebase passwordless/email link flow and persist idToken securely (expo-secure-store).
  - On app start, check for logged-in user and show HomeScreen.
- Networking:
  - Use fetch for presign and generate; include Authorization Bearer header with Firebase ID token.
  - Handle errors mapping per devSpec userMessage strings.
- Local env:
  - Use expo-constants or .env to store backend base URL for dev
- Tests:
  - Provide strategy for unit tests: jest + react-native-testing-library for components
  - Provide manual e2e testing steps (since mobile e2e is heavier): manual acceptance checklist and example images to test.

Deliverables:
- App skeleton code for the main screens and navigation (React Navigation)
- Example functions for compressing/resizing images client-side using expo-image-manipulator
- An example for uploading to the presigned PUT URL using fetch with PUT and Content-Type header
- README in client explaining how to configure Firebase and backend base URL

Note: This step focuses on scaffolding and wiring; the UI can be minimal. Provide comments where to integrate analytics and crash reporting (Crashlytics).


Todo checklist:
- [ ] Create Expo app skeleton with AuthScreen, HomeScreen, UploadScreen, ResultsScreen
- [ ] Implement client-side image compression & resize via expo-image-manipulator
- [ ] Implement presign-upload and direct PUT logic and /generate call
- [ ] Add README instructions for Firebase config and running the app

### Prompt 15 - Client Integration Tests + Manual Acceptance Steps
Goal: Provide automated tests where feasible and a clear manual QA plan for the mobile flows that require cloud resources.

Code-generation prompt:
text
Provide integration test guidance and minimal automated tests for the Expo client, plus a manual QA checklist.

Requirements:
- Automated:
  - Use jest + react-native-testing-library
  - Add tests for:
    - UploadScreen: when presign service returns uploadUrl, ensure PUT is executed (mock fetch) and /generate called with objectPath
    - ResultsScreen: renders captions array passed as props correctly
- Manual QA checklist:
  1. Configure Firebase project and add backend base URL in app.
  2. Sign in via magic link (use test email).
  3. Select photo > upload > observe upload progress and spinner
  4. Confirm 3 captions shown within expected latency
  5. Test flagged image -> expect friendly error message "We can’t create captions for this image..."
  6. Test rate-limiting by sending >5 generate requests in 60s -> expect 429 mapping message
  7. Test EXIF stripping: take a photo with location enabled and confirm server-side EXIF is removed (manual backend log check)
- Provide sample jest test files mocking network requests (presign, PUT) for core client flows.

Return files and tests (but allow mocking to run locally without cloud).


Todo checklist:
- [ ] Add jest tests for UploadScreen and ResultsScreen with mocked fetch
- [ ] Provide manual QA checklist in client/README
- [ ] Ensure instructions for running tests locally

### Prompt 16 - End-to-end Test Harness & Local Emulation Guidance
Goal: Describe and provide scripts for running e2e tests locally with emulators and mocks for OpenAI and Vision; provide a sample Playwright or simple node e2e script to exercise endpoints.

Code-generation prompt:
text
Provide an e2e testing harness and local emulation instructions.

Requirements:
- Recommend and provide scripts to:
  - Run Firebase emulator suite (auth + firestore) locally for backend integration tests.
  - Run a local Redis container via docker-compose
  - Provide a simple Node-based test harness (scripts/e2e/run_e2e.js) that:
    - Starts the backend locally (npm run dev) with mocks enabled via ENV USE_MOCK_OPENAI=true, USE_MOCK_VISION=true
    - Uses sample images from test/fixtures and calls /presign-upload -> simulate upload -> calls /generate and asserts expected results
- Provide mock servers for OpenAI and Vision (small express endpoints listening on configurable ports) that return canned responses for e2e tests.
- Provide instructions to run mobile manual e2e:
  - Use Expo dev client on device or emulator, point to local backend (tunnel), perform the manual QA checklist.
- Scripts:
  - scripts/e2e/start-mocks.sh to bring up mock OpenAI & Vision servers and local Redis
  - scripts/e2e/run-local-e2e.sh to run the test harness

Deliverables:
- Node script for e2e assertions (minimal; uses axios/fetch)
- Mock server code for OpenAI & Vision endpoints returning sample outputs

These e2e scripts are optional but recommended for regression testing before deploying to staging.


Todo checklist:
- [ ] Add scripts/e2e mock servers for OpenAI & Vision
- [ ] Add scripts to start local emulators and run Node-based e2e checks
- [ ] Document how to run e2e locally in README

### Prompt 17 - Observability: Logging, Cloud Logging Hooks, and Error Reporting
Goal: Add structured logging helpers and ensure request tracing (X-Request-ID). Provide integration tests verifying logs are produced (local capture).

Code-generation prompt:
text
Implement structured logging and request tracing.

Requirements:
- Create src/lib/logger.ts using pino (or pino-pretty for dev) exposing:
  - createLogger({requestId, uid?}) returning a child logger
- Add Fastify plugin to generate a request_id (UUID v4) for each incoming request and add X-Request-ID response header.
- Use logger in generate orchestrator and other critical services to produce structured logs:
  - Fields: request_id, uid, tone, step, duration_ms, error_code (where applicable)
- Ensure logs avoid plain caption text; if needed, log SHA256 hash of caption text.
- Tests:
  - Integration test that hits /generate with mocked services and asserts logs contain request_id and expected fields by capturing stdout/stderr logs (use pino's transport to memory in tests).
- Add README notes about integration with Cloud Logging and recommended labels/fields.

Write the logger module, request id plugin, and tests capturing logs.


Todo checklist:
- [ ] Implement src/lib/logger.ts
- [ ] Add Fastify request-id plugin and add X-Request-ID header
- [ ] Replace console.log usage with logger in services
- [ ] Add test capturing logs to assert presence of request_id

### Prompt 18 - Deployment: Terraform Skeleton & Cloud Run Docker Deploy Instructions
Goal: Provide a Terraform skeleton and instructions to deploy the service to Cloud Run with relevant IAM roles and Secret Manager integration.

Code-generation prompt:
text
Produce a Terraform skeleton and deployment instructions for Cloud Run.

Requirements:
- Provide directory infra/ with:
  - main.tf (provider, project, region)
  - modules/cloudrun/main.tf (Cloud Run service creation using provided image)
  - modules/storage/main.tf (GCS bucket creation w/ lifecycle rule 6h)
  - modules/redis/main.tf (reference for Cloud Memorystore - note that exact availability may vary)
  - modules/secret_manager/main.tf (to store OPENAI_API_KEY)
  - variables.tf and outputs.tf
- Provide a template cloudbuild.yaml or GitHub Actions snippet for deploying built Docker image to Cloud Run
- Provide instructions:
  - Build and push Docker image to Artifact Registry or GCR
  - Apply Terraform to create infra
  - Deploy Cloud Run with environment variables and grant runtime service account access to Secret Manager, Vision, Storage
- Security note: Show least-privilege roles required.

Write Terraform files with placeholders and comments where manual changes are required (region, project_id). Keep everything idempotent.

Also provide deploy.sh script that:
- builds the docker image
- pushes to Artifact Registry
- triggers terraform apply (optionally)
- deploys new Cloud Run revision (gcloud run deploy)


Todo checklist:
- [ ] Add infra/ Terraform skeleton for Cloud Run, storage, secret manager
- [ ] Add deploy.sh with build/push/deploy steps and comments about service account
- [ ] Document IAM roles and Service Account permissions

### Prompt 19 - Final QA, Acceptance Tests, and Release Checklist
Goal: Produce the final test and release checklist to move from staging to production. Include acceptance test definitions and monitoring rules.

Code-generation prompt:
text
Produce a final QA and release checklist document plus test scripts to validate acceptance criteria.

Requirements:
- Acceptance tests (executable where possible):
  - End-to-end generation success: upload sample images (people, scenery, food) -> get 3 captions for 95% of samples within median < 3s in staging
  - Safety: flagged images return 422
  - Rate limiting: ensure >5 generates in 60s results in 429
  - Auth: only signed-in users can call /generate
  - EXIF stripping: assert metadata removed (sample image check)
- Monitoring & alert rules to configure (Cloud Monitoring):
  - OpenAI error rate > 1% -> Pager
  - High latency (95th >5s) -> Alert
  - Excessive cost/spend -> Alert
- Release checklist:
  - All unit & integration tests pass
  - E2E smoke tests pass in staging
  - Cloud Run instance size and concurrency configured per expected load
  - Ensure Secret Manager keys present and permissions granted
  - Enable Cloud Logging -> BigQuery export
- Provide simple scripts (or commands) that run these acceptance tests against staging:
  - scripts/release/run_acceptance.sh which runs Node-based tests using sample fixture images and asserts responses.

Write the checklist and the simple shell script for running acceptance tests. Include exact success criteria and post-deploy steps.


Todo checklist:
- [ ] Create acceptance tests scripts and checklist
- [ ] Document monitoring & alert rules
- [ ] Add scripts/release/run_acceptance.sh

### Prompt 20 - Wrap-up Prompt: Verify Wiring, Remove Mocks, and Production Readiness Runbook
Goal: Final step to remove dev-only mocks, run all tests, and produce a production runbook for operations and incident handling.

Code-generation prompt:
text
Perform the final wiring and produce an operations runbook.

Tasks:
1) Produce a "smoke" code-generation LLM task to:
   - Replace mock toggles with real service wiring where environment variables signal production (USE_MOCK_OPENAI=false, USE_MOCK_VISION=false).
   - Ensure getSignedUrlForObjectFetch is used to create signed URL for OpenAI fetch.
   - Ensure Secret Manager integration for OpenAI key is implemented (or provide explicit code comments for hooking it).
2) Run all tests (unit + integration) in a simulated production config (but still using mocked external services where required unless actual infra configured).
3) Generate a production runbook (docs/Runbook.md) with:
   - How to rotate OpenAI key (Secret Manager)
   - How to whitelist/ban users
   - How to review Firestore moderation_flags
   - How to respond to high OpenAI error rates or increased costs (steps to throttle or disable new jobs)
   - Troubleshooting steps for common failures (Vision API quota, Redis connectivity, Cloud Run OOM)
4) Provide a final checklist that confirms there are no orphaned files, all routes are registered, and every service is covered by at least unit test + one integration test.

Write code changes and documentation. Return a summary table of all files added and tests created.


Todo checklist:
- [ ] Wire production toggles and ensure no dev mocks remain when USE_MOCK_OPENAI=false
- [ ] Produce docs/Runbook.md with ops steps and incident procedures
- [ ] Run tests locally and note any remaining TODOs
- [ ] Provide final summary of files and tests

## Closing Notes and Recommended Execution Order
Work through prompts 0 → 20 in order. For each prompt:
- Feed the code-generation LLM the code block content.
- Review generated code and tests.
- Run npm test and fix any issues before moving on.
- For manual steps (Prompt 1), complete infra before running cloud integration tests.

Keep to the devSpec constraints:
- Enforce image formats and size rules.
- Use Firebase ID tokens for auth.
- Use Redis for rate-limiting (with graceful degradation).
- Use Google Vision for image safety checks.
- Use OpenAI gpt-5-nano for multimodal caption generation.
- Keep images ephemeral (6-hour lifecycle) and strip EXIF prior to any external call.

If you want, I can:
- Generate the exact OpenAPI spec for endpoints defined in devSpec.
- Produce a first code-generation LLM run for Prompt 0 (repo scaffold) to bootstrap the repo files now.`,
    agentsMd: `# AGENTS.md

Purpose
- This file orients automated agents (Codex, Claude Code, CI bots) and human contributors to the repository's workflow, important docs, and agent responsibilities.  
- Keep this file minimal, actionable, and authoritative for agent-driven work.

Quick usage
- Read prompt_plan.md first - it drives the agent workflow.
- Update the TODO checklist in prompt_plan.md after any code/refactor/test step.
- Run tests locally and in CI; do TDD: write failing tests first.

Repository files (what they are)
- prompt_plan.md
  - Agent‑Ready Planner with per‑step prompts, expected artifacts, tests, rollback notes, idempotency notes, and a TODO checklist using Markdown checkboxes.
  - This file is the single source of truth for step-level progress; agents must update checklist items as they complete tasks.
- spec.md
  - Concise developer specification and API contract (functional + technical requirements) - maps to DEV_SPEC.md in the repository docs section.
  - Includes Definition of Done criteria that drive acceptance and testing.
- idea.md
  - Raw notes and brainstorming captured during discovery. Use for context only; not authoritative for implementation decisions unless referenced in prompt_plan.md or spec.md.
- idea_one_pager.md (aka ONE_PAGER.md)
  - Short, human‑readable summary covering Problem, Audience, Platform, Core Flow, MVP Features, and optional Non‑Goals.
  - Useful for clarifying scope to stakeholders and agents.

What lives in /designs/
- High‑fidelity and low‑fidelity design assets that the implementation should follow or reference:
  - Figma links (short human-readable URL or file id) and an export manifest (designs/manifest.md).
  - PNG/SVG/FBX exports used by the client or marketing (exported_to/png/, exported_to/svg/).
  - Wireframes and flow diagrams (PDF or PNG).
  - README in /designs/ explaining which files are canonical and any licensing notes.
- Naming conventions:
  - designs/<screen>-v1.{fig,svg,png,pdf}
  - designs/exports/<screen>-<platform>-v1.png
- If designs are missing or too large for agent processing, agents must ask for human input.

Include the following section verbatim (do not modify)
## Repository docs
- 'ONE_PAGER.md'  - Captures Problem, Audience, Platform, Core Flow, MVP Features; Non‑Goals optional. 
- 'DEV_SPEC.md'  - Minimal functional and technical specification consistent with prior docs, including a concise **Definition of Done**. 
- 'PROMPT_PLAN.md'  - Agent‑Ready Planner with per‑step prompts, expected artifacts, tests, rollback notes, idempotency notes, and a TODO checklist using Markdown checkboxes. This file drives the agent workflow.  
- 'AGENTS.md'  - This file. 

### Agent responsibility
- After completing any coding, refactor, or test step, **immediately update the corresponding TODO checklist item in 'prompt_plan.md'**.  
- Use the same Markdown checkbox format ('- [x]') to mark completion.  
- When creating new tasks or subtasks, add them directly under the appropriate section anchor in 'prompt_plan.md'.  
- Always commit changes to 'prompt_plan.md' alongside the code and tests that fulfill them.  
- Do not consider work “done” until the matching checklist item is checked and all related tests are green.
- When a stage (plan step) is complete with green tests, update the README “Release notes” section with any user-facing impact (or explicitly state “No user-facing changes” if applicable).
- Even when automated coverage exists, always suggest a feasible manual test path so the human can exercise the feature end-to-end.
- After a plan step is finished, document its completion state with a short checklist. Include: step name & number, test results, 'prompt_plan.md' status, manual checks performed (mark as complete only after the human confirms they ran to their satisfaction), release notes status, and an inline commit summary string the human can copy & paste.

#### Guardrails for agents
- Make the smallest change that passes tests and improves the code.
- Do not introduce new public APIs without updating 'spec.md' and relevant tests.
- Do not duplicate templates or files to work around issues. Fix the original.
- If a file cannot be opened or content is missing, say so explicitly and stop. Do not guess.
- Respect privacy and logging policy: do not log secrets, prompts, completions, or PII.

#### Deferred-work notation
- When a task is intentionally paused, keep its checkbox unchecked and prepend '(Deferred)' to the TODO label in 'prompt_plan.md', followed by a short reason.  
- Apply the same '(Deferred)' tag to every downstream checklist item that depends on the paused work.
- Remove the tag only after the work resumes; this keeps the outstanding scope visible without implying completion.




#### When the prompt plan is fully satisfied
- Once every Definition of Done task in 'prompt_plan.md' is either checked off or explicitly marked '(Deferred)', the plan is considered **complete**.  
- After that point, you no longer need to update prompt-plan TODOs or reference 'prompt_plan.md', 'spec.md', 'idea_one_pager.md', or other upstream docs to justify changes.  
- All other guardrails, testing requirements, and agent responsibilities in this file continue to apply unchanged.


---

## Testing policy (non‑negotiable)
- Tests **MUST** cover the functionality being implemented.
- **NEVER** ignore the output of the system or the tests - logs and messages often contain **CRITICAL** information.
- **TEST OUTPUT MUST BE PRISTINE TO PASS.**
- If logs are **supposed** to contain errors, capture and test it.
- **NO EXCEPTIONS POLICY:** Under no circumstances should you mark any test type as "not applicable". Every project, regardless of size or complexity, **MUST** have unit tests, integration tests, **AND** end‑to‑end tests. If you believe a test type doesn't apply, you need the human to say exactly **"I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME"**.

### TDD (how we work)
- Write tests **before** implementation.
- Only write enough code to make the failing test pass.
- Refactor continuously while keeping tests green.

**TDD cycle**
1. Write a failing test that defines a desired function or improvement.  
2. Run the test to confirm it fails as expected.  
3. Write minimal code to make the test pass.  
4. Run the test to confirm success.  
5. Refactor while keeping tests green.  
6. Repeat for each new feature or bugfix.

---

## Important checks
- **NEVER** disable functionality to hide a failure. Fix root cause.  
- **NEVER** create duplicate templates or files. Fix the original.  
- **NEVER** claim something is “working” when any functionality is disabled or broken.  
- If you can’t open a file or access something requested, say so. Do not assume contents.  
- **ALWAYS** identify and fix the root cause of template or compilation errors.  
- If git is initialized, ensure a '.gitignore' exists and contains at least:
  
  .env
  .env.local
  .env.*
  
  Ask the human whether additional patterns should be added, and suggest any that you think are important given the project. 

## When to ask for human input
Ask the human if any of the following is true:
- A test type appears “not applicable”. Use the exact phrase request: **"I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME"**.  
- Required anchors conflict or are missing from upstream docs.  
- You need new environment variables or secrets.  
- An external dependency or major architectural change is required.
- Design files are missing, unsupported or oversized

End of verbatim section

Agent workflow checklist (minimal)
- Read prompt_plan.md → identify first unchecked step.
- Create a small branch named: work/<step-number>-short-description
- TDD: add failing tests for the required behavior.
- Implement minimal code to pass tests.
- Run full test suite locally.
- Update prompt_plan.md checklist for the completed item (mark - [x]).
- Commit changes with concise message: "<step-number>: <short description> - tests green"
- Push branch and open PR (if required by repo policies).

Commit & PR conventions
- Commit message format: <step-number>: <scope> - <short summary>
  - Example: "3.1: generate-api - add validation for objectPath; tests green"
- Include related prompt_plan.md update in the same commit.
- If tests fail in CI, do not merge. Fix tests in the PR.

If something is missing or cannot be read
- Stop and ask the human. Do not proceed with guesses.
- Example prompts to the human:
  - "I cannot open prompt_plan.md - please upload or confirm path."
  - "spec.md is missing the Definition of Done for step 2 - please clarify."

Contact / escalation
- When blocked on missing secrets, design files, or unclear acceptance criteria, raise an issue labeled "agent-blocker" and ping a human reviewer.

Appendix: minimal / design & docs checklist
- Ensure these files exist at repository root:
  - ONE_PAGER.md (or idea_one_pager.md)
  - DEV_SPEC.md (or spec.md)
  - PROMPT_PLAN.md (or prompt_plan.md)
  - AGENTS.md (this file)
  - README.md with release notes section
- Ensure /designs/ contains a README and a manifest listing canonical files.

---

That's it - AGENTS.md should be small, authoritative, and machine-actionable. If you want, I can generate a starter prompt_plan.md template or a CI job that enforces the checklist updates and hooks into PRs. Would you like that next?

<!-- Generated with vibescaffold.dev -->
`
};
}),
"[project]/app/wizard/components/WizardStep.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WizardStep
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$ChatInterface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/ChatInterface.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$ChatInterfaceWithOptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/ChatInterfaceWithOptions.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$DocumentPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/DocumentPreview.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-ssr] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/spikelog.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/sampleDocs.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
function WizardStep({ config, stepKey, onApproveAndNext }) {
    const { steps, isGenerating, setIsGenerating, updateStepChat, updateStepDoc, approveStep, resetCounter, aiProvider, aiModel } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const stepData = steps[stepKey];
    const enableMultipleChoice = config.enableMultipleChoice || stepKey === "onePager";
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showExampleModal, setShowExampleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const hasGeneratedBefore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(!!stepData.generatedDoc);
    const sampleDocMap = {
        onePager: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].onePager,
        devSpec: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].devSpec,
        checklist: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].promptPlan,
        agentsMd: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].agentsMd
    };
    const handleMessagesChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((messages)=>{
        updateStepChat(stepKey, messages);
    }, [
        stepKey,
        updateStepChat
    ]);
    // Collect previous documents for chat context
    const documentInputsForChat = {};
    if (config.documentInputs.length > 0) {
        for (const inputKey of config.documentInputs){
            const key = inputKey;
            if (steps[key]?.generatedDoc) {
                documentInputsForChat[inputKey] = steps[key].generatedDoc;
            }
        }
    }
    const handleGenerate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        setIsGenerating(true);
        setError(null);
        try {
            const documentInputs = {};
            if (config.documentInputs.length > 0) {
                for (const inputKey of config.documentInputs){
                    const key = inputKey;
                    if (steps[key]?.generatedDoc) {
                        documentInputs[inputKey] = steps[key].generatedDoc;
                    }
                }
            }
            const response = await fetch("/api/generate-doc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatHistory: stepData.chatHistory,
                    stepName: config.stepName,
                    documentInputs,
                    generationPrompt: config.generationPrompt,
                    aiProvider,
                    aiModel
                })
            });
            if (!response.ok) throw new Error("Failed to generate document");
            if (!response.body) {
                throw new Error("No response body");
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let generatedDoc = "";
            while(true){
                const { done, value } = await reader.read();
                if (done) break;
                generatedDoc += decoder.decode(value);
            }
            // Append attribution for AGENTS.md
            if (stepKey === "agentsMd") {
                generatedDoc = generatedDoc.trimEnd() + "\n\n<!-- Generated with vibescaffold.dev -->\n";
            }
            updateStepDoc(stepKey, generatedDoc);
            // Track successful document generation
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackDocumentGenerate(config.stepName, true);
            // Track token usage approximation (#8) - ~4 chars per token
            const promptChars = stepData.chatHistory.reduce((sum, msg)=>sum + msg.content.length, 0);
            const completionChars = generatedDoc.length;
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackTokenUsage(Math.round(promptChars / 4), Math.round(completionChars / 4), config.stepName);
            // Track regeneration (#14) if this is not the first generation
            if (hasGeneratedBefore.current) {
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackRegeneration(config.stepName);
            }
            hasGeneratedBefore.current = true;
            setTimeout(()=>{
                const previewElement = document.getElementById('preview-box');
                if (previewElement) {
                    previewElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 100);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate document");
            // Track failed document generation
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackDocumentGenerate(config.stepName, false);
        } finally{
            setIsGenerating(false);
        }
    }, [
        config.documentInputs,
        config.stepName,
        stepData.chatHistory,
        stepKey,
        steps,
        updateStepDoc,
        setIsGenerating
    ]);
    const handleApprove = ()=>{
        approveStep(stepKey);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleTriggerGenerate = ()=>{
            if (stepData.chatHistory.length > 0 && !isGenerating) {
                handleGenerate();
            }
        };
        window.addEventListener('triggerGenerate', handleTriggerGenerate);
        return ()=>window.removeEventListener('triggerGenerate', handleTriggerGenerate);
    }, [
        stepData.chatHistory.length,
        isGenerating,
        handleGenerate
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col flex-1 min-h-[400px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-6 py-4 border-b border-zinc-800 bg-zinc-950",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-[#a1a1aa]",
                                children: config.userInstructions
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                lineNumber: 155,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowExampleModal(true),
                                className: "text-xs text-accent hover:text-accent-light font-mono mt-2 inline-flex items-center gap-1 transition-all duration-200",
                                children: "See example output →"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                lineNumber: 158,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/components/WizardStep.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-hidden bg-zinc-950",
                        children: enableMultipleChoice ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$ChatInterfaceWithOptions$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            systemPrompt: config.systemPrompt,
                            initialMessages: stepData.chatHistory,
                            onMessagesChange: handleMessagesChange,
                            documentInputs: documentInputsForChat,
                            initialGreeting: config.initialGreeting,
                            stepName: config.stepName,
                            placeholder: config.inputPlaceholder,
                            quickStartSuggestions: config.quickStartSuggestions
                        }, `${stepKey}-${resetCounter}`, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 168,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$ChatInterface$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            systemPrompt: config.systemPrompt,
                            initialMessages: stepData.chatHistory,
                            onMessagesChange: handleMessagesChange,
                            documentInputs: documentInputsForChat,
                            initialGreeting: config.initialGreeting,
                            stepName: config.stepName,
                            placeholder: config.inputPlaceholder,
                            quickStartSuggestions: config.quickStartSuggestions
                        }, `${stepKey}-${resetCounter}`, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 180,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/WizardStep.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            isGenerating && !stepData.generatedDoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "preview-box",
                className: "border-t border-zinc-800 bg-zinc-950 p-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                            className: "w-12 h-12 text-white animate-spin mb-6"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-sm font-mono font-bold text-white mb-2 tracking-widest",
                            children: "GENERATING_ASSETS..."
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 200,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-xs text-[#a1a1aa] font-mono",
                            children: [
                                "Processing ",
                                config.stepName,
                                " requirements"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 203,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-64 h-1 bg-zinc-800 mt-8 overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-full bg-zinc-400 w-1/2 animate-[slide_1s_linear_infinite]"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                lineNumber: 208,
                                columnNumber: 16
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 207,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                    lineNumber: 198,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                lineNumber: 197,
                columnNumber: 9
            }, this),
            stepData.generatedDoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "preview-box",
                className: "border-t border-zinc-800 min-h-[500px] h-[70vh] max-h-[800px] flex flex-col",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$DocumentPreview$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    content: stepData.generatedDoc,
                    onRegenerate: handleGenerate
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                    lineNumber: 217,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                lineNumber: 216,
                columnNumber: 9
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-950/20 border border-red-900/50 p-4 m-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-red-400 font-mono text-xs",
                    children: [
                        "ERROR: ",
                        error
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                    lineNumber: 226,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                lineNumber: 225,
                columnNumber: 9
            }, this),
            showExampleModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-backdropEnter",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-zinc-900 border border-zinc-800 max-w-3xl w-full max-h-[80vh] flex flex-col animate-modalEnter shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between px-6 py-4 border-b border-zinc-800",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-2xs font-mono text-zinc-500 uppercase tracking-widest mb-1",
                                            children: "Example Output"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                            lineNumber: 235,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-lg font-bold text-white",
                                            children: config.stepName
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                            lineNumber: 236,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                    lineNumber: 234,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowExampleModal(false),
                                    className: "text-zinc-400 hover:text-white transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                        lineNumber: 242,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-auto p-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                className: "text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed",
                                children: sampleDocMap[stepKey]
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                lineNumber: 246,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 245,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-4 border-t border-zinc-800 bg-zinc-950",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-zinc-500",
                                children: "This is sample output for a Photo Captioner app. Your output will be customized to your idea."
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                                lineNumber: 251,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardStep.tsx",
                            lineNumber: 250,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/WizardStep.tsx",
                    lineNumber: 232,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/wizard/components/WizardStep.tsx",
                lineNumber: 231,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[project]/app/wizard/utils/stepAccess.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canAccessStep",
    ()=>canAccessStep
]);
const canAccessStep = (targetStep, steps, orderedStepKeys)=>{
    if (targetStep < 1 || targetStep > orderedStepKeys.length) {
        return false;
    }
    const targetIndex = targetStep - 1;
    for(let index = 0; index < targetIndex; index++){
        const stepKey = orderedStepKeys[index];
        if (!steps[stepKey]?.approved) {
            return false;
        }
    }
    return true;
};
}),
"[project]/app/wizard/steps/step1-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "step1Config",
    ()=>step1Config
]);
const step1Config = {
    stepNumber: 1,
    stepName: "One Pager",
    userInstructions: "First, we'll define your product's problem, audience, and core user flow.",
    systemPrompt: `Ask me questions so that we can develop a product specification document for this idea.

The resulting document should answer at least (but not limited to) this set of questions:
* What problem does the app solve?
* Who is the ideal user for this app?
* What platform(s) does it live on (mobile web, mobile app, web, CLI)?
* Describe the core user experience, step-by-step.
* What are the must-have features for the MVP?
* What data will the app need to persist?
* Will it need user accounts, and will there be access controls?

The user will provide an initial description of their app.

Before you begin asking questions, plan your questions out to meet the following guidelines:
* If you can infer the answer from the initial idea input, no need to ask a question about it.
* Each set of questions builds on the questions before it.
* If you can ask multiple questions at once, do so, and prompt the user to answer all of the questions at once. To do this, you need to ensure there are no dependencies between questions asked in a single set.
* For each question, provide your recommendation and a brief explanation of why you made this recommendation. Also provide 'recommendation strength' of weak, medium, or strong based on your level of confidence in your recommendation. 

We are building an MVP - bias your choices towards simplicity, ease of implementation, and speed. When off-the-shelf or open source solutions exist, consider suggesting them as options. 

We will ultimately pass this document on to the next stage of the workflow, a technical specification designed by a software engineer. This document needs to contain sufficient product context that the engineer can make reasonable technical decisions without product clarification.

Once we have enough to generate a strong one-pager, tell the user and prompt them to generate the one-pager by clicking the "Generate One-Pager" button. Do NOT generate a One-Pager here in the chat.`,
    generateButtonText: "Generate One-Pager",
    approveButtonText: "Approve Draft & Save",
    documentInputs: [],
    generationPrompt: "Now that we've wrapped up the brainstorming process, can you compile our findings into a clean, comprehensive one-pager? Include the problem, audience, ideal customer, platform, and flow information, such that we could start talking with product & engineering leadership about how this could be built.",
    inputPlaceholder: "Describe your idea...",
    quickStartSuggestions: [
        "An app that tracks my workouts",
        "Marketplace for used kids' gear",
        "A Chrome extension that blocks distracting sites"
    ]
};
}),
"[project]/app/wizard/steps/step2-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "step2Config",
    ()=>step2Config
]);
const step2Config = {
    stepNumber: 2,
    stepName: "Developer Spec",
    userInstructions: "Using the one pager we have just created, we'll nail down tech stack, architecture, and implementation details.",
    systemPrompt: `You are an expert software architect and technical specification writer. You will receive a product specification document as input. Parse it thoroughly before asking clarifying questions. Your role is to help create comprehensive, developer-ready specifications.

If the product spec contains ambiguities or contradictions, flag them explicitly and propose a resolution before proceeding.

The technical specification must include these sections, if applicable (but can include more):
- Architecture Overview (system diagram description, key components)
- Data Models (schemas, relationships, persistence format)
- API/Interface Contracts (if applicable)
- State Management
- Dependencies & Libraries (with version recommendations)
- Edge Cases & Boundary Conditions
- Implementation Sequence (ordered list of what to build first)

Before you begin asking questions, plan your questions out to meet the following guidelines:
* If you can infer the answer from the initial idea input, no need to ask a question about it.
* Each set of questions builds on the questions before it.
* If you can ask multiple questions at once, do so, and prompt the user to answer all of the questions at once. To do this, you need to ensure there are no dependencies between questions asked in a single set.
* For each question, provide your recommendation and a brief explanation of why you made this recommendation. Also provide 'recommendation strength' of weak, medium, or strong based on your level of confidence in your recommendation. 
* Establish tech stack early. It is foundational. Tech stack questions should come first since everything else depends on them.

We are building an MVP - bias your choices towards simplicity, ease of implementation, and speed. When off-the-shelf or open source solutions exist, consider suggesting them as options. 

We will ultimately pass this document on to the next stage of the workflow, which is converting this document into tasks that an AI coding agent will execute on autonomously. This document needs to contain enough detail that the AI coding agent will successfully be able to implement.

Once you've gathered sufficient detail across all areas, inform the user they can generate the Developer Spec document by clicking "Generate Developer Spec". Do NOT generate a developer spec here in the chat.`,
    generateButtonText: "Generate Developer Spec",
    approveButtonText: "Approve Draft & Save",
    documentInputs: [
        "onePager"
    ],
    initialGreeting: "Hello! I've reviewed your one-pager. For this developer specification, I'm focusing on simplicity and ease of implementation. Anything else you want me to know? Otherwise, tell me 'Get started on the developer spec!'",
    generationPrompt: "Now that we’ve wrapped up the brainstorming process, can you compile our findings into a comprehensive, developer-ready specification? Include all relevant requirements, architecture choices, data handling details, error handling strategies, and a testing plan so a developer can immediately begin implementation."
};
}),
"[project]/app/wizard/steps/step3-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "step3Config",
    ()=>step3Config
]);
const step3Config = {
    stepNumber: 3,
    stepName: "Prompt Plan",
    userInstructions: "Now that we have designs & a spec, we'll create step-by-step prompts with TDD checkboxes for AI coding tools.",
    systemPrompt: `On this step, we're going to generate a step-by-step prompt plan. The user will now optionally provide some new details about their product. Note them, provide feedback, and wait for them to move on to the prompt plan stage. If they don't know how to do that, guide them to click on 'Generate Prompt Plan'. Do NOT generate the full prompt plan in the chat.`,
    generateButtonText: "Generate Prompt Plan",
    approveButtonText: "Approve Draft & Save",
    documentInputs: [
        "devSpec"
    ],
    initialGreeting: "For this step, I don't need any new information. If you have any tweaks or changes you'd like to make or suggest, feel free to provide them now. When you're ready, click 'Generate Prompt Plan'",
    generationPrompt: `Draft a detailed, step-by-step blueprint for building this project. The blueprint needs to be structured such that we can build components of the app in stages, such that they can be tested and verified manually before moving on to the next component. Then, once you have a solid plan, break it down into small, iterative chunks that build on each other. Look at these chunks and then go another round to break it into small steps. Review the results and make sure that the steps are small enough to be implemented safely with strong testing, but big enough to move the project forward. Iterate until you feel that the steps are right sized for this project.

From here you should have the foundation to provide a series of prompts for a code-generation LLM that will implement each step in a test-driven manner. If manual steps are necessary, note these each as a separate step in the overall series. Prioritize best practices, incremental progress, and early testing, ensuring no big jumps in complexity at any stage. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. The prompt plus manual plan should cover the spec entirely, and result in a complete, working MVP. 

Make sure and separate each prompt section. Use markdown. Each prompt should be tagged as text using code tags. The goal is to output prompts, but context, etc is important as well.

Include, after each prompt, a set of todo checkboxes that the AI agents can check off, that capture the changes that the prompt contains. `
};
}),
"[project]/app/wizard/steps/step4-config.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "step4Config",
    ()=>step4Config
]);
const step4Config = {
    stepNumber: 4,
    stepName: "AGENTS",
    userInstructions: "Using all the documents we've created (one-pager, developer spec, and prompt plan), the Vibe Scaffold Assistant will create guardrails to keep AI agents on track with testing and progress.",
    systemPrompt: `On this step, we're going to generate an AGENTS.md file. The user will now optionally provide some new details about what they want to be in that file. Note them, provide feedback, and wait for them to move on to the prompt plan stage. If they don't know how to do that, guide them to click on 'Generate AGENTS.md' Do NOT generate the full AGENTS.md in the chat.`,
    generateButtonText: "Generate AGENTS.md",
    approveButtonText: "Approve Draft & Save",
    documentInputs: [
        "devSpec",
        "checklist"
    ],
    initialGreeting: "For this step, I don't need any new information. If you have any tweaks or changes you'd like to make or suggest, feel free to provide them now. When you're ready, click 'Generate AGENTS.md'",
    generationPrompt: `Using the information in the prompt_plan & spec attached here, write a minimal AGENTS.md file to include in the repository so that agents like Codex & Claude Code can interact well. Make sure it includes a description of what each file is (prompt_plan.md, spec.md, idea.md, idea_one_pager.md), as well as what will live in /designs/. Include the following section verbatim:

## Repository docs
- 'ONE_PAGER.md' - Captures Problem, Audience, Platform, Core Flow, MVP Features; Non-Goals optional.
- 'DEV_SPEC.md' - Minimal functional and technical specification consistent with prior docs, including a concise **Definition of Done**.
- 'PROMPT_PLAN.md' - Agent-Ready Planner with per-step prompts, expected artifacts, tests, rollback notes, idempotency notes, and a TODO checklist using Markdown checkboxes. This file drives the agent workflow.
- 'AGENTS.md' - This file. 

### Agent responsibility
- After completing any coding, refactor, or test step, **immediately update the corresponding TODO checklist item in 'prompt_plan.md'**.  
- Use the same Markdown checkbox format ('- [x]') to mark completion.  
- When creating new tasks or subtasks, add them directly under the appropriate section anchor in 'prompt_plan.md'.  
- Always commit changes to 'prompt_plan.md' alongside the code and tests that fulfill them.  
- Do not consider work “done” until the matching checklist item is checked and all related tests are green.
- When a stage (plan step) is complete with green tests, update the README “Release notes” section with any user-facing impact (or explicitly state “No user-facing changes” if applicable).
- Even when automated coverage exists, always suggest a feasible manual test path so the human can exercise the feature end-to-end.
- After a plan step is finished, document its completion state with a short checklist. Include: step name & number, test results, 'prompt_plan.md' status, manual checks performed (mark as complete only after the human confirms they ran to their satisfaction), release notes status, and an inline commit summary string the human can copy & paste.

#### Guardrails for agents
- Make the smallest change that passes tests and improves the code.
- Do not introduce new public APIs without updating 'spec.md' and relevant tests.
- Do not duplicate templates or files to work around issues. Fix the original.
- If a file cannot be opened or content is missing, say so explicitly and stop. Do not guess.
- Respect privacy and logging policy: do not log secrets, prompts, completions, or PII.

#### Deferred-work notation
- When a task is intentionally paused, keep its checkbox unchecked and prepend '(Deferred)' to the TODO label in 'prompt_plan.md', followed by a short reason.  
- Apply the same '(Deferred)' tag to every downstream checklist item that depends on the paused work.
- Remove the tag only after the work resumes; this keeps the outstanding scope visible without implying completion.




#### When the prompt plan is fully satisfied
- Once every Definition of Done task in 'prompt_plan.md' is either checked off or explicitly marked '(Deferred)', the plan is considered **complete**.  
- After that point, you no longer need to update prompt-plan TODOs or reference 'prompt_plan.md', 'spec.md', 'idea_one_pager.md', or other upstream docs to justify changes.  
- All other guardrails, testing requirements, and agent responsibilities in this file continue to apply unchanged.


---

## Testing policy (non‑negotiable)
- Tests **MUST** cover the functionality being implemented.
- **NEVER** ignore the output of the system or the tests - logs and messages often contain **CRITICAL** information.
- **TEST OUTPUT MUST BE PRISTINE TO PASS.**
- If logs are **supposed** to contain errors, capture and test it.
- **NO EXCEPTIONS POLICY:** Under no circumstances should you mark any test type as "not applicable". Every project, regardless of size or complexity, **MUST** have unit tests, integration tests, **AND** end‑to‑end tests. If you believe a test type doesn't apply, you need the human to say exactly **"I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME"**.

### TDD (how we work)
- Write tests **before** implementation.
- Only write enough code to make the failing test pass.
- Refactor continuously while keeping tests green.

**TDD cycle**
1. Write a failing test that defines a desired function or improvement.  
2. Run the test to confirm it fails as expected.  
3. Write minimal code to make the test pass.  
4. Run the test to confirm success.  
5. Refactor while keeping tests green.  
6. Repeat for each new feature or bugfix.

---

## Important checks
- **NEVER** disable functionality to hide a failure. Fix root cause.  
- **NEVER** create duplicate templates or files. Fix the original.  
- **NEVER** claim something is “working” when any functionality is disabled or broken.  
- If you can’t open a file or access something requested, say so. Do not assume contents.  
- **ALWAYS** identify and fix the root cause of template or compilation errors.  
- If git is initialized, ensure a '.gitignore' exists and contains at least:
  
  .env
  .env.local
  .env.*
  
  Ask the human whether additional patterns should be added, and suggest any that you think are important given the project. 

## When to ask for human input
Ask the human if any of the following is true:
- A test type appears “not applicable”. Use the exact phrase request: **"I AUTHORIZE YOU TO SKIP WRITING TESTS THIS TIME"**.  
- Required anchors conflict or are missing from upstream docs.  
- You need new environment variables or secrets.  
- An external dependency or major architectural change is required.
- Design files are missing, unsupported or oversized
`
};
}),
"[project]/app/wizard/steps/research/step1-first-contact.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "researchStep1Config",
    ()=>researchStep1Config
]);
const researchStep1Config = {
    stepNumber: 1,
    stepName: "First Contact Analysis",
    userInstructions: "Share your client's technical artifact — architecture diagram, document, screenshot, or description. We'll inventory every component, register claims, and identify gaps.",
    systemPrompt: `You are an expert technical analyst conducting a first-contact analysis of a client's technical artifact for a pre-sales engagement.

The user will provide an artifact — an architecture diagram (possibly as an image), technical document, screenshot, or verbal description of a client's platform.

Your job is to have a CONVERSATION that builds understanding step by step. DO NOT dump a complete analysis in one message. Instead, work iteratively:

## How to respond to the initial artifact:

1. **First response**: Acknowledge what you see. List the key components you identified (brief summary — names and categories only, not a full table). Then immediately ask your FIRST SET of clarifying questions (2-4 questions max per round).

2. **Follow-up rounds**: Based on user answers, refine your understanding. Share observations and ask deeper questions. For each question, provide your best guess as a recommendation with a confidence level (weak/medium/strong) so the user can simply confirm or correct.

3. **Progressively build**: Through the conversation, you are building toward four outputs (but do NOT produce them in chat):
   - Component Inventory with maturity signals
   - Claim Register with F/G/R scores (Fact / Guess / Reasoning)
   - Gap Analysis (what's missing)
   - Assumptions list (what we might be wrong about)

## Question strategy:

Ask questions in this priority order:
1. **Context questions** (ask first): Who is the client? What industry? What's our relationship? Is this platform in production or planned?
2. **Architecture questions**: What's not shown in the diagram? Multi-tenancy model? CI/CD? Auth layer?
3. **Operational questions**: What's their biggest pain point? Are they scaling or stabilizing? What broke recently?
4. **Strategic questions**: Why are they showing us this? What do they want from us?

For each question:
- Explain briefly WHY you're asking (what it changes in the analysis)
- Provide your recommendation / best guess with confidence: weak, medium, or strong
- Group 2-4 related questions together to minimize back-and-forth
- If you can infer the answer, state your inference and ask the user to confirm or correct

## CRITICAL question formatting rule:
When asking questions, ALWAYS format each question on its own line ending with "?" — this enables the interactive options UI. Example:

1. Is this platform currently in production or planned?
2. What industry is the client in?
3. Are there any known scaling challenges?

NEVER embed questions inside paragraphs. Each question MUST be a separate line.

## Important rules:

- NEVER produce a full structured analysis (inventory table, claim register, gap list) in the chat. That's what the "Generate Analysis" button is for.
- Keep each response focused and conversational — not longer than 200 words per round
- After 3-5 rounds of questions, when you feel you have enough context, tell the user: "I think we have enough to generate a solid First Contact Analysis. Click 'Generate Analysis' when you're ready."
- If the user provides an image, describe what you see in the image first, then ask your questions
- Do NOT ask questions you can answer from the artifact — state your observation and move on`,
    generateButtonText: "Generate Analysis",
    approveButtonText: "Approve & Continue",
    documentInputs: [],
    generationPrompt: `Based on our conversation, compile a comprehensive First Contact Analysis document in markdown format.

Structure it as:

# First Contact Analysis — [Client/Platform Name]

## Executive Summary
2-3 sentences: what this platform is, what state it appears to be in, and the most significant finding.

## Component Inventory
Table format: Component | Category | Maturity | Notes

## Claim Register
For each claim identified:
- Claim ID, Statement, Evidence, F/G/R Score, Impact if Wrong, Verification Method

## Gap Analysis
What's missing, severity (critical / moderate / minor), and what it implies.

## Assumptions & Verification Targets
Numbered list of assumptions we're making, each with a proposed verification method.

## Initial Observations
Key patterns, risks, or opportunities spotted. These feed into the next step (Claim Verification).

Use markdown tables, headers, and formatting for clarity. Be specific and evidence-based.`,
    inputPlaceholder: "Describe the client's architecture, paste a document, or describe what you see in their diagram...",
    quickStartSuggestions: [
        "On-prem data lakehouse with Spark, Kafka, MinIO on Kubernetes",
        "Cloud-native microservices on AWS with EKS and Terraform",
        "Legacy Java monolith migrating to Kubernetes"
    ],
    enableMultipleChoice: true
};
}),
"[project]/app/wizard/steps/research/step2-claim-verification.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "researchStep2Config",
    ()=>researchStep2Config
]);
const researchStep2Config = {
    stepNumber: 2,
    stepName: "Claim Verification",
    userInstructions: "Now we'll verify claims from the First Contact Analysis — check evidence, integrate expert feedback, and track corrections.",
    systemPrompt: `You are an expert technical verifier and claim analyst. You have received a First Contact Analysis document from the previous step. Your role is to systematically verify, challenge, and correct the claims made in that analysis.

## Your Three Jobs

### Job 1: VERIFICATION QUEUE
Review each claim from the First Contact Analysis that is scored G (Guess) or R (Reasoning):
- For each: propose a specific verification method (documentation search, expert consultation, client question)
- If the user provides web research results or documentation links, update the claim score accordingly
- Track every score change: "GPU capability: G → F (verified via NVIDIA GPU Operator docs)"

### Job 2: EXPERT INTEGRATION
If the user shares expert feedback (from a reviewer, colleague, or domain expert):
- Process each correction: what was wrong, what's right, update the claim
- Create CORRECTION CARDS in this format:
  > **BEFORE**: [original claim and score]
  > **AFTER**: [corrected claim and new score]
  > **SOURCE**: [expert name/role, or documentation reference]
  > **IMPACT**: [what this changes in our analysis]
- Identify NEW claims the expert introduces that we never considered
- Flag any REFRAMES the expert suggests ("you're asking the wrong question")

### Job 3: CLAIM LIFECYCLE TRACKING
Maintain a running summary of all claims and their current status:
- **Verified (F)**: Confirmed by evidence
- **Corrected**: Was wrong, now updated
- **Still Unverified (G/R)**: Needs more evidence or must become a Killer Question
- **New**: Introduced by expert or discovered during verification
- **Defeated**: Claim was wrong and has been removed

## CRITICAL question formatting rule:
When asking questions, ALWAYS put each question on its own line ending with "?" — this enables the interactive options UI. NEVER embed questions in paragraphs.

## Conversation Guidelines
- When the user shares expert feedback, process it immediately — don't argue with expert experience
- Expert operational experience (e.g., "I deployed this at scale") overrides documentation-level analysis
- Ask the user: "Do you have access to [specific documentation/expert] to verify [specific claim]?"
- If a claim cannot be verified from available sources, mark it as a Killer Question candidate
- Track the total counts: X verified, Y corrected, Z still unverified

Once verification is substantially complete, tell the user they can generate the Claim Verification report. Do NOT generate the report in the chat.`,
    generateButtonText: "Generate Verification Report",
    approveButtonText: "Approve & Continue",
    documentInputs: [
        "firstContact"
    ],
    initialGreeting: "I've reviewed the First Contact Analysis. I can see claims that need verification — some scored as Guess or Reasoning. Share any expert feedback, documentation findings, or web research results, and I'll process the corrections. Or tell me 'Start verification' and I'll walk through the claims that need attention.",
    enableMultipleChoice: true,
    generationPrompt: `Based on our verification conversation, compile a comprehensive Claim Verification Report in markdown format.

Structure it as:

# Claim Verification Report — [Client/Platform Name]

## Verification Summary
Table: Total Claims | Verified (F) | Corrected | Still Unverified | New Claims | Defeated

## Correction Log
For each correction made:
- Correction ID, Before (claim + score), After (claim + score), Source, Impact

## Updated Claim Register
Full claim register with CURRENT scores (post-verification). Flag any that remain G or R as "Killer Question Candidates".

## Expert Insights
New claims or reframes introduced by expert review that weren't in the original analysis.

## Verification Gaps
Claims that could not be verified — these become input for Killer Questions in the next step.

## Confidence Assessment
Overall confidence in our analysis: what we're sure about, what we're guessing, and what we must ask the client.

Use markdown tables and clear formatting. Track the before/after for every change.`
};
}),
"[project]/app/wizard/steps/research/step3-strategic-analysis.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "researchStep3Config",
    ()=>researchStep3Config
]);
const researchStep3Config = {
    stepNumber: 3,
    stepName: "Strategic Analysis",
    userInstructions: "Time to go deeper — detect the engagement frame, extract client language, identify blockers, expand strategic context, and generate Killer Questions.",
    systemPrompt: `You are a senior pre-sales strategist and engagement architect. You have the First Contact Analysis and Claim Verification Report from previous steps. Your role is to transform technical findings into strategic positioning.

## Your Five Jobs

### Job 1: FRAME DETECTION
Determine what we're actually selling. Ask the user:
- Is this an audit? An optimization engagement? A platform rebuild? A staffing request?
- Has the frame shifted since we started? (e.g., started as "architecture review" but now it's "become their platform integrator")
- Under the CURRENT frame, which of our verified claims become service hooks vs. just findings?

### Job 2: CLIENT LANGUAGE EXTRACTION
If the user shares client documents, emails, or meeting notes:
- Extract EXACT phrases the client uses for roles, processes, pain points
- Map their priorities to a Now / Next / Later framework
- Flag any references to previous vendors, competitors, or failed approaches
- Rule: when we write proposals, we use THEIR words, not our jargon

### Job 3: GAP & BLOCKER DISCOVERY
From everything we know, identify:
- **Technical blockers**: Incompatibilities, version conflicts, migration prerequisites
- **Capability blockers**: What the client needs that we CAN'T provide (be honest)
- **Information blockers**: What we MUST know but can't determine from available materials
- **Competitive blockers**: Signals of competitor presence

### Job 4: STRATEGIC CONTEXT EXPANSION
Guide the user to research beyond what the client told us:
- Corporate strategy: recent announcements, M&A, partnerships, investments
- Industry trends: regulatory forces, market shifts
- Competitive landscape: who else serves this client
- Adjacent opportunities: other BUs, geographies, use cases

### Job 5: KILLER QUESTIONS GENERATION
Generate questions that will either CONFIRM our assumptions or REVEAL gaps. Categories:
- **Scope-defining**: One answer changes the entire engagement model
- **Competitive intelligence**: Who came before us and what happened
- **Technical gotchas**: Constraints the client may not be aware of
- **Strategic positioning**: Shows we've done homework beyond their briefing
- **Operational baseline**: Numbers we need before scoping work

Then DISTILL to TOP 5 — each from a different category, ordered by impact.

## CRITICAL question formatting rule:
When asking questions, ALWAYS put each question on its own line ending with "?" — this enables the interactive options UI. NEVER embed questions in paragraphs.

## Conversation Guidelines
- Ask the user about client documents, sales intelligence, meeting context
- When the user shares strategic context (company news, partnerships), connect it to our technical findings
- A killer question is NOT "tell me more about X" — it reveals something the client hasn't realized about their own situation
- If the frame shifts during conversation, explicitly note: "Frame shift detected: [old] → [new]. Re-evaluating claims."

Once strategic analysis is solid, tell the user to generate. Do NOT generate the report in the chat.`,
    generateButtonText: "Generate Strategic Analysis",
    approveButtonText: "Approve & Continue",
    documentInputs: [
        "firstContact",
        "claimVerification"
    ],
    initialGreeting: "I've reviewed both the First Contact Analysis and the Claim Verification Report. Before I generate the strategic analysis, I need to understand the engagement context. Key questions: (1) What's the business relationship — are we selling to this client, or advising internally? (2) Do you have any client documents, meeting notes, or sales intelligence to share? (3) Have you done any web research on the client's recent announcements or strategy?",
    enableMultipleChoice: true,
    generationPrompt: `Based on our strategic analysis conversation, compile a comprehensive Strategic Analysis & Killer Questions document in markdown format.

Structure it as:

# Strategic Analysis — [Client/Platform Name]

## Engagement Frame
What we're actually doing here: the real question, the real opportunity, and how it differs from the initial ask (if it does).

## Client Language Map
Table: Their Term | Our Translation | Where They Said It | Priority (Now/Next/Later)

## Blocker Register
Table: Blocker Type (Technical/Capability/Information/Competitive) | Description | Impact | Resolution Path

## Strategic Context
Key findings from corporate strategy, industry trends, competitive landscape, and adjacent opportunities. Each with: source, relevance to our engagement, and how to reference it.

## TOP 5 Killer Questions
For each:
- Number and category tag
- The exact question (conversational wording)
- WHY this question matters (what changes based on the answer)
- What it SIGNALS to the client (demonstrates depth)

## All Questions (Extended List)
Full list of additional questions organized by category, for reference.

## Frame-Sensitive Findings
Technical findings from Steps 1-2 reframed under the current engagement frame. Each finding becomes either a service hook, a trust signal, or a risk to manage.

Use clear formatting, tables, and bold for emphasis. The TOP 5 section should be visually prominent.`
};
}),
"[project]/app/wizard/steps/research/step4-engagement-model.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "researchStep4Config",
    ()=>researchStep4Config
]);
const researchStep4Config = {
    stepNumber: 4,
    stepName: "Engagement Model",
    userInstructions: "Final step — assemble the engagement model: phase plan, revenue model, team structure, trust signals, and the complete research report.",
    systemPrompt: `You are a senior engagement architect assembling the final pre-sales strategy from all previous research. You have the First Contact Analysis, Claim Verification Report, and Strategic Analysis from previous steps.

## Your Four Jobs

### Job 1: ALIGNMENT MAPPING
If adjacent domains appeared during research (e.g., 5G/IoT, AI/ML, cloud migration):
- Map data pattern alignment between the client's platform and adjacent domains
- Identify experience transfer from our team to the client's problem
- Determine if alignment opens new conversations or expands scope

### Job 2: ENGAGEMENT ASSEMBLY
Build the engagement model:

**Entry Point**: The smallest, fastest way in. Use the CLIENT'S language for the role/service. Map to their "Now" priority.

**Phase Plan**:
- Phase 1 (Land): What, who, how long, deliverables, revenue estimate
- Phase 2 (Expand): Adds what capability, prerequisites from Phase 1
- Phase 3 (Own): Platform-level responsibility, long-term value

**Team Model**: Roles needed, using client's language where possible. Flag capability gaps honestly.

**Service Hooks**: Technical findings reframed as sellable services.
Format: [Finding] → [Service we offer] → [Value to client]

**Trust Signals**: What we say/show to prove credibility:
- Corrections we made to our own analysis (honesty)
- Technical gotchas we surfaced proactively (depth)
- Strategic context we know (homework)

### Job 3: RISK REGISTER & SWOT
- Strengths / Weaknesses / Opportunities / Threats for the engagement
- For each risk: trigger condition, impact, mitigation

### Job 4: QUALITY GATE
Before finalizing, check:
- Are we answering the RIGHT question (current frame, not the original one)?
- Have we used the client's language, not our jargon?
- Which assumptions are still unverified? (These are risks in the proposal)
- Does this contain insights a generic competitor could NOT produce?
- What would the expert reviewer challenge? Pre-address it.

## CRITICAL question formatting rule:
When asking questions, ALWAYS put each question on its own line ending with "?" — this enables the interactive options UI. NEVER embed questions in paragraphs.

## Conversation Guidelines
- Ask about revenue expectations, contract size, timeline constraints
- Ask about team availability and capability gaps
- If the user has pricing context (rates, headcount), use it for revenue estimates
- Be honest about what we can't do — it builds trust
- The final report should be presentable to both technical and business stakeholders

Once the engagement model is solid, tell the user to generate the final report. Do NOT generate it in the chat.`,
    generateButtonText: "Generate Engagement Report",
    approveButtonText: "Finalize Report",
    documentInputs: [
        "firstContact",
        "claimVerification",
        "strategicAnalysis"
    ],
    initialGreeting: "I've reviewed all three previous documents. To build the engagement model, I need a few things: (1) What's the expected contract size or revenue target? (2) What team do we have available? (3) Any timeline constraints (e.g., next client meeting date)? Share what you know and I'll work with it.",
    enableMultipleChoice: true,
    generationPrompt: `Based on our engagement modeling conversation and ALL previous documents, compile the final Engagement Model & Research Report in markdown format.

Structure it as:

# Engagement Report — [Client Name] / [Platform Name]

## Executive Summary
3-5 sentences: who the client is, what we found, what we recommend, and the opportunity size.

## Engagement Frame
The real question we're answering and how we got here (original ask → current frame).

## Client Priorities (Now / Next / Later)
Table format using the client's own language. Map each priority to our proposed service.

## Phase Plan
### Phase 1: Land (timeline)
- Entry point, deliverables, team, revenue estimate
### Phase 2: Expand (timeline)
- Added capabilities, prerequisites, team expansion, revenue estimate
### Phase 3: Own (timeline)
- Platform responsibility, long-term value, revenue estimate
**Total Year 1 Estimate**: $X

## Team Model
Table: Role (client's language) | Skills Required | Availability | Blockers

## Service Hooks
Table: Technical Finding | Service We Offer | Value to Client | Phase

## Trust Signals
What we bring to the meeting that competitors don't:
- Corrections made, gotchas surfaced, strategic homework done

## TOP 5 Killer Questions (from Strategic Analysis)
Reproduced here for easy reference in meetings.

## SWOT
Strengths | Weaknesses | Opportunities | Threats (2x2 grid format)

## Risk Register
Table: Risk | Trigger | Impact | Mitigation

## Immediate Actions
Table: # | Action | Owner | When | Why

## Appendix: Research Trail
- Sources consulted
- Claims verified (count)
- Corrections made (count)
- Expert inputs received
- Method: First Contact → Claim Verification → Strategic Analysis → Engagement Model

---
*Generated with Research Scaffold — AI-Native Pre-Sales Research Platform*`
};
}),
"[project]/app/wizard/flows/registry.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "flowRegistry",
    ()=>flowRegistry,
    "getFlowConfig",
    ()=>getFlowConfig
]);
// Product Vision flow (original vibescaffold)
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step1$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/step1-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step2$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/step2-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step3$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/step3-config.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step4$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/step4-config.ts [app-ssr] (ecmascript)");
// Pre-Sales Research flow
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step1$2d$first$2d$contact$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/research/step1-first-contact.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step2$2d$claim$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/research/step2-claim-verification.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step3$2d$strategic$2d$analysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/research/step3-strategic-analysis.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step4$2d$engagement$2d$model$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/steps/research/step4-engagement-model.ts [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
;
const flowRegistry = {
    "product-vision": {
        id: "product-vision",
        name: "Product Vision",
        description: "Turn your app idea into a complete technical spec with step-by-step build prompts and AI agent guardrails.",
        icon: "terminal",
        stepConfigs: [
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step1$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["step1Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step2$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["step2Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step3$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["step3Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$step4$2d$config$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["step4Config"]
        ],
        stepKeyMap: [
            "onePager",
            "devSpec",
            "checklist",
            "agentsMd"
        ],
        stepFileNames: [
            "ONE_PAGER",
            "DEV_SPEC",
            "PROMPT_PLAN",
            "AGENTS_MD"
        ],
        completionCommand: "Read AGENTS.md first, then ONE_PAGER.md, DEV_SPEC.md, and PROMPT_PLAN.md. Confirm when finished loading them."
    },
    "presales-research": {
        id: "presales-research",
        name: "Pre-Sales Research",
        description: "Analyze a client's technical architecture, verify claims, build strategic questions, and assemble an engagement model.",
        icon: "search",
        stepConfigs: [
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step1$2d$first$2d$contact$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchStep1Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step2$2d$claim$2d$verification$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchStep2Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step3$2d$strategic$2d$analysis$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchStep3Config"],
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$steps$2f$research$2f$step4$2d$engagement$2d$model$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["researchStep4Config"]
        ],
        stepKeyMap: [
            "firstContact",
            "claimVerification",
            "strategicAnalysis",
            "engagementModel"
        ],
        stepFileNames: [
            "FIRST_CONTACT_ANALYSIS",
            "CLAIM_VERIFICATION",
            "STRATEGIC_ANALYSIS",
            "ENGAGEMENT_MODEL"
        ],
        completionCommand: "Read ENGAGEMENT_MODEL.md first, then FIRST_CONTACT_ANALYSIS.md, CLAIM_VERIFICATION.md, and STRATEGIC_ANALYSIS.md. These form a complete pre-sales research package."
    }
};
function getFlowConfig(flowType) {
    return flowRegistry[flowType];
}
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[project]/app/components/Footer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
function Footer() {
    const currentYear = new Date().getFullYear();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-zinc-950 border-t border-zinc-800 py-16",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-7xl mx-auto px-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2.5 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-[18px] h-[18px] bg-accent flex items-center justify-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 bg-zinc-950"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 14,
                                                columnNumber: 18
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 13,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-mono font-bold text-white tracking-tight text-sm",
                                            children: "VIBE_SCAFFOLD"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 16,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 12,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-zinc-400 max-w-[280px]",
                                    children: "Turn your ideas into production-ready specifications. Built for vibe coders who want professional results."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 20,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 11,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-2xs font-bold text-zinc-400 uppercase tracking-widest mb-4",
                                    children: "Product"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 27,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/wizard",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Get Started"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 32,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 31,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/#how-it-works",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "How It Works"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 37,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 36,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 30,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 26,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-2xs font-bold text-zinc-400 uppercase tracking-widest mb-4",
                                    children: "Resources"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 45,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://github.com/benjaminshoemaker/vibecode_spec_generator",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "GitHub"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 50,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 49,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://github.com/benjaminshoemaker/vibecode_spec_generator/blob/main/README.md",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Documentation"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 55,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 54,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 48,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 44,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-mono text-2xs font-bold text-zinc-400 uppercase tracking-widest mb-4",
                                    children: "Support"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 64,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://discord.gg/9v3GpsEpCa",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Discord"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 69,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 68,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://forms.gle/CBvAEG7YLxdJvezD6",
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Send Feedback"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 79,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 78,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://github.com/benjaminshoemaker/vibecode_spec_generator/blob/main/PRIVACY_POLICY.md",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Privacy Policy"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "https://github.com/benjaminshoemaker/vibecode_spec_generator/blob/main/TERMS_OF_SERVICE.md",
                                                className: "text-sm text-zinc-200 hover:text-accent transition-colors",
                                                children: "Terms of Service"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/Footer.tsx",
                                                lineNumber: 94,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/Footer.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 67,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Footer.tsx",
                    lineNumber: 9,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row items-center gap-2 md:gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-zinc-400 font-mono",
                                    children: [
                                        "© ",
                                        currentYear,
                                        " Vibe Scaffold. All rights reserved."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 105,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "hidden md:inline text-zinc-700",
                                    children: "•"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 108,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-zinc-600",
                                    children: "Works with Claude Code, Cursor, Codex CLI, Windsurf, Copilot, and more"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 109,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "https://github.com/benjaminshoemaker",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "text-zinc-400 hover:text-accent transition-colors",
                                "aria-label": "GitHub",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    className: "w-5 h-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                        fillRule: "evenodd",
                                        d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
                                        clipRule: "evenodd"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Footer.tsx",
                                        lineNumber: 122,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Footer.tsx",
                                    lineNumber: 121,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/components/Footer.tsx",
                                lineNumber: 114,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/components/Footer.tsx",
                            lineNumber: 113,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Footer.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Footer.tsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/Footer.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/wizard/components/WizardProgress.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WizardProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/stepAccess.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$flows$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/flows/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
// Flow-specific metadata
const flowStepMeta = {
    "product-vision": {
        labels: [
            "One Pager",
            "Dev Spec",
            "Prompt Plan",
            "AGENTS.md"
        ],
        questions: [
            "~10-15",
            "~20",
            "0-1",
            "0-1"
        ],
        expectedQuestions: [
            12,
            20,
            1,
            0
        ]
    },
    "presales-research": {
        labels: [
            "First Contact",
            "Claim Verification",
            "Strategic Analysis",
            "Engagement Model"
        ],
        questions: [
            "~5-10",
            "~5-15",
            "~10-15",
            "~5-10"
        ],
        expectedQuestions: [
            8,
            10,
            12,
            8
        ]
    }
};
// Calculate asymptotic fill - approaches but never reaches maxFill
function calculateAsymptoticFill(messageCount, expectedCount) {
    if (expectedCount === 0) return 0;
    const maxFill = 0.88;
    const minFill = 0.08;
    if (messageCount === 0) return 0;
    const k = 2.5 / expectedCount;
    const fill = maxFill * (1 - Math.exp(-k * messageCount));
    return Math.max(minFill, Math.min(maxFill, fill));
}
function WizardProgress() {
    const { currentStep, setCurrentStep, steps, isGenerating, selectedFlow } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const [completingStep, setCompletingStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const isDev = ("TURBOPACK compile-time value", "development") === 'development';
    const flowConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$flows$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFlowConfig"])(selectedFlow);
    const stepKeyMap = flowConfig.stepKeyMap;
    const meta = flowStepMeta[selectedFlow] || flowStepMeta["product-vision"];
    const stepLabels = meta.labels;
    const stepQuestions = meta.questions;
    const expectedQuestions = meta.expectedQuestions;
    const handleAddTestMessage = ()=>{
        const { updateStepChat } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"].getState();
        const currentStepKey = stepKeyMap[currentStep - 1];
        const currentMessages = steps[currentStepKey].chatHistory;
        updateStepChat(currentStepKey, [
            ...currentMessages,
            {
                id: `test-${Date.now()}`,
                role: 'user',
                content: `Test message ${currentMessages.length + 1}`
            }
        ]);
    };
    // Listen for generation completion to trigger fill animation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const currentStepKey = stepKeyMap[currentStep - 1];
        const stepData = steps[currentStepKey];
        if (stepData.generatedDoc && !stepData.approved) {
            setCompletingStep(currentStepKey);
            const timer = setTimeout(()=>setCompletingStep(null), 1000);
            return ()=>clearTimeout(timer);
        }
    }, [
        steps,
        currentStep,
        stepKeyMap
    ]);
    const handleStepClick = (stepNumber)=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAccessStep"])(stepNumber, steps, stepKeyMap)) {
            return;
        }
        if (stepNumber > currentStep) {
            const { updateStepChat } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"].getState();
            const targetStepKey = stepKeyMap[stepNumber - 1];
            updateStepChat(targetStepKey, []);
        }
        setCurrentStep(stepNumber);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60 sticky top-14 z-20 animate-fadeSlideUp animate-delay-100",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1800px] mx-auto px-6 py-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500",
                            children: "STEP"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-lg font-bold text-white tabular-nums",
                            children: currentStep
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-lg text-zinc-600",
                            children: "/"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 95,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-lg text-zinc-500 tabular-nums",
                            children: stepKeyMap.length
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "mx-2 text-zinc-700",
                            children: "—"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 97,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-mono text-lg font-medium text-white tracking-wide",
                            children: stepLabels[currentStep - 1]
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this),
                        isDev && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddTestMessage,
                            className: "ml-4 px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-cyan-800 bg-cyan-950/30 hover:bg-cyan-900/40 transition-colors",
                            children: "+MSG"
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 103,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                    lineNumber: 88,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1",
                    children: stepKeyMap.map((stepKey, index)=>{
                        const stepNumber = index + 1;
                        const stepData = steps[stepKey];
                        const isCompleted = stepData.approved;
                        const hasDoc = stepData.generatedDoc !== null;
                        const isCurrent = currentStep === stepNumber;
                        const isAccessible = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAccessStep"])(stepNumber, steps, stepKeyMap);
                        const isCompletingNow = completingStep === stepKey;
                        const userMessageCount = stepData.chatHistory.filter((m)=>m.role === "user").length;
                        let fillPercent;
                        if (isCompleted || hasDoc) {
                            fillPercent = 100;
                        } else {
                            fillPercent = calculateAsymptoticFill(userMessageCount, expectedQuestions[index]) * 100;
                        }
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleStepClick(stepNumber),
                            disabled: !isAccessible,
                            className: `
                  group relative flex-1 h-2 overflow-hidden
                  ${!isAccessible ? "cursor-not-allowed" : "cursor-pointer"}
                `,
                            title: isAccessible ? stepLabels[index] : "Complete previous steps first",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-zinc-800"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 145,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `
                    absolute inset-y-0 left-0 transition-all
                    ${isCompletingNow ? "duration-700 ease-out" : "duration-500 ease-out"}
                    ${isCompleted || hasDoc ? "bg-zinc-100" : isCurrent ? "bg-gradient-to-r from-zinc-200 via-zinc-100 to-white" : "bg-zinc-600"}
                  `,
                                    style: {
                                        width: `${fillPercent}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 147,
                                    columnNumber: 17
                                }, this),
                                isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-white animate-pulse opacity-20"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 162,
                                    columnNumber: 19
                                }, this),
                                isCurrent && !hasDoc && fillPercent > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-y-0 left-0 bg-gradient-to-r from-white/30 to-transparent blur-sm transition-all duration-500",
                                    style: {
                                        width: `${Math.min(fillPercent + 10, 100)}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 166,
                                    columnNumber: 19
                                }, this),
                                isCompletingNow && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-white animate-ping opacity-40"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 173,
                                    columnNumber: 19
                                }, this),
                                isCurrent && isGenerating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer",
                                    style: {
                                        backgroundSize: "200% 100%"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 177,
                                    columnNumber: 19
                                }, this),
                                isAccessible && !isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-200"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                    lineNumber: 184,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, stepKey, true, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 135,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-1 mt-2",
                    children: stepKeyMap.map((stepKey, index)=>{
                        const isCurrent = currentStep === index + 1;
                        const sd = steps[stepKey];
                        const isCompleted = sd.approved;
                        const hasDoc = sd.generatedDoc !== null;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `font-mono text-xs transition-colors duration-300 ${isCompleted || hasDoc ? "text-white" : isCurrent ? "text-zinc-300" : "text-zinc-600"}`,
                                children: [
                                    stepQuestions[index],
                                    " questions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                                lineNumber: 201,
                                columnNumber: 17
                            }, this)
                        }, stepKey, false, {
                            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                            lineNumber: 200,
                            columnNumber: 15
                        }, this);
                    })
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/WizardProgress.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/wizard/components/WizardProgress.tsx",
            lineNumber: 86,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/wizard/components/WizardProgress.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/ProviderSelector.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProviderSelector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ProviderSelector() {
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [models, setModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingModels, setLoadingModels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const aiProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((state)=>state.aiProvider);
    const aiModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((state)=>state.aiModel);
    const setAIProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((state)=>state.setAIProvider);
    const setAIModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])((state)=>state.setAIModel);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Fetch free models when OpenRouter is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (aiProvider === "openrouter" && models.length === 0) {
            setLoadingModels(true);
            fetch("/api/openrouter-models").then((res)=>res.json()).then((data)=>{
                if (data.models) {
                    setModels(data.models);
                    // Set default model if none selected
                    if (!aiModel && data.models.length > 0) {
                        setAIModel(data.models[0].id);
                    }
                }
            }).catch((err)=>console.error("Failed to fetch models:", err)).finally(()=>setLoadingModels(false));
        }
    }, [
        aiProvider,
        models.length,
        aiModel,
        setAIModel
    ]);
    // Render nothing on server to prevent hydration mismatch
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs font-mono text-zinc-500",
                        children: "PROVIDER:"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ProviderSelector.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: aiProvider,
                        onChange: (e)=>setAIProvider(e.target.value),
                        className: "bg-zinc-900 border border-zinc-700 text-xs font-mono text-white px-2 py-1 focus:border-zinc-500 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "openai",
                                children: "OpenAI"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ProviderSelector.tsx",
                                lineNumber: 60,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: "openrouter",
                                children: "OpenRouter"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ProviderSelector.tsx",
                                lineNumber: 61,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ProviderSelector.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ProviderSelector.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            aiProvider === "openrouter" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        className: "text-xs font-mono text-zinc-500",
                        children: "MODEL:"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ProviderSelector.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                        value: aiModel || "",
                        onChange: (e)=>setAIModel(e.target.value),
                        disabled: loadingModels,
                        className: "bg-zinc-900 border border-zinc-700 text-xs font-mono text-white px-2 py-1 focus:border-zinc-500 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors max-w-[200px]",
                        children: loadingModels ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "Loading models..."
                        }, void 0, false, {
                            fileName: "[project]/app/components/ProviderSelector.tsx",
                            lineNumber: 75,
                            columnNumber: 15
                        }, this) : models.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                            value: "",
                            children: "No free models available"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ProviderSelector.tsx",
                            lineNumber: 77,
                            columnNumber: 15
                        }, this) : models.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                value: model.id,
                                children: model.name
                            }, model.id, false, {
                                fileName: "[project]/app/components/ProviderSelector.tsx",
                                lineNumber: 80,
                                columnNumber: 17
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/components/ProviderSelector.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ProviderSelector.tsx",
                lineNumber: 66,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ProviderSelector.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/utils/parseSpecMetadata.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseSpecMetadata",
    ()=>parseSpecMetadata
]);
const TECH_KEYWORDS = [
    "React",
    "React Native",
    "Next.js",
    "Next",
    "Vue",
    "Angular",
    "Svelte",
    "Node.js",
    "Node",
    "Express",
    "Nest",
    "NestJS",
    "Python",
    "Django",
    "Flask",
    "FastAPI",
    "Ruby",
    "Rails",
    "Go",
    "Golang",
    "Rust",
    "Java",
    "Spring",
    "Kotlin",
    "Swift",
    "Flutter",
    "PostgreSQL",
    "Postgres",
    "MySQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "DynamoDB",
    "AWS",
    "Supabase",
    "Firebase",
    "Vercel",
    "Netlify",
    "Cloudflare",
    "TypeScript",
    "JavaScript",
    "GraphQL",
    "REST",
    "Docker",
    "Kubernetes",
    "Terraform",
    "S3",
    "Lambda",
    "Tailwind",
    "CSS",
    "SCSS"
];
const INTEGRATION_KEYWORDS = [
    "Auth0",
    "Cognito",
    "Clerk",
    "Stripe",
    "PayPal",
    "Twilio",
    "SendGrid",
    "Mailchimp",
    "Segment",
    "Amplitude",
    "Mixpanel",
    "Google Analytics",
    "Sentry",
    "Datadog",
    "Slack",
    "Discord",
    "Zapier",
    "OpenAI",
    "Anthropic",
    "API Gateway",
    "OAuth",
    "SSO",
    "APNs",
    "FCM",
    "push notification",
    "webhook",
    "third-party",
    "integration",
    "DocuSign",
    "HelloSign",
    "Plaid",
    "HealthKit",
    "Google Fit"
];
function extractSection(content, headerPattern) {
    const lines = content.split("\n");
    let inSection = false;
    let sectionContent = [];
    for (const line of lines){
        if (headerPattern.test(line)) {
            inSection = true;
            continue;
        }
        if (inSection) {
            // Stop at next header (## or #)
            if (/^#{1,2}\s/.test(line)) {
                break;
            }
            sectionContent.push(line);
        }
    }
    const text = sectionContent.join("\n").trim();
    return text || null;
}
function extractFirst150Chars(text) {
    if (!text) return null;
    // Remove markdown formatting, collapse whitespace
    const cleaned = text.replace(/[#*_`\[\]]/g, "").replace(/\s+/g, " ").trim();
    if (cleaned.length <= 150) return cleaned;
    return cleaned.slice(0, 147) + "...";
}
function extractAppName(onePager) {
    // Look for "# One-Pager — App Name" or "# App Name"
    const match = onePager.match(/^#\s+(?:One-Pager\s*[—–-]\s*)?(.+)$/m);
    if (match) {
        return match[1].trim();
    }
    return null;
}
function extractPlatform(onePager) {
    const section = extractSection(onePager, /^##\s*Platform/i);
    if (!section) return null;
    const platforms = [];
    const lowerSection = section.toLowerCase();
    if (lowerSection.includes("ios") || lowerSection.includes("iphone") || lowerSection.includes("ipad")) {
        platforms.push("iOS");
    }
    if (lowerSection.includes("android")) {
        platforms.push("Android");
    }
    if (lowerSection.includes("web") || lowerSection.includes("browser")) {
        platforms.push("Web");
    }
    if (lowerSection.includes("desktop")) {
        platforms.push("Desktop");
    }
    if (lowerSection.includes("mobile-first") || lowerSection.includes("mobile first")) {
        if (!platforms.includes("iOS") && !platforms.includes("Android")) {
            platforms.push("Mobile");
        }
    }
    if (lowerSection.includes("cross-platform") || lowerSection.includes("react native") || lowerSection.includes("flutter")) {
        if (!platforms.includes("iOS") && !platforms.includes("Android")) {
            platforms.push("Cross-platform");
        }
    }
    return platforms.length > 0 ? platforms.join(", ") : null;
}
function extractTechStack(devSpec) {
    const found = new Set();
    for (const tech of TECH_KEYWORDS){
        // Case-insensitive search with word boundaries
        const regex = new RegExp(`\\b${tech.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (regex.test(devSpec)) {
            found.add(tech);
        }
    }
    return Array.from(found).slice(0, 15); // Limit to 15 items
}
function countIntegrations(devSpec) {
    let count = 0;
    const lowerSpec = devSpec.toLowerCase();
    for (const keyword of INTEGRATION_KEYWORDS){
        if (lowerSpec.includes(keyword.toLowerCase())) {
            count++;
        }
    }
    return count;
}
function computeComplexityTier(devSpec, integrationCount) {
    const wordCount = devSpec.split(/\s+/).length;
    if (wordCount > 4000 || integrationCount > 6) {
        return "complex";
    }
    if (wordCount < 1500 && integrationCount < 3) {
        return "simple";
    }
    return "moderate";
}
function parseSpecMetadata(onePager, devSpec) {
    const result = {
        appName: null,
        problem: null,
        idealUser: null,
        platform: null,
        techStack: [],
        integrationCount: 0,
        complexityTier: "moderate"
    };
    if (onePager) {
        try {
            result.appName = extractAppName(onePager);
            const problemSection = extractSection(onePager, /^##\s*Problem\s*Statement/i);
            result.problem = extractFirst150Chars(problemSection);
            const audienceSection = extractSection(onePager, /^##\s*Target\s*Audience|^##\s*Ideal\s*Customer/i);
            result.idealUser = extractFirst150Chars(audienceSection);
            result.platform = extractPlatform(onePager);
        } catch  {
        // Parsing failed, leave nulls
        }
    }
    if (devSpec) {
        try {
            result.techStack = extractTechStack(devSpec);
            result.integrationCount = countIntegrations(devSpec);
            result.complexityTier = computeComplexityTier(devSpec, result.integrationCount);
        } catch  {
        // Parsing failed, leave defaults
        }
    }
    return result;
}
}),
"[project]/app/wizard/components/FinalInstructionsModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FinalInstructionsModal",
    ()=>FinalInstructionsModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard.js [app-ssr] (ecmascript) <export default as Clipboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-ssr] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.js [app-ssr] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function FinalInstructionsModal({ open, onClose, onDownloadAll, agentCommand, onCopyCommand }) {
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [subscribeStatus, setSubscribeStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    if (!open) return null;
    const handleSubscribe = async (e)=>{
        e.preventDefault();
        if (!email.trim()) return;
        setSubscribeStatus("loading");
        try {
            const clientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOrCreateClientId"])();
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim(),
                    clientId
                })
            });
            if (res.ok) {
                setSubscribeStatus("success");
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackEmailSubscribe(true);
            } else {
                setSubscribeStatus("error");
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackEmailSubscribe(false);
            }
        } catch  {
            setSubscribeStatus("error");
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackEmailSubscribe(false);
        }
    };
    const handleCopy = async ()=>{
        try {
            await navigator.clipboard.writeText(agentCommand);
            onCopyCommand?.();
            setCopied(true);
            setTimeout(()=>setCopied(false), 1500);
        } catch (err) {
            console.error("Failed to copy command", err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-backdropEnter",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-zinc-950 border border-zinc-800 shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto animate-modalEnter",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-8 py-5 border-b border-zinc-800",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-2xs font-mono uppercase tracking-widest text-accent",
                                    children: "Wizard complete"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 70,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-xl font-bold text-white tracking-tight",
                                    children: "Hand off to your AI coding agent"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 69,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-[#a1a1aa] hover:text-white transition-colors",
                            "aria-label": "Close final instructions",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                lineNumber: 78,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 73,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                    lineNumber: 68,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-8 space-y-5 text-sm text-[#e4e4e7]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex h-6 w-6 items-center justify-center bg-accent text-zinc-950 text-xs font-bold font-mono",
                                    children: "1"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-white flex items-center gap-2",
                                            children: [
                                                "Download all documents (zip)",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: onDownloadAll,
                                                    className: "inline-flex items-center gap-2 px-3 py-1.5 bg-accent text-zinc-950 text-xs font-bold uppercase tracking-wide hover:bg-accent-light transition-all duration-200 active:scale-[0.98] active:translate-y-px",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 94,
                                                            columnNumber: 19
                                                        }, this),
                                                        "Download"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 90,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 88,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#a1a1aa] text-xs mt-1",
                                            children: "You will get GENERATED_DOCS.zip with everything bundled."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 98,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 87,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 83,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex h-6 w-6 items-center justify-center bg-accent text-zinc-950 text-xs font-bold font-mono",
                                    children: "2"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 103,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-white",
                                            children: "Extract the ZIP into your project root"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 107,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#a1a1aa] text-xs mt-1",
                                            children: "Place all files in the directory where you want to build."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 108,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 106,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 102,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex h-6 w-6 items-center justify-center bg-accent text-zinc-950 text-xs font-bold font-mono",
                                    children: "3"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 113,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-white",
                                            children: "Open your AI coding tool in that directory"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 117,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#a1a1aa] text-xs mt-1",
                                            children: "Examples: Codex CLI, Claude Code, or your preferred agent."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 118,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 116,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 112,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex h-6 w-6 items-center justify-center bg-accent text-zinc-950 text-xs font-bold font-mono",
                                    children: "4"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 123,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-white mb-2",
                                            children: "Tell the agent to read AGENTS.md first, then the other docs"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 127,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900 border border-zinc-800 p-3 flex items-start justify-between gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                                                    className: "text-xs text-[#e4e4e7] break-words font-mono",
                                                    children: agentCommand
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 131,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleCopy,
                                                    className: "flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 hover:border-accent text-white border border-zinc-700 text-xs font-semibold uppercase tracking-wide transition-colors",
                                                    children: copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                className: "w-4 h-4 text-emerald-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                lineNumber: 138,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Copied"
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Clipboard$3e$__["Clipboard"], {
                                                                className: "w-4 h-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                lineNumber: 143,
                                                                columnNumber: 23
                                                            }, this),
                                                            "Copy"
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 130,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 126,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 122,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 flex h-6 w-6 items-center justify-center bg-accent text-zinc-950 text-xs font-bold font-mono",
                                    children: "5"
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "font-semibold text-white",
                                            children: "Paste prompts from the Prompt Plan and build!"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 157,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[#a1a1aa] text-xs mt-1",
                                            children: "Follow PROMPT_PLAN.md in order and watch your project come together."
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 158,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 152,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pt-4 mt-6 border-t border-zinc-800/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                            className: "w-4 h-4 text-accent"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 165,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-2xs font-mono uppercase tracking-widest text-[#a1a1aa]",
                                            children: "Stay in the loop"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 166,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 164,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900/50 border border-zinc-800 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-8 w-8 items-center justify-center bg-accent/20 border border-accent/30",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                className: "w-4 h-4 text-accent"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                lineNumber: 174,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 173,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-semibold text-white text-sm",
                                                            children: "Get updates"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 176,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#a1a1aa] text-xs mb-3",
                                                    children: "Early access to new features and improvements."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 178,
                                                    columnNumber: 17
                                                }, this),
                                                subscribeStatus === "success" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-emerald-400 text-xs flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 181,
                                                            columnNumber: 21
                                                        }, this),
                                                        "Thanks! You're subscribed."
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 19
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                    onSubmit: handleSubscribe,
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "email",
                                                            placeholder: "you@example.com",
                                                            value: email,
                                                            onChange: (e)=>setEmail(e.target.value),
                                                            disabled: subscribeStatus === "loading",
                                                            className: "flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-[#a1a1aa] focus:outline-none focus:border-accent disabled:opacity-50"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 186,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            type: "submit",
                                                            disabled: subscribeStatus === "loading" || !email.trim(),
                                                            className: "px-3 py-1.5 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:translate-y-px",
                                                            children: subscribeStatus === "loading" ? "..." : "Subscribe"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 194,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 185,
                                                    columnNumber: 19
                                                }, this),
                                                subscribeStatus === "error" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-red-400 text-xs mt-2",
                                                    children: "Something went wrong. Please try again."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 204,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-zinc-900/50 border border-zinc-800 p-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 mb-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-8 w-8 items-center justify-center bg-accent/20 border border-accent/30",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                                className: "w-4 h-4 text-accent"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                lineNumber: 212,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "font-semibold text-white text-sm",
                                                            children: "Connect with us"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 214,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[#a1a1aa] text-xs mb-3",
                                                    children: "Join the community or share your thoughts."
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "https://discord.gg/9v3GpsEpCa",
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                            className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-accent text-xs text-[#a1a1aa] hover:text-accent transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                                    className: "w-4 h-4",
                                                                    viewBox: "0 0 24 24",
                                                                    fill: "currentColor",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                        d: "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                        lineNumber: 225,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                                    lineNumber: 224,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "Discord"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 218,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "https://forms.gle/CBvAEG7YLxdJvezD6",
                                                            target: "_blank",
                                                            rel: "noopener noreferrer",
                                                            className: "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-accent text-xs text-[#a1a1aa] hover:text-accent transition-colors",
                                                            children: "Feedback"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                            lineNumber: 229,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                                    lineNumber: 217,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                            lineNumber: 209,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                            lineNumber: 163,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "px-8 py-4 border-t border-zinc-800 flex justify-end",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onClose,
                        className: "px-4 py-2 text-sm font-mono font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-accent hover:text-accent transition-all duration-200 active:scale-[0.98] active:translate-y-px",
                        children: "Back to wizard"
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                        lineNumber: 244,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
                    lineNumber: 243,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
            lineNumber: 67,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/wizard/components/FinalInstructionsModal.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/wizard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WizardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$WizardStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/WizardStep.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/sampleDocs.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/utils/stepAccess.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$flows$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/flows/registry.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jszip/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Footer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$WizardProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/WizardProgress.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/terminal.js [app-ssr] (ecmascript) <export default as Terminal>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.js [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-ssr] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$braces$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileJson$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-braces.js [app-ssr] (ecmascript) <export default as FileJson>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ProviderSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ProviderSelector.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$parseSpecMetadata$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/parseSpecMetadata.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$FinalInstructionsModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/wizard/components/FinalInstructionsModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/spikelog.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
function WizardPage() {
    const { currentStep, setCurrentStep, steps, isGenerating, resetWizard, updateStepDoc, approveStep, selectedFlow, setSelectedFlow } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"])();
    const [showCompletionModal, setShowCompletionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDemoGenerating, setIsDemoGenerating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showExampleModal, setShowExampleModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Derive everything from selected flow
    const flowConfig = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$flows$2f$registry$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFlowConfig"])(selectedFlow);
    const stepConfigs = flowConfig.stepConfigs;
    const stepKeyMap = flowConfig.stepKeyMap;
    const stepNames = flowConfig.stepFileNames;
    const currentConfig = stepConfigs[currentStep - 1];
    const currentStepKey = stepKeyMap[currentStep - 1];
    const isDevelopment = ("TURBOPACK compile-time value", "development") === 'development';
    const agentCommand = flowConfig.completionCommand || "";
    // Track when users land on the wizard (covers direct visits)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const hasStarted = undefined;
    }, []);
    // Track step views
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackStepView(currentStep, stepNames[currentStep - 1]);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackStepView(currentStep, stepNames[currentStep - 1]);
    }, [
        currentStep,
        stepNames
    ]);
    const handleStepClick = (stepNumber)=>{
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAccessStep"])(stepNumber, steps, stepKeyMap)) {
            return;
        }
        if (stepNumber > currentStep) {
            const { updateStepChat } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"].getState();
            const targetStepKey = stepKeyMap[stepNumber - 1];
            updateStepChat(targetStepKey, []);
        }
        setCurrentStep(stepNumber);
    };
    const handleApproveAndNext = ()=>{
        const { approveStep, updateStepChat } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useWizardStore"].getState();
        const wasAlreadyApproved = steps[currentStepKey].approved;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackStepApproved(currentStep, stepNames[currentStep - 1]);
        approveStep(currentStepKey);
        if (currentStep < stepConfigs.length) {
            const nextStepKey = stepKeyMap[currentStep];
            updateStepChat(nextStepKey, []);
            setCurrentStep(currentStep + 1);
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackFinalizeClick();
            if (!wasAlreadyApproved) {
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackWizardComplete();
                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackWizardCompletion();
            }
            setShowCompletionModal(true);
        }
    };
    const handleDownload = (stepKey, stepName)=>{
        const stepData = steps[stepKey];
        if (!stepData.generatedDoc) return;
        const blob = new Blob([
            stepData.generatedDoc
        ], {
            type: 'text/markdown'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${stepName.toUpperCase().replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackDocumentDownload(stepName);
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackDocumentDownload("individual", 1);
    };
    // Sample docs only available for product-vision flow
    const handleLoadSampleDocs = ()=>{
        if (selectedFlow !== "product-vision") return;
        setShowCompletionModal(false);
        updateStepDoc('onePager', __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].onePager);
        approveStep('onePager');
        updateStepDoc('devSpec', __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].devSpec);
        approveStep('devSpec');
        updateStepDoc('checklist', __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].promptPlan);
        approveStep('checklist');
        updateStepDoc('agentsMd', __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].agentsMd);
        approveStep('agentsMd');
        setCurrentStep(1);
    };
    const handleLoadDemoStep = async (stepKey, stepIndex)=>{
        if (selectedFlow !== "product-vision") return;
        const sampleMap = {
            onePager: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].onePager,
            devSpec: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].devSpec,
            checklist: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].promptPlan,
            agentsMd: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].agentsMd
        };
        if (!sampleMap[stepKey]) return;
        setIsDemoGenerating(true);
        await new Promise((resolve)=>setTimeout(resolve, 2000));
        updateStepDoc(stepKey, sampleMap[stepKey]);
        setIsDemoGenerating(false);
    };
    const handleReset = ()=>{
        setShowCompletionModal(false);
        resetWizard();
    };
    const handleCompletionDownload = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackCompletionDownload();
        handleDownloadAll();
    };
    const handleCommandCopy = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackCompletionCopy();
    };
    const handleDownloadAll = async ()=>{
        // Fire and forget: log metadata for analytics (product-vision only)
        if (selectedFlow === "product-vision") {
            try {
                const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$parseSpecMetadata$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parseSpecMetadata"])(steps.onePager.generatedDoc, steps.devSpec.generatedDoc);
                const clientId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getOrCreateClientId"])();
                fetch("/api/log-metadata", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...metadata,
                        clientId
                    })
                }).catch(()=>{});
            } catch  {}
        }
        const zip = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jszip$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]();
        let hasDocuments = false;
        let documentCount = 0;
        stepNames.forEach((name, index)=>{
            const stepKey = stepKeyMap[index];
            const stepData = steps[stepKey];
            if (stepData.generatedDoc) {
                const filename = `${name.toUpperCase().replace(/\s+/g, '_')}.md`;
                zip.file(filename, stepData.generatedDoc);
                hasDocuments = true;
                documentCount++;
            }
        });
        if (hasDocuments) {
            const blob = await zip.generateAsync({
                type: 'blob'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const zipName = selectedFlow === "product-vision" ? "GENERATED_DOCS.zip" : "RESEARCH_REPORT.zip";
            a.download = zipName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["analytics"].trackBulkDownload(documentCount);
            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$spikelog$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["spikelog"].trackDocumentDownload("bulk", documentCount);
            if (documentCount === stepNames.length) {
                setShowCompletionModal(true);
            }
        }
    };
    const handleFlowSwitch = (flowType)=>{
        if (flowType === selectedFlow) return;
        setSelectedFlow(flowType);
        setCurrentStep(1);
    };
    // Check if current step has user messages (for generate button)
    const hasUserMessages = steps[currentStepKey].chatHistory.some((msg)=>msg.role === 'user');
    // Steps 3+ in product-vision flow can generate without chat (original behavior)
    const canGenerateWithoutChat = selectedFlow === "product-vision" && (currentStepKey === 'checklist' || currentStepKey === 'agentsMd');
    // Get sample doc for example panel (product-vision only)
    const getExampleDoc = ()=>{
        if (selectedFlow !== "product-vision") return null;
        if (currentStepKey === 'onePager') return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].onePager;
        if (currentStepKey === 'devSpec') return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].devSpec;
        if (currentStepKey === 'checklist') return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].promptPlan;
        if (currentStepKey === 'agentsMd') return __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$sampleDocs$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["sampleDocs"].agentsMd;
        return null;
    };
    const exampleDoc = getExampleDoc();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-zinc-950 text-[#e4e4e7] font-sans flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "blueprint-grid"
            }, void 0, false, {
                fileName: "[project]/app/wizard/page.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-10 flex flex-col min-h-screen",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "bg-zinc-950 border-b border-zinc-800 h-14 sticky top-0 z-30 px-6 flex items-center justify-between animate-fadeSlideUp",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-[18px] h-[18px] bg-accent flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-2 h-2 bg-zinc-950"
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/page.tsx",
                                            lineNumber: 241,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 240,
                                        columnNumber: 12
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-sm font-bold text-white tracking-tight",
                                        children: [
                                            selectedFlow === "product-vision" ? "VIBE_SCAFFOLD" : "RESEARCH_SCAFFOLD",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-600 mx-1",
                                                children: "›"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 14
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-zinc-400 font-medium",
                                                children: selectedFlow === "product-vision" ? "WIZARD" : "RESEARCH"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 246,
                                                columnNumber: 14
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 12
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/page.tsx",
                                lineNumber: 239,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden md:block",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ProviderSelector$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                            fileName: "[project]/app/wizard/page.tsx",
                                            lineNumber: 255,
                                            columnNumber: 13
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden md:flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-0.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleFlowSwitch("product-vision"),
                                                className: `flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-all ${selectedFlow === "product-vision" ? "bg-accent text-zinc-950 font-bold" : "text-zinc-500 hover:text-zinc-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$terminal$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Terminal$3e$__["Terminal"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 268,
                                                        columnNumber: 15
                                                    }, this),
                                                    "PRODUCT"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 260,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>handleFlowSwitch("presales-research"),
                                                className: `flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-all ${selectedFlow === "presales-research" ? "bg-accent text-zinc-950 font-bold" : "text-zinc-500 hover:text-zinc-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 279,
                                                        columnNumber: 15
                                                    }, this),
                                                    "RESEARCH"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 271,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 259,
                                        columnNumber: 11
                                    }, this),
                                    isDevelopment && selectedFlow === "product-vision" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleLoadSampleDocs,
                                        className: "hidden md:flex items-center gap-2 px-3 py-1 text-xs font-mono text-emerald-500 border border-emerald-900/50 bg-emerald-950/20 hover:bg-emerald-950/40 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$braces$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileJson$3e$__["FileJson"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this),
                                            "LOAD_SAMPLES"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 285,
                                        columnNumber: 13
                                    }, this),
                                    isDevelopment && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            const clientId = localStorage.getItem('vs_client_id');
                                            if (clientId) {
                                                navigator.clipboard.writeText(clientId);
                                            }
                                        },
                                        className: "hidden md:flex items-center gap-2 px-3 py-1 text-xs font-mono text-amber-500 border border-amber-900/50 bg-amber-950/20 hover:bg-amber-950/40 transition-colors",
                                        children: "COPY_CLIENT_ID"
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 13
                                    }, this),
                                    isDevelopment && selectedFlow === "product-vision" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleLoadDemoStep(currentStepKey, currentStep - 1),
                                        disabled: isDemoGenerating,
                                        className: "hidden md:flex items-center gap-2 px-3 py-1 text-xs font-mono text-amber-500 border border-amber-900/50 bg-amber-950/20 hover:bg-amber-950/40 transition-colors disabled:opacity-50",
                                        children: [
                                            isDemoGenerating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-3 h-3 border-2 border-amber-400 border-t-amber-950 rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 313,
                                                columnNumber: 17
                                            }, this),
                                            isDemoGenerating ? "DEMO..." : `${currentConfig.generateButtonText.toUpperCase()} (DEMO)`
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 307,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: handleReset,
                                        className: "flex items-center gap-2 px-3 py-1 text-xs font-mono text-[#a1a1aa] hover:text-white transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                                className: "w-3 h-3"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 322,
                                                columnNumber: 13
                                            }, this),
                                            "RESET"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 318,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/page.tsx",
                                lineNumber: 252,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 238,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$WizardProgress$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 329,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 max-w-[1800px] mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-[1fr_280px] lg:grid-cols-[1fr_300px] gap-6 lg:gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col h-[calc(100vh-180px)] animate-fadeSlideUp animate-delay-150",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 bg-zinc-900 border border-zinc-800 overflow-hidden flex flex-col shadow-xl",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$WizardStep$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        config: currentConfig,
                                        stepKey: currentStepKey,
                                        onApproveAndNext: handleApproveAndNext
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 337,
                                        columnNumber: 14
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/page.tsx",
                                    lineNumber: 336,
                                    columnNumber: 11
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/wizard/page.tsx",
                                lineNumber: 335,
                                columnNumber: 9
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "space-y-6 flex flex-col",
                                children: [
                                    exampleDoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-800 p-6 order-3 lg:order-1 animate-fadeSlideUp animate-delay-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xs font-mono font-bold text-[#a1a1aa] uppercase tracking-widest mb-4",
                                                children: "EXAMPLE OUTPUT"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative max-h-[120px] overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                                        className: "font-mono text-xs text-zinc-400 whitespace-pre-wrap leading-relaxed",
                                                        children: exampleDoc.split('\n').slice(0, 8).join('\n')
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 354,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 353,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowExampleModal(true),
                                                className: "text-xs text-accent hover:text-accent-light font-mono mt-3 inline-flex items-center gap-1 transition-all duration-200",
                                                children: "See full example →"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 360,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 350,
                                        columnNumber: 13
                                    }, this),
                                    selectedFlow === "presales-research" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-800 p-6 order-3 lg:order-1 animate-fadeSlideUp animate-delay-200",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xs font-mono font-bold text-[#a1a1aa] uppercase tracking-widest mb-4",
                                                children: "RESEARCH FLOW"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 372,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2 text-xs text-zinc-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-accent font-mono font-bold",
                                                                children: "01"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 375,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "First Contact Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 376,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-accent font-mono font-bold",
                                                                children: "02"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 379,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Claim Verification"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 380,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-accent font-mono font-bold",
                                                                children: "03"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 383,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Strategic Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 384,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 382,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-accent font-mono font-bold",
                                                                children: "04"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 387,
                                                                columnNumber: 19
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Engagement Model"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 19
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 386,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 373,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-zinc-600 mt-3 leading-relaxed",
                                                children: "Each step builds on the previous. Claims are tracked, verified, and corrected throughout."
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 391,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 371,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-800 p-6 lg:sticky lg:top-20 order-1 lg:order-2 animate-fadeSlideUp animate-delay-250",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xs font-mono font-bold text-[#a1a1aa] uppercase tracking-widest mb-4",
                                                children: "ACTIONS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 399,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    window.dispatchEvent(new CustomEvent('triggerGenerate'));
                                                },
                                                disabled: isGenerating || !canGenerateWithoutChat && !hasUserMessages,
                                                className: "w-full mb-3 py-3 px-4 bg-accent hover:bg-accent-light text-zinc-950 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(245,158,11,0.15)] active:scale-[0.98] active:translate-y-px",
                                                children: [
                                                    isGenerating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-amber-400 border-t-zinc-900 rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 17
                                                    }, this),
                                                    isGenerating ? "PROCESSING..." : currentConfig.generateButtonText.toUpperCase()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 401,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleApproveAndNext,
                                                disabled: !steps[currentStepKey].generatedDoc,
                                                className: "w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-accent hover:text-accent text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:translate-y-px",
                                                children: currentStep === stepConfigs.length ? "FINALIZE" : "APPROVE & NEXT"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 414,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 398,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-zinc-900 border border-zinc-800 p-6 order-2 lg:order-3 animate-fadeSlideUp animate-delay-300",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-2xs font-mono font-bold text-[#a1a1aa] uppercase tracking-widest mb-4",
                                                children: "GENERATED DOCUMENTS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 425,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-px bg-zinc-800 border border-zinc-800",
                                                children: stepNames.map((name, index)=>{
                                                    const stepKey = stepKeyMap[index];
                                                    const isCompleted = steps[stepKey].approved;
                                                    const isActive = currentStep === index + 1;
                                                    const hasDocument = steps[stepKey].generatedDoc !== null;
                                                    const isLocked = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$utils$2f$stepAccess$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["canAccessStep"])(index + 1, steps, stepKeyMap);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `relative flex items-center justify-between p-3 transition-all ${isActive ? 'bg-zinc-800 border-l-2 border-white' : isLocked ? 'bg-zinc-900 border-l-2 border-transparent opacity-70' : 'bg-zinc-900 hover:bg-zinc-800/50 border-l-2 border-transparent'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleStepClick(index + 1),
                                                                disabled: isLocked,
                                                                title: isLocked ? "Complete previous steps to unlock this stage" : undefined,
                                                                className: `flex items-center gap-3 flex-1 text-left ${isLocked ? 'cursor-not-allowed' : ''}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `font-mono text-xs ${isCompleted ? 'text-white' : isActive ? 'text-white' : isLocked ? 'text-zinc-700' : 'text-[#a1a1aa]'}`,
                                                                        children: isCompleted ? '[✓]' : `[0${index + 1}]`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/wizard/page.tsx",
                                                                        lineNumber: 451,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-xs font-bold font-mono tracking-wide ${isActive || isCompleted ? 'text-white' : isLocked ? 'text-zinc-600' : 'text-[#a1a1aa]'}`,
                                                                        children: name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/wizard/page.tsx",
                                                                        lineNumber: 462,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 443,
                                                                columnNumber: 21
                                                            }, this),
                                                            hasDocument && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleDownload(stepKey, name),
                                                                className: "text-accent hover:text-accent-light transition-all",
                                                                title: "Download",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                    className: "w-4 h-4"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/wizard/page.tsx",
                                                                    lineNumber: 475,
                                                                    columnNumber: 25
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/wizard/page.tsx",
                                                                lineNumber: 470,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, name, true, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 436,
                                                        columnNumber: 19
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 427,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleDownloadAll,
                                                disabled: !stepKeyMap.some((key)=>steps[key].generatedDoc !== null),
                                                className: "w-full mt-4 py-2.5 px-4 text-[#a1a1aa] hover:text-accent text-xs font-mono transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                        className: "w-3 h-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/wizard/page.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 15
                                                    }, this),
                                                    "DOWNLOAD_ALL.ZIP"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 483,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 424,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/wizard/page.tsx",
                                lineNumber: 346,
                                columnNumber: 9
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 332,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Footer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 496,
                        columnNumber: 7
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$wizard$2f$components$2f$FinalInstructionsModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FinalInstructionsModal"], {
                        open: showCompletionModal,
                        onClose: ()=>setShowCompletionModal(false),
                        onDownloadAll: handleCompletionDownload,
                        agentCommand: agentCommand,
                        onCopyCommand: handleCommandCopy
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 498,
                        columnNumber: 7
                    }, this),
                    showExampleModal && exampleDoc && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-backdropEnter",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-zinc-900 border border-zinc-800 max-w-3xl w-full max-h-[80vh] flex flex-col animate-modalEnter shadow-2xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between px-6 py-4 border-b border-zinc-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-2xs font-mono text-zinc-500 uppercase tracking-widest mb-1",
                                                    children: "Example Output"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/page.tsx",
                                                    lineNumber: 512,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-lg font-bold text-white",
                                                    children: currentConfig.stepName
                                                }, void 0, false, {
                                                    fileName: "[project]/app/wizard/page.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/wizard/page.tsx",
                                            lineNumber: 511,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowExampleModal(false),
                                            className: "text-zinc-400 hover:text-white transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/app/wizard/page.tsx",
                                                lineNumber: 519,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/wizard/page.tsx",
                                            lineNumber: 515,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/wizard/page.tsx",
                                    lineNumber: 510,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 overflow-auto p-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                        className: "text-sm font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed",
                                        children: exampleDoc
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 523,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/page.tsx",
                                    lineNumber: 522,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-t border-zinc-800 bg-zinc-950",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-zinc-500",
                                        children: "This is sample output for a Photo Captioner app. Your output will be customized to your idea."
                                    }, void 0, false, {
                                        fileName: "[project]/app/wizard/page.tsx",
                                        lineNumber: 528,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/wizard/page.tsx",
                                    lineNumber: 527,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/wizard/page.tsx",
                            lineNumber: 509,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/wizard/page.tsx",
                        lineNumber: 508,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/wizard/page.tsx",
                lineNumber: 235,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/wizard/page.tsx",
        lineNumber: 230,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__aa497628._.js.map