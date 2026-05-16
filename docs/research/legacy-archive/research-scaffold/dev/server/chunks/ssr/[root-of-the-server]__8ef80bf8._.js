module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/utils/analytics.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Google Analytics event tracking utility
// Requires GA to be initialized in layout.tsx
__turbopack_context__.s([
    "analytics",
    ()=>analytics,
    "getOrCreateClientId",
    ()=>getOrCreateClientId,
    "isReturningUser",
    ()=>isReturningUser,
    "trackSessionStart",
    ()=>trackSessionStart
]);
const sendGtag = (eventName, params)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
// ============================================
// Client ID management for cohort tracking
// ============================================
const CLIENT_ID_KEY = "vs_client_id";
const SESSION_TRACKED_KEY = "vs_session_tracked";
function getOrCreateClientId() {
    if ("TURBOPACK compile-time truthy", 1) return "";
    //TURBOPACK unreachable
    ;
    let clientId;
}
function isReturningUser() {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
// ============================================
// Postgres tracking for cohort analysis
// ============================================
// Track event to our Postgres database for cohort analysis
function trackToPostgres(eventType, metadata) {
    const clientId = getOrCreateClientId();
    if (!clientId) return;
    // Fire and forget - don't await
    fetch("/api/track-event", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            clientId,
            eventType,
            metadata
        })
    }).catch(()=>{
    // Silently fail - analytics should never break the app
    });
}
function trackSessionStart() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const returning = undefined;
}
const analytics = {
    trackWizardStart: (source)=>{
        sendGtag("wizard_start", {
            source
        });
        trackToPostgres("wizard_start", {
            source
        });
    },
    trackStepView: (stepNumber, stepName)=>{
        sendGtag("step_view", {
            step_number: stepNumber,
            step_name: stepName
        });
    },
    trackStepApproved: (stepNumber, stepName)=>{
        sendGtag("step_approved", {
            step_number: stepNumber,
            step_name: stepName
        });
    },
    trackDocumentGenerate: (stepName, success)=>{
        sendGtag("document_generate", {
            step_name: stepName,
            success
        });
        if (success) {
            trackToPostgres("doc_generated", {
                step_name: stepName
            });
        }
    },
    trackDocumentDownload: (stepName)=>{
        sendGtag("document_download", {
            step_name: stepName,
            download_type: "individual"
        });
    },
    trackBulkDownload: (documentCount)=>{
        sendGtag("bulk_download", {
            document_count: documentCount,
            download_type: "zip"
        });
        trackToPostgres("download", {
            doc_count: documentCount
        });
    },
    trackWizardReset: ()=>{
        sendGtag("wizard_reset");
    },
    trackWizardComplete: ()=>{
        sendGtag("wizard_complete");
        trackToPostgres("wizard_complete", {});
    },
    trackChatMessage: (stepName)=>{
        sendGtag("chat_message", {
            step_name: stepName
        });
        trackToPostgres("chat_message", {
            step_name: stepName
        });
    },
    trackFinalizeClick: ()=>{
        sendGtag("finalize_clicked");
    },
    trackCompletionDownload: ()=>{
        sendGtag("completion_modal_download");
    },
    trackCompletionCopy: ()=>{
        sendGtag("completion_modal_copy");
    },
    trackEmailSubscribe: (success)=>{
        sendGtag("email_subscribe", {
            success
        });
    },
    trackSampleDownload: ()=>{
        sendGtag("sample_download");
        trackToPostgres("sample_download", {});
    }
};
}),
"[project]/app/components/SessionTracker.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SessionTracker",
    ()=>SessionTracker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/analytics.ts [app-ssr] (ecmascript)");
"use client";
;
;
function SessionTracker() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$analytics$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["trackSessionStart"])();
    }, []);
    return null;
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8ef80bf8._.js.map