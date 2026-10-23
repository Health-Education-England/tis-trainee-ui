import { useState } from "react";
import { CctChange, CctProgrammeDetails } from "../../../models/CctTypes";
import {
  deriveCctProjection,
  sortCctChanges
} from "../../../utilities/CctUtilities";
import { useCctCalculation } from "../../../utilities/hooks/useCctCalculation";
import { CctChangesSection } from "./CctChangesSection";
import { CctFormShell } from "./CctFormShell";
import {
  CctProgrammeDetailsInset,
  CctProgrammeDetailsSection
} from "./CctProgrammeDetailsSection";
import { CctSummary } from "./CctSummary";
import { findInvalidCctChangeMessage } from "./cctValidationSchema";

const CCT_PAGE_NAMES = ["Programme details", "Changes", "Summary"];

export function CctForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [programmeDetails, setProgrammeDetails] =
    useState<CctProgrammeDetails | null>(null);
  const [isEditingProgrammeDetails, setIsEditingProgrammeDetails] =
    useState(true);
  const [changes, setChanges] = useState<CctChange[]>([]);
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);

  const { result, status, isRetrying, retry } = useCctCalculation(
    programmeDetails,
    changes
  );

  // Note: the projection is just a function of the changes - no persistence (storing it would only let the them disagree).
  const projection = programmeDetails
    ? deriveCctProjection(programmeDetails, changes)
    : null;
  const cctDate = status === "succeeded" ? result?.cctDate ?? null : null;
  const invalidChanges = changes.flatMap(change => {
    const message = findInvalidCctChangeMessage(
      change,
      changes,
      programmeDetails,
      cctDate
    );
    return message ? [{ change, message }] : [];
  });
  const isProgrammeDetailsDone = !isEditingProgrammeDetails && result !== null;
  const isChangesDone =
    !isChangeFormOpen && status === "succeeded" && invalidChanges.length === 0;

  const goToPage = (targetPage: number) => {
    if (targetPage < 0 || targetPage > CCT_PAGE_NAMES.length - 1) return;
    setCurrentPage(targetPage);
    setIsChangeFormOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <CctFormShell
      pageNames={CCT_PAGE_NAMES}
      currentPage={currentPage}
      canGoNext={currentPage === 0 ? isProgrammeDetailsDone : isChangesDone}
      onNavigate={goToPage}
    >
      {currentPage === 0 && (
        <CctProgrammeDetailsSection
          programmeDetails={programmeDetails}
          isEditing={isEditingProgrammeDetails}
          result={result}
          calculationStatus={status}
          isRetrying={isRetrying}
          onRetry={retry}
          onChange={setProgrammeDetails}
          onEditingChange={setIsEditingProgrammeDetails}
        />
      )}
      {currentPage === 1 && (
        <>
          <CctProgrammeDetailsInset
            programmeDetails={programmeDetails}
            result={result}
            onEdit={() => goToPage(0)}
          />
          <CctChangesSection
            programmeDetails={programmeDetails}
            changes={changes}
            projection={projection}
            result={result}
            cctDate={cctDate}
            invalidChanges={invalidChanges}
            calculationStatus={status}
            isRetrying={isRetrying}
            isFormOpen={isChangeFormOpen}
            onRetry={retry}
            onChange={next => setChanges(sortCctChanges(next))}
            onFormOpenChange={setIsChangeFormOpen}
          />
        </>
      )}
      {currentPage === 2 && (
        <CctSummary
          programmeDetails={programmeDetails}
          changes={changes}
          projection={projection}
          result={result}
          calculationStatus={status}
          isRetrying={isRetrying}
          onRetry={retry}
        />
      )}
    </CctFormShell>
  );
}
