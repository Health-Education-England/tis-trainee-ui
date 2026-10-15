import { useState } from "react";
import {
  CctChange,
  CctProgrammeDetails,
  CctResult
} from "../../../models/CctTypes";
import { deriveCctProjection } from "../../../utilities/CctUtilities";
import { CctChangesSection } from "./CctChangesSection";
import { CctFormShell } from "./CctFormShell";
import { CctProgrammeDetailsSection } from "./CctProgrammeDetailsSection";
import { CctSummary } from "./CctSummary";

const CCT_PAGE_NAMES = ["Programme details", "Changes", "Summary"];

export function CctForm() {
  const [currentPage, setCurrentPage] = useState(0);
  const [programmeDetails, setProgrammeDetails] =
    useState<CctProgrammeDetails | null>(null);
  const [changes, setChanges] = useState<CctChange[]>([]);
  // Note: the calculation is owned by the backend, so nothing sets this until the calculate endpoint is wired up.
  const [result] = useState<CctResult | null>(null);

  // Note: never stored - the projection is always a function of the changes, so holding it would only let the two disagree.
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
          onChange={setProgrammeDetails}
        />
      )}
      {currentPage === 1 && (
        <CctChangesSection
          programmeDetails={programmeDetails}
          changes={changes}
          projection={projection}
          onChange={setChanges}
        />
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
