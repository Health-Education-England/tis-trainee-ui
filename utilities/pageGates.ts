import type { FormData } from "../components/forms/form-builder/FormBuilder";
import { LtftObjNew } from "../models/LtftTypes";
import {
  ltftLegacyStartDateGateCancelBtn,
  ltftLegacyStartDateGateLabel,
  ltftLegacyStartDateGateProceedBtn,
  ltftLegacyStartDateGateSkipBtn,
  ltftLegacyStartDateGateSkipHint,
  ltftLegacyStartDateGateText
} from "./Constants";
import { clearStartDateSection, hasLegacyStartDateData } from "./ltftUtilities";

// Note: this registry lives here rather than in FormBuilderUtilities because ltftUtilities already imports from FormBuilderUtilities, so a form-specific import in that direction would create a circular dependency.

export type PageGateName = "ltftLegacyStartDate";

export type PageGate = {
  // Note: when true, the trainee is warned before the page is allowed to become the current page (see FormBuilder goToPage). Holding currentPage is enough to stop the page's fields being applied, and so stops clearHiddenFieldValues wiping values that are no longer visible under the reworked page.
  shouldGate: (formData: FormData) => boolean;
  onProceed: (formData: FormData) => FormData;
  warningLabel: string;
  warningText: string;
  proceedBtnText: string;
  skipBtnText: string;
  skipHint: string;
  cancelBtnText: string;
};

export const pageGates: Record<PageGateName, PageGate> = {
  ltftLegacyStartDate: {
    shouldGate: formData => hasLegacyStartDateData(formData as LtftObjNew),
    onProceed: formData => clearStartDateSection(formData as LtftObjNew),
    warningLabel: ltftLegacyStartDateGateLabel,
    warningText: ltftLegacyStartDateGateText,
    proceedBtnText: ltftLegacyStartDateGateProceedBtn,
    skipBtnText: ltftLegacyStartDateGateSkipBtn,
    skipHint: ltftLegacyStartDateGateSkipHint,
    cancelBtnText: ltftLegacyStartDateGateCancelBtn
  }
};

export function getPageGate(gateName?: PageGateName): PageGate | undefined {
  return gateName ? pageGates[gateName] : undefined;
}
