export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  images?: string[]; // base64 data URLs for uploaded images
}

export interface StepData {
  chatHistory: Message[];
  generatedDoc: string | null;
  approved: boolean;
}

// --- AI Provider ---

export type AIProvider = "openai" | "openrouter";

// --- Flow Type System ---

export type FlowType = "product-vision" | "presales-research";

// Product Vision step keys (original vibescaffold)
export type ProductVisionStepKey = "onePager" | "devSpec" | "checklist" | "agentsMd";

// Pre-Sales Research step keys
export type ResearchStepKey = "firstContact" | "claimVerification" | "strategicAnalysis" | "engagementModel";

// Union of all step keys
export type StepKey = ProductVisionStepKey | ResearchStepKey;

export interface FlowConfig {
  id: FlowType;
  name: string;
  description: string;
  icon: string;
  stepConfigs: StepConfig[];
  stepKeyMap: readonly string[];
  stepFileNames: string[];
  completionCommand?: string;
}

// --- Wizard State ---

export interface WizardState {
  currentStep: number;
  isGenerating: boolean;
  resetCounter: number;
  selectedFlow: FlowType;
  aiProvider: AIProvider;
  aiModel: string | null;
  steps: {
    // Product Vision (original)
    onePager: StepData;
    devSpec: StepData;
    checklist: StepData;
    agentsMd: StepData;
    // Pre-Sales Research (new)
    firstContact: StepData;
    claimVerification: StepData;
    strategicAnalysis: StepData;
    engagementModel: StepData;
  };
  setCurrentStep: (step: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setSelectedFlow: (flow: FlowType) => void;
  setAIProvider: (provider: AIProvider) => void;
  setAIModel: (model: string | null) => void;
  updateStepChat: (stepKey: keyof WizardState["steps"], messages: Message[]) => void;
  updateStepDoc: (stepKey: keyof WizardState["steps"], doc: string) => void;
  approveStep: (stepKey: keyof WizardState["steps"]) => void;
  resetWizard: () => void;
  loadSampleDocs: () => void;
}

export interface StepConfig {
  stepNumber: number;
  stepName: string;
  userInstructions: string;
  systemPrompt: string;
  generateButtonText: string;
  approveButtonText: string;
  documentInputs: string[];
  initialGreeting?: string;
  generationPrompt?: string;
  inputPlaceholder?: string;
  quickStartSuggestions?: string[];
  enableMultipleChoice?: boolean;
}
