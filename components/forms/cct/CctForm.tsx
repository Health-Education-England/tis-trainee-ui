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

const CCT_PAGE_NAMES = ["Programme details", "Changes", "Summary"];

export function CctForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [programmeDetails, setProgrammeDetails] =
    useState<CctProgrammeDetails | null>(null);
  const [changes, setChanges] = useState<CctChange[]>([]);

  const { result, status } = useCctCalculation(programmeDetails, changes);

  // Note: the projection is just a function of the changes - no persistence (storing it would only let the them disagree).
  const projection = deriveCctProjection(programmeDetails, changes);

  const goToPage = (targetPage: number) => {
    if (targetPage < 0 || targetPage > CCT_PAGE_NAMES.length - 1) return;
    setCurrentPage(targetPage);
    window.scrollTo({ top: 0 });
  };

  return (
    <CctFormShell
      pageNames={CCT_PAGE_NAMES}
      currentPage={currentPage}
      onNavigate={goToPage}
    >
      {currentPage === 0 && (
        <CctProgrammeDetailsSection
          programmeDetails={programmeDetails}
          result={result}
          onChange={setProgrammeDetails}
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
            calculationStatus={status}
            onChange={next => setChanges(sortCctChanges(next))}
          />
        </>
      )}
      {currentPage === 2 && (
        <CctSummary
          programmeDetails={programmeDetails}
          changes={changes}
          projection={projection}
          result={result}
        />
      )}
    </CctFormShell>
  );
}
