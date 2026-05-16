import { streamText, generateText } from "ai";
import { getAIModel, AIProvider } from "@/app/utils/aiProvider";
import { spikelog } from "@/app/utils/spikelog";

export const runtime = "edge";

// Convert messages with images to Vercel AI SDK multimodal format
function buildMultimodalMessages(messages: Array<{ role: string; content: string; images?: string[] }>) {
  return messages.map((msg) => {
    if (msg.images && msg.images.length > 0 && msg.role === "user") {
      const parts: Array<{ type: string; text?: string; image?: string; mimeType?: string }> = [];

      if (msg.content) {
        parts.push({ type: "text", text: msg.content });
      }

      for (const dataUrl of msg.images) {
        const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
        if (match) {
          parts.push({
            type: "image",
            image: match[2],
            mimeType: match[1],
          });
        }
      }

      return { role: msg.role, content: parts };
    }

    return { role: msg.role, content: msg.content };
  });
}

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    const { messages, systemPrompt, documentInputs, stream = true, aiProvider = "openai", aiModel = null } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    // Get AI model based on provider selection
    let model;
    try {
      model = getAIModel(aiProvider as AIProvider, { model: aiModel });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : "Failed to initialize AI provider" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build full system prompt with document context if available
    let fullSystemPrompt = systemPrompt || "You are a helpful assistant.";

    if (documentInputs && Object.keys(documentInputs).length > 0) {
      let documentContext = "\n\n--- PREVIOUS DOCUMENTS FOR CONTEXT ---\n\n";
      for (const [key, value] of Object.entries(documentInputs)) {
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
    messages.forEach((msg: { role: string; content: string; images?: string[] }, idx: number) => {
      console.log(`\n[${idx + 1}] ${msg.role.toUpperCase()}:`);
      console.log(msg.content);
      if (msg.images?.length) {
        console.log(`  [${msg.images.length} image(s) attached]`);
      }
    });
    console.log("\n" + "=".repeat(80) + "\n");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processedMessages = buildMultimodalMessages(messages) as any;

    if (stream) {
      const result = streamText({
        model,
        system: fullSystemPrompt,
        messages: processedMessages,
      });

      spikelog.trackApiResponseTime("chat", Date.now() - startTime);
      return result.toTextStreamResponse();
    }

    const result = await generateText({
      model,
      system: fullSystemPrompt,
      messages: processedMessages,
    });

    spikelog.trackApiResponseTime("chat", Date.now() - startTime);

    return new Response(result.text, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Chat API error:", error);

    spikelog.trackApiError(
      "chat",
      error instanceof Error ? error.name : "Unknown"
    );

    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
