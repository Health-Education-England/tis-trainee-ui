import { useEffect, useRef, useState } from "react";
import {
  CctCalculation,
  CctChange,
  CctProgrammeDetails
} from "../../../models/CctTypes";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  saveCctCalculation,
  updatedCctSaveStatus
} from "../../../redux/slices/cctSlice";
import {
  cctChangeIndexFromPointer,
  fromCctChangeDtos,
  sortCctChanges,
  toCctChangeDtos
} from "../../../utilities/CctUtilities";
import { isDeepEqual } from "../../../utilities/ObjectUtilities";
import { useCctCalculation } from "../../../utilities/hooks/useCctCalculation";
import { useCctSpecialties } from "../../../utilities/hooks/useCctSpecialties";
import history from "../../navigation/history";
import { LeavePageGuard } from "../../common/LeavePageGuard";
import { CctChangesSection } from "./CctChangesSection";
import { CctFormShell } from "./CctFormShell";
import {
  CctProgrammeDetailsInset,
  CctProgrammeDetailsSection
} from "./CctProgrammeDetailsSection";
import { CctSummary } from "./CctSummary";

const CCT_PAGE_NAMES = ["Programme details", "Changes", "Summary"];

type CctFormProps = {
  savedCalculation?: CctCalculation;
};

export function CctForm({ savedCalculation }: Readonly<CctFormProps>) {
  const [currentPage, setCurrentPage] = useState(
    savedCalculation ? CCT_PAGE_NAMES.length - 1 : 0
  );
  const [programmeDetails, setProgrammeDetails] =
    useState<CctProgrammeDetails | null>(
      savedCalculation?.programmeDetails ?? null
    );
  const [isEditingProgrammeDetails, setIsEditingProgrammeDetails] = useState(
    !savedCalculation
  );
  const [changes, setChanges] = useState<CctChange[]>(() =>
    fromCctChangeDtos(savedCalculation?.changes ?? [])
  );
  const [isChangeFormOpen, setIsChangeFormOpen] = useState(false);
  const [isSubFormDirty, setIsSubFormDirty] = useState(false);
  const openedRef = useRef({ programmeDetails, changes });

  const { result, calculatedChanges, errors, status, isRetrying, retry } =
    useCctCalculation(programmeDetails, changes);
  const {
    specialties,
    status: specialtiesStatus,
    isRetrying: isRetryingSpecialties,
    retry: retrySpecialties
  } = useCctSpecialties();
  const dispatch = useAppDispatch();
  const saveStatus = useAppSelector(state => state.cct.saveStatus);
  const isMountedRef = useRef(false);

  useEffect(() => {
    dispatch(updatedCctSaveStatus("idle"));
  }, [dispatch]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const cctDate = status === "succeeded" ? result?.cctDate ?? null : null;
  const invalidChanges = changes.flatMap((change, index) =>
    errors
      .filter(({ pointer }) => cctChangeIndexFromPointer(pointer) === index)
      .map(({ pointer, detail }) => ({ change, pointer, message: detail }))
  );
  const isProgrammeDetailsDone = !isEditingProgrammeDetails && result !== null;
  const isChangesDone =
    !isChangeFormOpen && status === "succeeded" && invalidChanges.length === 0;
  const hasUnsavedChanges =
    isSubFormDirty ||
    !isDeepEqual(programmeDetails, openedRef.current.programmeDetails) ||
    !isDeepEqual(
      toCctChangeDtos(changes),
      toCctChangeDtos(openedRef.current.changes)
    );

  const goToPage = (targetPage: number) => {
    if (targetPage < 0 || targetPage > CCT_PAGE_NAMES.length - 1) return;
    setCurrentPage(targetPage);
    setIsChangeFormOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleSave = async (name: string) => {
    if (!programmeDetails) return;
    const action = await dispatch(
      saveCctCalculation({
        id: savedCalculation?.id,
        name,
        programmeDetails,
        changes: toCctChangeDtos(changes)
      })
    );
    if (saveCctCalculation.fulfilled.match(action) && isMountedRef.current) {
      history.replace("/cct", {
        savedCalculation: { id: action.payload.id, name: action.payload.name }
      });
    }
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
          specialties={specialties}
          specialtiesStatus={specialtiesStatus}
          isRetryingSpecialties={isRetryingSpecialties}
          onRetrySpecialties={retrySpecialties}
          isEditing={isEditingProgrammeDetails}
          result={result}
          calculationStatus={status}
          isRetryingCalculation={isRetrying}
          onRetryCalculation={retry}
          onChange={setProgrammeDetails}
          onEditingChange={setIsEditingProgrammeDetails}
          onDirtyChange={setIsSubFormDirty}
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
        </>
      )}
      {currentPage === 2 && (
        <CctSummary
          programmeDetails={programmeDetails}
          specialties={specialties}
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
          calculationStatus={status}
          isRetrying={isRetrying}
          onRetry={retry}
          hasInvalidChanges={invalidChanges.length > 0}
          onGoToChanges={() => goToPage(1)}
          savedCalculationId={savedCalculation?.id}
          savedName={savedCalculation?.name ?? ""}
          saveStatus={saveStatus}
          onSave={handleSave}
          onDirtyChange={setIsSubFormDirty}
        />
      )}
      <LeavePageGuard hasUnsavedChanges={hasUnsavedChanges} />
    </CctFormShell>
  );
}
