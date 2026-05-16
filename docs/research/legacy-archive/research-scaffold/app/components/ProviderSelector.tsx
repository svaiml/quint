"use client";

import { useEffect, useState } from "react";
import { useWizardStore } from "@/app/store";
import { AIProvider } from "@/app/types";

interface OpenRouterModel {
  id: string;
  name: string;
}

export default function ProviderSelector() {
  const [mounted, setMounted] = useState(false);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  
  const aiProvider = useWizardStore((state) => state.aiProvider);
  const aiModel = useWizardStore((state) => state.aiModel);
  const setAIProvider = useWizardStore((state) => state.setAIProvider);
  const setAIModel = useWizardStore((state) => state.setAIModel);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch free models when OpenRouter is selected
  useEffect(() => {
    if (aiProvider === "openrouter" && models.length === 0) {
      setLoadingModels(true);
      fetch("/api/openrouter-models")
        .then((res) => res.json())
        .then((data) => {
          if (data.models) {
            setModels(data.models);
            // Set default model if none selected
            if (!aiModel && data.models.length > 0) {
              setAIModel(data.models[0].id);
            }
          }
        })
        .catch((err) => console.error("Failed to fetch models:", err))
        .finally(() => setLoadingModels(false));
    }
  }, [aiProvider, models.length, aiModel, setAIModel]);

  // Render nothing on server to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-zinc-500">PROVIDER:</label>
        <select
          value={aiProvider}
          onChange={(e) => setAIProvider(e.target.value as AIProvider)}
          className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-white px-2 py-1 focus:border-zinc-500 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors"
        >
          <option value="openai">OpenAI</option>
          <option value="openrouter">OpenRouter</option>
        </select>
      </div>
      
      {aiProvider === "openrouter" && (
        <div className="flex items-center gap-2">
          <label className="text-xs font-mono text-zinc-500">MODEL:</label>
          <select
            value={aiModel || ""}
            onChange={(e) => setAIModel(e.target.value)}
            disabled={loadingModels}
            className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-white px-2 py-1 focus:border-zinc-500 focus:outline-none cursor-pointer hover:border-zinc-600 transition-colors max-w-[200px]"
          >
            {loadingModels ? (
              <option value="">Loading models...</option>
            ) : models.length === 0 ? (
              <option value="">No free models available</option>
            ) : (
              models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
}
