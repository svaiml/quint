export const runtime = "edge";

interface OpenRouterModel {
  id: string;
  name: string;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

export async function GET() {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data: OpenRouterModelsResponse = await response.json();

    // Filter for free models (prompt and completion both "0")
    const freeModels = data.data
      .filter(
        (model) =>
          model.pricing.prompt === "0" && model.pricing.completion === "0"
      )
      .map((model) => ({
        id: model.id,
        name: model.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return new Response(JSON.stringify({ models: freeModels }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch OpenRouter models:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch models" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
