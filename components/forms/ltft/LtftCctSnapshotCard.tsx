import { ReactNode, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Button,
  Card,
  Details,
  HintText,
  InsetText,
  Radios,
  SummaryList
} from "nhsuk-react-components";
import {
  CctCalculatedChange,
  CctCalculation,
  CctChange
} from "../../../models/CctTypes";
import { LtftCctSnapshot } from "../../../models/LtftTypes";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  fetchCctCalculations,
  resetCctCalculations
} from "../../../redux/slices/cctSlice";
import { CCT_NO_CHANGES_TEXT } from "../../../utilities/CctConstants";
import {
  formatCctDate,
  formatCctMonths
} from "../../../utilities/CctUtilities";
import { useCctSpecialties } from "../../../utilities/hooks/useCctSpecialties";
import {
  buildLtftCctSnapshot,
  findAttachedCctCalculation,
  hasAttachedCctCalculationChanged
} from "../../../utilities/ltftUtilities";
import { ActionModal } from "../../common/ActionModal";
import Loading from "../../common/Loading";
import { CctChangesTable } from "../cct/CctChangesSection";
import { CctProgrammeDetailsSummary } from "../cct/CctProgrammeDetailsSection";
import { CctRequestError } from "../cct/CctRequestError";

const SAVE_HINT_TEXT =
  "Attaching, changing or removing a copy is saved with your application when you select Save & exit or Submit.";

const PREVIEW_CALCULATION_COUNT = 5;

type LtftCctSnapshotCardProps = {
  snapshot: LtftCctSnapshot | null;
  canEdit: boolean;
  onChange: (snapshot: LtftCctSnapshot | null) => void;
};

export function LtftCctSnapshotCard({
  snapshot,
  canEdit,
  onChange
}: Readonly<LtftCctSnapshotCardProps>) {
  const dispatch = useAppDispatch();
  const { calculations, listStatus } = useAppSelector(state => state.cct);
  const [isChoosing, setIsChoosing] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!canEdit) return;
    void dispatch(fetchCctCalculations());
    const reloadOnReturn = () => {
      if (document.visibilityState === "visible")
        void dispatch(fetchCctCalculations());
    };
    document.addEventListener("visibilitychange", reloadOnReturn);
    return () => {
      document.removeEventListener("visibilitychange", reloadOnReturn);
      dispatch(resetCctCalculations());
    };
  }, [canEdit, dispatch]);

  const retry = async () => {
    setIsRetrying(true);
    await dispatch(fetchCctCalculations());
    setIsRetrying(false);
  };

  const attach = (calculation: CctCalculation) => {
    onChange(buildLtftCctSnapshot(calculation));
    setIsChoosing(false);
  };

  if (!canEdit)
    return (
      <LtftCctSnapshotCardWrapper>
        {snapshot ? (
          <AttachedCctCalculation snapshot={snapshot} />
        ) : (
          <p data-cy="cctSnapshotNotAttached">No calculation attached</p>
        )}
      </LtftCctSnapshotCardWrapper>
    );

  if (snapshot && !isChoosing) {
    const isListLoaded = listStatus === "succeeded";
    const savedCalculation = isListLoaded
      ? findAttachedCctCalculation(snapshot, calculations)
      : null;
    const changedCalculation = hasAttachedCctCalculationChanged(
      snapshot,
      savedCalculation
    )
      ? savedCalculation
      : null;
    const isOnlyCopy = isListLoaded && !savedCalculation;

    return (
      <LtftCctSnapshotCardWrapper>
        <AttachedCctCalculation snapshot={snapshot} />
        {isOnlyCopy && (
          <InsetText data-cy="cctSnapshotDeletedNote">
            <p>
              This calculation is no longer in your saved CCT calculations. The
              copy attached here is kept.
            </p>
          </InsetText>
        )}
        {changedCalculation && (
          <InsetText data-cy="cctSnapshotChangedNote">
            <p>
              You&apos;ve changed this calculation since you attached it. Your
              Local Office will see the copy as it was when you attached it.
            </p>
            <Button
              type="button"
              onClick={() => attach(changedCalculation)}
              data-cy="cctSnapshotAttachLatest"
            >
              Attach the latest version
            </Button>
          </InsetText>
        )}
        <div className="nhsuk-button-group">
          <Button
            secondary
            type="button"
            onClick={() => {
              setSelectedId(snapshot.calculationId);
              setIsChoosing(true);
            }}
            data-cy="cctSnapshotChange"
          >
            Change
          </Button>
          <LtftCctSnapshotRemoveButton
            confirmText={findRemoveConfirmText(
              snapshot.calculation.name,
              isListLoaded,
              savedCalculation
            )}
            onRemove={() => onChange(null)}
          />
        </div>
        <HintText data-cy="cctSnapshotSaveHint">{SAVE_HINT_TEXT}</HintText>
      </LtftCctSnapshotCardWrapper>
    );
  }

  const selectedCalculation =
    calculations.find(calculation => calculation.id === selectedId) ?? null;

  let picker: ReactNode;
  if (listStatus === "failed" || isRetrying) {
    picker = (
      <CctRequestError
        isRetrying={isRetrying}
        onRetry={retry}
        message="We could not load your saved CCT calculations."
      />
    );
  } else if (listStatus !== "succeeded") {
    picker = <Loading />;
  } else if (calculations.length === 0) {
    picker = (
      <p data-cy="cctSnapshotNoCalculations">
        {"You have no saved CCT calculations. "}
        <a
          href="/cct"
          target="_blank"
          rel="noreferrer"
          data-cy="cctSnapshotCalculatorLink"
        >
          Open the CCT Calculator in a new tab
        </a>
        {
          " to make one. Your saved CCT calculations are reloaded when you come back to this page."
        }
      </p>
    );
  } else {
    picker = (
      <>
        <CctCalculationRadios
          calculations={calculations}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        <div className="nhsuk-button-group">
          <Button
            type="button"
            disabled={!selectedCalculation}
            onClick={() => selectedCalculation && attach(selectedCalculation)}
            data-cy="cctSnapshotAttach"
          >
            Attach calculation
          </Button>
          {isChoosing && (
            <Button
              secondary
              type="button"
              onClick={() => setIsChoosing(false)}
              data-cy="cctSnapshotCancel"
            >
              Cancel
            </Button>
          )}
        </div>
        <HintText data-cy="cctSnapshotSaveHint">{SAVE_HINT_TEXT}</HintText>
      </>
    );
  }

  return (
    <LtftCctSnapshotCardWrapper>
      <p data-cy="cctSnapshotIntro">
        {isChoosing
          ? "Choose the calculation you want to attach instead."
          : "If you have made a CCT calculation, you can attach a copy to this application so your Local Office can see how your completion date was worked out. This is optional."}
      </p>
      <p>
        Attaching shares a copy of the whole calculation with your Local Office,
        including your notes.
      </p>
      {picker}
    </LtftCctSnapshotCardWrapper>
  );
}

function LtftCctSnapshotCardWrapper({
  children
}: Readonly<{ children: ReactNode }>) {
  return (
    <Card feature>
      <Card.Heading data-cy="cctSnapshotHeading">CCT calculation</Card.Heading>
      {children}
    </Card>
  );
}

function AttachedCctCalculation({
  snapshot
}: Readonly<{ snapshot: LtftCctSnapshot }>) {
  const { calculation } = snapshot;
  const attachedOn = formatCctDate(snapshot.snapshotTakenAt);

  return (
    <>
      <SummaryList data-cy="cctSnapshotSummary">
        <SummaryList.Row>
          <SummaryList.Key>Calculation name</SummaryList.Key>
          <SummaryList.Value data-cy="cctSnapshotName">
            {calculation.name}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Indicative completion date</SummaryList.Key>
          <SummaryList.Value data-cy="cctSnapshotCctDate">
            {formatCctDate(calculation.result.cctDate)}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Attached on</SummaryList.Key>
          <SummaryList.Value data-cy="cctSnapshotTakenAt">
            {attachedOn}
          </SummaryList.Value>
        </SummaryList.Row>
      </SummaryList>
      <InsetText data-cy="cctSnapshotFixedNote">
        <p>
          {`This is a copy of your calculation as it was on ${attachedOn}. Changing or deleting your saved calculation will not change it. To share a newer version, attach it again.`}
        </p>
        <p>
          The completion date is indicative; the official CCT date is agreed at
          your next ARCP.
        </p>
      </InsetText>
      <AttachedCctCalculationDetails calculation={calculation} />
    </>
  );
}

function AttachedCctCalculationDetails({
  calculation
}: Readonly<{ calculation: CctCalculation }>) {
  const { specialties } = useCctSpecialties();
  const changes = toAttachedCctChanges(calculation.changes);

  return (
    <Details expander data-cy="cctSnapshotExpander">
      <Details.Summary data-cy="cctSnapshotExpanderSummary">
        View the calculation
      </Details.Summary>
      <Details.Text data-cy="cctSnapshotExpanderText">
        <SummaryList data-cy="cctSnapshotResult">
          <SummaryList.Row>
            <SummaryList.Key>
              Projected Completion of Training Date
            </SummaryList.Key>
            <SummaryList.Value>
              <strong>{formatCctDate(calculation.result.cctDate)}</strong>
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Total WTE completed (months)</SummaryList.Key>
            <SummaryList.Value>
              {formatCctMonths(calculation.result.totalWteMonthsCompleted)}
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Training remaining (months)</SummaryList.Key>
            <SummaryList.Value>
              {formatCctMonths(calculation.result.monthsRemaining)}
            </SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>

        <h3 className="nhsuk-heading-s">Programme details</h3>
        <CctProgrammeDetailsSummary
          programmeDetails={calculation.programmeDetails}
          specialties={specialties}
          result={calculation.result}
          calculationStatus="succeeded"
        />

        <h3 className="nhsuk-heading-s">Changes</h3>
        {calculation.changes.length === 0 ? (
          <p data-cy="cctSnapshotNoChanges">
            <em>{CCT_NO_CHANGES_TEXT}</em>
          </p>
        ) : (
          <CctChangesTable
            changes={changes}
            calculatedChanges={calculation.changes}
            result={calculation.result}
          />
        )}
      </Details.Text>
    </Details>
  );
}

type LtftCctSnapshotRemoveButtonProps = {
  confirmText: string | null;
  onRemove: () => void;
};

function LtftCctSnapshotRemoveButton({
  confirmText,
  onRemove
}: Readonly<LtftCctSnapshotRemoveButtonProps>) {
  const [confirmingText, setConfirmingText] = useState<string | null>(null);
  const removeButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={removeButtonRef}
        warning
        type="button"
        onClick={() =>
          confirmText ? setConfirmingText(confirmText) : onRemove()
        }
        data-cy="cctSnapshotRemove"
      >
        Remove
      </Button>
      {confirmingText && (
        <ActionModal
          onSubmit={onRemove}
          isOpen={!!confirmingText}
          onClose={() => {
            flushSync(() => setConfirmingText(null));
            removeButtonRef.current?.focus();
          }}
          cancelBtnText="Cancel"
          warningLabel="Remove"
          warningText={confirmingText}
          submittingBtnText="Removing"
          isSubmitting={false}
        />
      )}
    </>
  );
}

type CctCalculationRadiosProps = {
  calculations: CctCalculation[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function CctCalculationRadios({
  calculations,
  selectedId,
  onSelect
}: Readonly<CctCalculationRadiosProps>) {
  const [isShowingAll, setIsShowingAll] = useState(false);
  const newestFirst = sortByNewestSaved(calculations);
  const visibleCalculations = isShowingAll
    ? newestFirst
    : newestFirst.filter(
        (calculation, index) =>
          index < PREVIEW_CALCULATION_COUNT || calculation.id === selectedId
      );

  return (
    <>
      <Radios
        name="cctSnapshotCalculation"
        id="cctSnapshotCalculation"
        error=""
        data-cy="cctSnapshotOptions"
      >
        {visibleCalculations.map(calculation => (
          <Radios.Item
            key={calculation.id}
            value={calculation.id}
            checked={selectedId === calculation.id}
            onChange={() => onSelect(calculation.id)}
            hint={describeCctCalculation(calculation)}
            data-cy={`cctSnapshotOption-${calculation.id}`}
          >
            {calculation.name}
          </Radios.Item>
        ))}
      </Radios>
      {newestFirst.length > PREVIEW_CALCULATION_COUNT && (
        <p>
          <button
            type="button"
            className="link-button"
            aria-expanded={isShowingAll}
            onClick={() =>
              setIsShowingAll(prevIsShowingAll => !prevIsShowingAll)
            }
            data-cy="cctSnapshotShowAllCalculations"
          >
            {isShowingAll
              ? "Show fewer calculations"
              : `Show all ${newestFirst.length} calculations`}
          </button>
        </p>
      )}
    </>
  );
}

const toAttachedCctChanges = (changes: CctCalculatedChange[]): CctChange[] =>
  changes.map(
    (
      { calendarMonths: _calendarMonths, wteMonths: _wteMonths, ...change },
      index
    ) => ({
      ...change,
      id: `cctSnapshotChange-${index}`,
      endDate: change.endDate ?? ""
    })
  );

const findRemoveConfirmText = (
  name: string,
  isListLoaded: boolean,
  savedCalculation: CctCalculation | null
): string | null => {
  if (!isListLoaded)
    return `We could not check your saved CCT calculations, so we cannot tell whether this is the only copy of '${name}'. If it is, you will not be able to get it back.`;
  if (!savedCalculation)
    return `'${name}' is no longer in your saved CCT calculations, so this is the only copy. You cannot undo this.`;
  return null;
};

const sortByNewestSaved = (calculations: CctCalculation[]) =>
  [...calculations].sort(
    (a, b) => Date.parse(b.lastModified) - Date.parse(a.lastModified)
  );

const describeCctCalculation = (calculation: CctCalculation) =>
  [
    `Completion date ${formatCctDate(calculation.result.cctDate)}`,
    calculation.programmeDetails.specialty,
    `last saved ${formatCctDate(calculation.lastModified)}`
  ].join(" · ");
