"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowRight, ImagePlus, X } from "lucide-react";

import { Message } from "@/app/types";
import { analytics, getOrCreateClientId } from "@/app/utils/analytics";
import { spikelog } from "@/app/utils/spikelog";
import { useHasHydrated, useWizardStore } from "@/app/store";
import { OptionsModal, type OptionsModalItem } from "./OptionsModal";
import { extractQuestionLines } from "@/app/wizard/utils/questionInstances";
import { questionOptionsSchema } from "@/app/schemas/questionOptions";
import { summarizeConversation } from "@/app/hooks/useQuestionOptions";
import { formatSelectionsAsMessage } from "@/app/wizard/utils/selectionFormat";

interface ChatInterfaceWithOptionsProps {
  systemPrompt: string;
  initialMessages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  documentInputs?: Record<string, string>;
  initialGreeting?: string;
  stepName?: string;
  placeholder?: string;
  quickStartSuggestions?: string[];
}

export default function ChatInterfaceWithOptions({
  systemPrompt,
  initialMessages,
  onMessagesChange,
  documentInputs,
  initialGreeting,
  stepName,
  placeholder,
  quickStartSuggestions,
}: ChatInterfaceWithOptionsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const hasHydrated = useHasHydrated();
  const aiProvider = useWizardStore((s) => s.aiProvider);
  const aiModel = useWizardStore((s) => s.aiModel);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());

  // Image helpers
  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const addImages = useCallback(async (files: File[]) => {
    const urls: string[] = [];
    for (const f of files) {
      if (f.size > 20 * 1024 * 1024) continue;
      urls.push(await fileToDataUrl(f));
    }
    if (urls.length) setPendingImages((prev) => [...prev, ...urls]);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const imgs = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith("image/"));
    if (imgs.length) { e.preventDefault(); addImages(imgs); }
  }, [addImages]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const imgs = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (imgs.length) addImages(imgs);
  }, [addImages]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(Array.from(e.target.files).filter((f) => f.type.startsWith("image/")));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [addImages]);

  // Auto-resize textarea
  const autoResizeTextarea = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, []);

  useEffect(() => {
    autoResizeTextarea(textareaRef.current);
  }, [input, autoResizeTextarea]);

  const logChatMessage = async (role: "user" | "assistant", content: string) => {
    try {
      const clientId = getOrCreateClientId();
      await fetch("/api/log-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          sessionId: sessionIdRef.current,
          stepName,
          role,
          content,
        }),
      });
    } catch (error) {
      // Fire-and-forget: don't block user experience
      console.error("Failed to log chat message:", error);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const isAssistantPending =
    isLoading && lastMessage?.role === "assistant" ? lastMessage.id : null;
  const dismissedAssistantIdsRef = useRef<Set<string>>(new Set());
  const optionsAbortRef = useRef<AbortController | null>(null);
  const [optionsModalState, setOptionsModalState] = useState<{
    assistantMessageId: string;
    questions: string[];
    optionsByQuestion: string[][];
    items: OptionsModalItem[];
  } | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!hasHydrated) return; // Avoid wiping persisted chat before hydration completes
    onMessagesChange(messages);
  }, [messages, onMessagesChange, hasHydrated]);

  // Initialize messages after hydration completes
  useEffect(() => {
    if (!hasHydrated) return;
    if (messages.length > 0) return;

    if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else if (initialGreeting) {
      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: initialGreeting,
        },
      ]);
    }
  }, [hasHydrated, initialMessages, initialGreeting, messages.length]);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const updateAssistantMessage = useCallback(
    (assistantId: string, content: string) => {
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantId ? { ...msg, content } : msg))
      );
    },
    []
  );

  const runNonStreamingFallback = useCallback(
    async (
      assistantId: string,
      requestMessages: Message[],
      reason: string,
      trackChatResponseTime: () => void
    ) => {
      spikelog.trackStreamingFallback(reason);

      try {
        const fallbackResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: requestMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            systemPrompt,
            documentInputs,
            stream: false,
          }),
        });

        const fallbackText = await fallbackResponse.text();
        const content =
          fallbackText ||
          "No response received. Please check your API key and try again.";
        updateAssistantMessage(assistantId, content);
        trackChatResponseTime();
        logChatMessage("assistant", content);
      } catch {
        updateAssistantMessage(
          assistantId,
          "Error: Connection failed. Please retry."
        );
      } finally {
      }
    },
    [documentInputs, logChatMessage, systemPrompt, updateAssistantMessage]
  );

  const sendUserMessage = useCallback(
    async (text: string, images?: string[]) => {
      if ((!text.trim() && !(images?.length)) || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim() || (images?.length ? "Analyze the attached image(s)." : ""),
        images: images?.length ? images : undefined,
      };

      const requestMessages = [...messages, userMessage];
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setPendingImages([]);
      setIsLoading(true);

      const responseStartTime = performance.now();
      let hasTrackedResponseTime = false;
      const trackChatResponseTime = () => {
        if (hasTrackedResponseTime || !stepName) return;
        hasTrackedResponseTime = true;
        spikelog.trackChatResponseTime(
          stepName,
          Math.max(0, Math.round(performance.now() - responseStartTime))
        );
      };

      if (stepName) {
        analytics.trackChatMessage(stepName);
        spikelog.trackChatMessage(stepName);
      }

      logChatMessage("user", userMessage.content);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: requestMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
              images: msg.images,
            })),
            systemPrompt,
            documentInputs,
            aiProvider,
            aiModel,
          }),
        });

        if (!response.ok) throw new Error("Failed to get response");
        const responseClone = response.clone();
        const assistantMessageId = (Date.now() + 1).toString();

        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: "assistant",
            content: "",
          },
        ]);

        if (!response.body) {
          const fallbackText = await responseClone.text();
          if (fallbackText) {
            updateAssistantMessage(assistantMessageId, fallbackText);
            trackChatResponseTime();
            logChatMessage("assistant", fallbackText);
          } else {
            await runNonStreamingFallback(
              assistantMessageId,
              requestMessages,
              "no_response_body",
              trackChatResponseTime
            );
          }
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = "";
        let chunkCount = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (value) {
            const chunk = decoder.decode(value, { stream: !done });
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
              const fallbackText = await responseClone.text().catch(() => "");
              if (fallbackText) {
                updateAssistantMessage(assistantMessageId, fallbackText);
                trackChatResponseTime();
                logChatMessage("assistant", fallbackText);
              } else {
                await runNonStreamingFallback(
                  assistantMessageId,
                  requestMessages,
                  "empty_stream",
                  trackChatResponseTime
                );
              }
            } else {
              trackChatResponseTime();
              logChatMessage("assistant", accumulatedText);
            }

            // Batched options modal: only attempt after the assistant has fully finished streaming.
            try {
              const assistantText = accumulatedText;
              const questions = extractQuestionLines(assistantText);
              if (
                questions.length > 0 &&
                !dismissedAssistantIdsRef.current.has(assistantMessageId)
              ) {
                optionsAbortRef.current?.abort();
                const controller = new AbortController();
                optionsAbortRef.current = controller;

                const conversationSummary = summarizeConversation([
                  ...requestMessages,
                  { id: assistantMessageId, role: "assistant", content: assistantText },
                ]);

                const optionResults = await Promise.all(
                  questions.map(async (questionText) => {
                    const res = await fetch("/api/generate-options", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ questionText, conversationSummary }),
                      signal: controller.signal,
                    });
                    if (!res.ok) {
                      throw new Error("Failed to generate options");
                    }
                    const text = await res.text();
                    return questionOptionsSchema.parse(JSON.parse(text));
                  })
                );

                if (controller.signal.aborted) break;

                const items: OptionsModalItem[] = optionResults.map(
                  (result, idx) => ({
                    question: questions[idx] ?? `Question ${idx + 1}?`,
                    options: result.options,
                    recommendedIndex: result.recommendedIndex,
                    confidence: result.confidence,
                  })
                );

                setOptionsModalState({
                  assistantMessageId,
                  questions,
                  optionsByQuestion: optionResults.map((r) => r.options),
                  items,
                });
              }
            } catch {
              // Ignore failures; user can type manually.
            }

            break;
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "Error: Connection failed. Please retry.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      documentInputs,
      isLoading,
      logChatMessage,
      messages,
      runNonStreamingFallback,
      stepName,
      systemPrompt,
      updateAssistantMessage,
    ]
  );

  return (
    <div
      className={`flex flex-col h-full bg-zinc-950 ${isDragOver ? "ring-2 ring-accent ring-inset" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 z-20 bg-zinc-950/80 flex items-center justify-center pointer-events-none">
          <div className="border-2 border-dashed border-accent p-8 text-accent font-mono text-sm">Drop image here</div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

      <OptionsModal
        open={!!optionsModalState}
        title="Answer these questions"
        items={optionsModalState?.items ?? []}
        onClose={() => {
          if (optionsModalState) {
            dismissedAssistantIdsRef.current.add(optionsModalState.assistantMessageId);
          }
          setOptionsModalState(null);
          textareaRef.current?.focus();
        }}
        onSubmit={(selectedIndices, otherTexts) => {
          if (!optionsModalState) return;

          const messageText = formatSelectionsAsMessage({
            questions: optionsModalState.questions,
            optionsByQuestion: optionsModalState.optionsByQuestion,
            selectedIndices,
            otherTexts,
          });

          dismissedAssistantIdsRef.current.add(optionsModalState.assistantMessageId);
          setOptionsModalState(null);
          if (!messageText) {
            textareaRef.current?.focus();
            return;
          }
          void sendUserMessage(messageText);
        }}
      />

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 flex flex-col gap-6"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col max-w-[90%] ${
              message.role === "user"
                ? "self-end items-end"
                : "self-start items-start"
            }`}
          >
            <div
              className={`text-2xs font-mono uppercase tracking-wider mb-1 ${
                message.role === "user" ? "text-accent" : "text-[#a1a1aa]"
              }`}
            >
              {message.role === "user" ? "You" : "Research Assistant"}
            </div>

            <div
              className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap w-full ${
                message.role === "user"
                  ? "bg-accent-glow border border-accent/30 text-[#e4e4e7]"
                  : "bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa]"
              }`}
            >
              {message.images && message.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {message.images.map((img, i) => (
                    <img key={i} src={img} alt={`Attached ${i + 1}`} className="max-w-[200px] max-h-[150px] object-contain border border-zinc-600 rounded" />
                  ))}
                </div>
              )}
              {message.content}
              {message.role === "assistant" && isAssistantPending === message.id && (
                <span className="ml-2 inline-flex items-center gap-2 text-accent">
                  <svg
                    className="w-4 h-4 animate-spin-slow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && lastMessage?.role === "user" && (
          <div className="flex flex-col max-w-[90%] self-start items-start">
            <div className="text-2xs font-mono uppercase tracking-wider mb-1 text-[#a1a1aa]">
              Vibe Scaffold Assistant
            </div>
            <div className="bg-zinc-800 border-l-2 border-zinc-700 text-[#a1a1aa] px-4 py-3 text-sm leading-relaxed">
              <div className="flex items-center gap-3 text-accent">
                <svg
                  className="w-5 h-5 animate-spin-slow"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-mono text-sm">Processing request...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-zinc-950 border-t border-zinc-800">
        {messages.length <= 1 &&
          quickStartSuggestions &&
          quickStartSuggestions.length > 0 && (
            <div className="mb-4 mt-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[#a1a1aa] mb-3 flex items-center gap-2">
                <span className="text-accent">›</span>
                Quick start suggestions
              </div>
              <div className="flex flex-col gap-2">
                {quickStartSuggestions.map((text, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setInput(text)}
                    className="text-left px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm text-[#a1a1aa] hover:text-[#e4e4e7] transition-all group"
                  >
                    <span className="font-mono text-zinc-700 group-hover:text-accent mr-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

        {pendingImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {pendingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt={`Pending ${i + 1}`} className="w-16 h-16 object-cover border border-zinc-700 rounded" />
                <button onClick={() => setPendingImages((prev) => prev.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const imgs = pendingImages.length > 0 ? [...pendingImages] : undefined;
            void sendUserMessage(input, imgs);
          }}
          className="relative flex gap-3 bg-zinc-900 border border-zinc-700 pl-4 pr-1 py-1 focus-within:border-zinc-500 focus-within:shadow-[0_0_0_3px_rgba(255,255,255,0.08)] transition-all duration-200 min-h-[48px]"
        >
          <div className="flex items-center">
            <span className="text-accent font-mono text-sm select-none">$</span>
          </div>
          <div className="flex-1 flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const imgs = pendingImages.length > 0 ? [...pendingImages] : undefined;
                  void sendUserMessage(input, imgs);
                }
              }}
              onPaste={handlePaste}
              placeholder={placeholder || "Describe your idea..."}
              className="w-full bg-transparent text-sm font-mono text-white focus:outline-none resize-none placeholder:text-[#a1a1aa] leading-5 overflow-y-auto py-3"
              rows={1}
              disabled={isLoading}
              style={{ maxHeight: "200px" }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-accent transition-colors disabled:opacity-50" title="Upload image (or paste/drag-drop)">
              <ImagePlus className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && pendingImages.length === 0)}
              className="w-10 h-10 bg-accent hover:bg-accent-light disabled:bg-zinc-800 flex items-center justify-center transition-all duration-200 flex-shrink-0 active:scale-[0.95]"
            >
              <ArrowRight className="w-4 h-4 text-zinc-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
