import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WizardState, StepData, Message, FlowType, AIProvider } from "./types";
import { analytics } from "./utils/analytics";
import { useEffect, useState } from "react";

const initialStepData: StepData = {
  chatHistory: [],
  generatedDoc: null,
  approved: false,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set) => ({
      currentStep: 1,
      isGenerating: false,
      resetCounter: 0,
      selectedFlow: "product-vision" as FlowType,
      aiProvider: "openai" as AIProvider,
      aiModel: null as string | null,
      steps: {
        // Product Vision (original)
        onePager: { ...initialStepData },
        devSpec: { ...initialStepData },
        checklist: { ...initialStepData },
        agentsMd: { ...initialStepData },
        // Pre-Sales Research (new)
        firstContact: { ...initialStepData },
        claimVerification: { ...initialStepData },
        strategicAnalysis: { ...initialStepData },
        engagementModel: { ...initialStepData },
      },
      setCurrentStep: (step: number) => set({ currentStep: step }),
      setIsGenerating: (isGenerating: boolean) => set({ isGenerating }),
      setSelectedFlow: (flow: FlowType) => set({ selectedFlow: flow }),
      setAIProvider: (provider: AIProvider) => set({ aiProvider: provider }),
      setAIModel: (model: string | null) => set({ aiModel: model }),
      updateStepChat: (stepKey, messages) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [stepKey]: {
              ...state.steps[stepKey],
              chatHistory: messages,
            },
          },
        })),
      updateStepDoc: (stepKey, doc) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [stepKey]: {
              ...state.steps[stepKey],
              generatedDoc: doc,
            },
          },
        })),
      approveStep: (stepKey) =>
        set((state) => ({
          steps: {
            ...state.steps,
            [stepKey]: {
              ...state.steps[stepKey],
              approved: true,
            },
          },
        })),
      resetWizard: () => {
        analytics.trackWizardReset();
        return set((state) => ({
          currentStep: 1,
          isGenerating: false,
          resetCounter: state.resetCounter + 1,
          // Keep selectedFlow — only reset the steps for the current flow
          steps: {
            // Product Vision
            onePager: { ...initialStepData },
            devSpec: { ...initialStepData },
            checklist: { ...initialStepData },
            agentsMd: { ...initialStepData },
            // Pre-Sales Research
            firstContact: { ...initialStepData },
            claimVerification: { ...initialStepData },
            strategicAnalysis: { ...initialStepData },
            engagementModel: { ...initialStepData },
          },
        }));
      },
      loadSampleDocs: () =>
        set({
          currentStep: 1,
          isGenerating: false,
          steps: {
            onePager: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            devSpec: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            checklist: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            agentsMd: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            firstContact: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            claimVerification: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            strategicAnalysis: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
            engagementModel: {
              chatHistory: [],
              generatedDoc: null,
              approved: false,
            },
          },
        }),
    }),
    {
      name: "wizard-storage",
      partialize: (state) => ({
        currentStep: state.currentStep,
        resetCounter: state.resetCounter,
        selectedFlow: state.selectedFlow,
        aiProvider: state.aiProvider,
        aiModel: state.aiModel,
        steps: state.steps,
        // Don't persist isGenerating (it's transient state)
      }),
    }
  )
);

// Hook to check if store has hydrated from localStorage
export const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useWizardStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    // Check if already hydrated
    if (useWizardStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hasHydrated;
};
