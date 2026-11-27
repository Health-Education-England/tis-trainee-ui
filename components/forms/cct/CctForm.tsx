import { useRef, useState } from "react";
import { Card } from "nhsuk-react-components";
import { CctChange, CctProgrammeDetails } from "../../../models/CctTypes";
import {
  cctChangeIndexFromPointer,
  cctProgrammeDetailsErrorTarget,
  sortCctChanges,
  toCctChangeDtos
} from "../../../utilities/CctUtilities";
import { CCT_PAGE_NAMES, CCT_PAGES } from "../../../utilities/CctConstants";
import { isDeepEqual } from "../../../utilities/ObjectUtilities";
import { useCctCalculation } from "../../../utilities/hooks/useCctCalculation";
import { useCctSpecialties } from "../../../utilities/hooks/useCctSpecialties";
import history from "../../navigation/history";
import { LeavePageGuard } from "../../common/LeavePageGuard";
import Loading from "../../common/Loading";
import { CctChangesSection } from "./CctChangesSection";
import { CctFormShell } from "./CctFormShell";
import {
  CctGradeProgressionSection,
  CctGradeYearsTable
} from "./CctGradeProgressionSection";
import {
  cctAdjustmentErrorPage,
  CctInvalidAdjustmentsSummary,
  CctInvalidChangesNotice,
  CctProgrammeDetailsInset,
  CctProgrammeDetailsSection
} from "./CctProgrammeDetailsSection";
import { CctRequestError } from "./CctRequestError";
import { CctStartOverButton } from "./CctStartOverButton";
import { CctSummary } from "./CctSummary";
import { CctTrainingTimeSection } from "./CctTrainingTimeSection";

export function CctForm() {
  const [currentPage, setCurrentPage] = useState<number>(
    CCT_PAGES.programmeDetails
  );
  const [programmeDetails, setProgrammeDetails] =
    useState<CctProgrammeDetails | null>(null);
  const [isEditingProgrammeDetails, setIsEditingProgrammeDetails] =
    useState(true);
  const [changes, setChanges] = useState<CctChange[]>([]);
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);
  const [isAdjustmentFormOpen, setIsAdjustmentFormOpen] = useState(false);
  const [isSubFormDirty, setIsSubFormDirty] = useState(false);
  const [hasReachedSummary, setHasReachedSummary] = useState(false);
  const openedRef = useRef({ programmeDetails, changes });

  const { result, calculatedChanges, errors, status, isRetrying, retry } =
    useCctCalculation(programmeDetails, changes);
  const {
    specialties,
    status: specialtiesStatus,
    isRetrying: isRetryingSpecialties,
    retry: retrySpecialties
  } = useCctSpecialties();

  const cctDate = status === "succeeded" ? result?.cctDate ?? null : null;
  const invalidChanges = changes.flatMap((change, index) =>
    errors
      .filter(({ pointer }) => cctChangeIndexFromPointer(pointer) === index)
      .map(({ pointer, detail }) => ({ change, pointer, message: detail }))
  );
  const invalidAdjustments = errors.flatMap(({ pointer, detail }) => {
    const target = cctProgrammeDetailsErrorTarget(pointer);
    return target ? [{ ...target, pointer, message: detail }] : [];
  });
  const invalidAdjustmentsOn = (page: number) =>
    invalidAdjustments.filter(
      adjustment => cctAdjustmentErrorPage(adjustment) === page
    );
  const programmeDetailsErrors = invalidAdjustmentsOn(
    CCT_PAGES.programmeDetails
  );
  const trainingTimeErrors = invalidAdjustmentsOn(CCT_PAGES.trainingTime);
  const gradeProgressionErrors = invalidAdjustmentsOn(
    CCT_PAGES.gradeProgression
  );
  const isPageDone: Record<number, boolean> = {
    [CCT_PAGES.programmeDetails]:
      !isEditingProgrammeDetails &&
      result !== null &&
      programmeDetailsErrors.length === 0,
    [CCT_PAGES.trainingTime]:
      !isAdjustmentFormOpen &&
      result !== null &&
      trainingTimeErrors.length === 0,
    [CCT_PAGES.gradeProgression]:
      !isAdjustmentFormOpen &&
      result !== null &&
      gradeProgressionErrors.length === 0,
    [CCT_PAGES.changes]:
      !isChangeFormOpen && status === "succeeded" && invalidChanges.length === 0
  };
  const isSetupPage = currentPage < CCT_PAGES.summary;
  const isAdjustmentsPage =
    currentPage === CCT_PAGES.trainingTime ||
    currentPage === CCT_PAGES.gradeProgression;
  const hasUnsavedChanges =
    isSubFormDirty ||
    !isDeepEqual(programmeDetails, openedRef.current.programmeDetails) ||
    !isDeepEqual(
      toCctChangeDtos(changes),
      toCctChangeDtos(openedRef.current.changes)
    );

  const goToPage = (targetPage: number) => {
    if (targetPage < 0 || targetPage > CCT_PAGES.summary) return;
    setCurrentPage(targetPage);
    if (targetPage === CCT_PAGES.summary) setHasReachedSummary(true);
    setIsChangeFormOpen(false);
    setIsAdjustmentFormOpen(false);
    window.scrollTo({ top: 0 });
  };

  return (
    <CctFormShell
      pageNames={CCT_PAGE_NAMES}
      currentPage={currentPage}
      canGoNext={isPageDone[currentPage] ?? false}
      canReturnToSummary={hasReachedSummary}
      onNavigate={goToPage}
      onBackToHome={() => history.push("/cct")}
      startOverButton={
        <CctStartOverButton hasUnsavedChanges={hasUnsavedChanges} />
      }
    >
      {currentPage === CCT_PAGES.programmeDetails && (
        <CctProgrammeDetailsSection
          programmeDetails={programmeDetails}
          specialties={specialties}
          specialtiesStatus={specialtiesStatus}
          isRetryingSpecialties={isRetryingSpecialties}
          onRetrySpecialties={retrySpecialties}
          isEditing={isEditingProgrammeDetails}
          result={result}
          calculationStatus={status}
          isRetryingCalculation={isRetrying}
          onRetryCalculation={retry}
          hasInvalidChanges={invalidChanges.length > 0}
          invalidAdjustments={programmeDetailsErrors}
          onChange={setProgrammeDetails}
          onEditingChange={setIsEditingProgrammeDetails}
          onDirtyChange={setIsSubFormDirty}
        />
      )}
      {isAdjustmentsPage && (
        <>
          {status === "failed" && (
            <CctRequestError
              isRetrying={isRetrying}
              onRetry={retry}
              message="We could not calculate your programme end date."
            />
          )}
          {invalidChanges.length > 0 && <CctInvalidChangesNotice />}
        </>
      )}
      {isSetupPage && currentPage !== CCT_PAGES.programmeDetails && (
        <CctProgrammeDetailsInset
          programmeDetails={programmeDetails}
          result={result}
          onEdit={() => goToPage(CCT_PAGES.programmeDetails)}
        />
      )}
      {isSetupPage &&
        !isEditingProgrammeDetails &&
        programmeDetails &&
        result &&
        result.gradeProgression.length > 0 && (
          <Card feature data-cy="cct-grade-progression">
            <Card.Heading>Grade progression</Card.Heading>
            <CctGradeYearsTable
              gradeYears={result.gradeProgression}
              programmeDetails={programmeDetails}
            />
          </Card>
        )}
      {currentPage === CCT_PAGES.trainingTime && programmeDetails && (
        <>
          <CctTrainingTimeSection
            programmeDetails={programmeDetails}
            result={result}
            calculationStatus={status}
            invalidAdjustments={trainingTimeErrors}
            isFormOpen={isAdjustmentFormOpen}
            onChange={setProgrammeDetails}
            onFormOpenChange={setIsAdjustmentFormOpen}
            onDirtyChange={setIsSubFormDirty}
          />
          {trainingTimeErrors.length > 0 && (
            <CctInvalidAdjustmentsSummary
              programmeDetails={programmeDetails}
              invalidAdjustments={trainingTimeErrors}
            />
          )}
        </>
      )}
      {currentPage === CCT_PAGES.gradeProgression && programmeDetails && (
        <>
          <CctGradeProgressionSection
            programmeDetails={programmeDetails}
            specialties={specialties}
            result={result}
            invalidAdjustments={gradeProgressionErrors}
            isFormOpen={isAdjustmentFormOpen}
            onChange={setProgrammeDetails}
            onFormOpenChange={setIsAdjustmentFormOpen}
            onDirtyChange={setIsSubFormDirty}
          />
          {gradeProgressionErrors.length > 0 && (
            <CctInvalidAdjustmentsSummary
              programmeDetails={programmeDetails}
              invalidAdjustments={gradeProgressionErrors}
            />
          )}
        </>
      )}
      {currentPage === CCT_PAGES.changes && (
        <CctChangesSection
          programmeDetails={programmeDetails}
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
          cctDate={cctDate}
          invalidChanges={invalidChanges}
          calculationStatus={status}
          isRetrying={isRetrying}
          isFormOpen={isChangeFormOpen}
          onRetry={retry}
          onChange={next => setChanges(sortCctChanges(next))}
          onFormOpenChange={setIsChangeFormOpen}
          onDirtyChange={setIsSubFormDirty}
        />
      )}
      {currentPage === CCT_PAGES.summary && (
        <CctSummary
          programmeDetails={programmeDetails}
          specialties={specialties}
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
          calculationStatus={status}
          isRetrying={isRetrying}
          onRetry={retry}
          invalidChanges={invalidChanges}
          programmeDetailsErrors={programmeDetailsErrors}
          trainingTimeErrors={trainingTimeErrors}
          gradeProgressionErrors={gradeProgressionErrors}
          onGoToPage={goToPage}
        />
      )}
      {status === "loading" && (
        <Loading
          delay={300}
          height={64}
          width={64}
          text="Calculating your training dates…"
        />
      )}
      <LeavePageGuard hasUnsavedChanges={hasUnsavedChanges} />
    </CctFormShell>
  );
}
