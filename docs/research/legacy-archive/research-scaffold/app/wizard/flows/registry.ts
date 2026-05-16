import { FlowConfig, FlowType } from "@/app/types";

// Product Vision flow (original vibescaffold)
import { step1Config } from "../steps/step1-config";
import { step2Config } from "../steps/step2-config";
import { step3Config } from "../steps/step3-config";
import { step4Config } from "../steps/step4-config";

// Pre-Sales Research flow
import { researchStep1Config } from "../steps/research/step1-first-contact";
import { researchStep2Config } from "../steps/research/step2-claim-verification";
import { researchStep3Config } from "../steps/research/step3-strategic-analysis";
import { researchStep4Config } from "../steps/research/step4-engagement-model";

export const flowRegistry: Record<FlowType, FlowConfig> = {
  "product-vision": {
    id: "product-vision",
    name: "Product Vision",
    description: "Turn your app idea into a complete technical spec with step-by-step build prompts and AI agent guardrails.",
    icon: "terminal",
    stepConfigs: [step1Config, step2Config, step3Config, step4Config],
    stepKeyMap: ["onePager", "devSpec", "checklist", "agentsMd"] as const,
    stepFileNames: ["ONE_PAGER", "DEV_SPEC", "PROMPT_PLAN", "AGENTS_MD"],
    completionCommand: "Read AGENTS.md first, then ONE_PAGER.md, DEV_SPEC.md, and PROMPT_PLAN.md. Confirm when finished loading them.",
  },
  "presales-research": {
    id: "presales-research",
    name: "Pre-Sales Research",
    description: "Analyze a client's technical architecture, verify claims, build strategic questions, and assemble an engagement model.",
    icon: "search",
    stepConfigs: [researchStep1Config, researchStep2Config, researchStep3Config, researchStep4Config],
    stepKeyMap: ["firstContact", "claimVerification", "strategicAnalysis", "engagementModel"] as const,
    stepFileNames: ["FIRST_CONTACT_ANALYSIS", "CLAIM_VERIFICATION", "STRATEGIC_ANALYSIS", "ENGAGEMENT_MODEL"],
    completionCommand: "Read ENGAGEMENT_MODEL.md first, then FIRST_CONTACT_ANALYSIS.md, CLAIM_VERIFICATION.md, and STRATEGIC_ANALYSIS.md. These form a complete pre-sales research package.",
  },
};

export function getFlowConfig(flowType: FlowType): FlowConfig {
  return flowRegistry[flowType];
}
