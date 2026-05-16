(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__af4ebc16._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/app/api/openrouter-models/route.ts [app-edge-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "runtime",
    ()=>runtime
]);
const runtime = "edge";
async function GET() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }
        const data = await response.json();
        // Filter for free models (prompt and completion both "0")
        const freeModels = data.data.filter((model)=>model.pricing.prompt === "0" && model.pricing.completion === "0").map((model)=>({
                id: model.id,
                name: model.name
            })).sort((a, b)=>a.name.localeCompare(b.name));
        return new Response(JSON.stringify({
            models: freeModels
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Failed to fetch OpenRouter models:", error);
        return new Response(JSON.stringify({
            error: "Failed to fetch models"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__af4ebc16._.js.map