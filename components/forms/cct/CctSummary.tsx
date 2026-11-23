import { ButtonHTMLAttributes } from "react";
import {
  Button,
  Card,
  ErrorMessage,
  ErrorSummary,
  InsetText,
  SummaryList
} from "nhsuk-react-components";
import {
  CctCalculatedChange,
  CctChange,
  CctProgrammeDetails,
  CctResult,
  CctSpecialty
} from "../../../models/CctTypes";
import {
  CCT_INDICATIVE_DATE_TEXT,
  CCT_NO_CHANGES_TEXT,
  CCT_NO_VALUE,
  CCT_NOT_CALCULATED,
  CCT_PAGE_NAMES,
  CCT_PAGES
} from "../../../utilities/CctConstants";
import {
  CctInvalidAdjustment,
  formatCctDate,
  formatCctMonths
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctSaveStatus } from "../../../redux/slices/cctSlice";
import {
  CctChangesTable,
  CctInvalidChange,
  cctInvalidChangeText
} from "./CctChangesSection";
import { CctDeleteButton } from "./CctDeleteButton";
import {
  CctGradeProgressionSummary,
  CctGradeYearsTable
} from "./CctGradeProgressionSection";
import { CctPrintSummary } from "./CctPrintSummary";
import {
  cctInvalidAdjustmentText,
  CctProgrammeDetailsSummary
} from "./CctProgrammeDetailsSection";
import { CctRequestError } from "./CctRequestError";
import { CctSaveForm } from "./CctSaveForm";
import { CctTrainingTimeSummary } from "./CctTrainingTimeSection";

function CctChangeButton(
  props: Readonly<ButtonHTMLAttributes<HTMLButtonElement>>
) {
  return (
    <button
      {...props}
      type="button"
      className="nhsuk-link nhsuk-link--no-visited-state nhsuk-u-font-weight-bold hide-from-print"
    />
  );
}

type CctSummaryProps = {
  programmeDetails: CctProgrammeDetails | null;
  specialties: CctSpecialty[];
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isRetrying: boolean;
  onRetry: () => void;
  invalidChanges: CctInvalidChange[];
  programmeDetailsErrors: CctInvalidAdjustment[];
  trainingTimeErrors: CctInvalidAdjustment[];
  gradeProgressionErrors: CctInvalidAdjustment[];
  onGoToPage: (page: number) => void;
  savedCalculationId?: string;
  savedName: string;
  name: string;
  saveStatus: CctSaveStatus;
  onSave: (name: string) => void;
  onNameChange: (name: string) => void;
};

export function CctSummary({
  programmeDetails,
  specialties,
  changes,
  calculatedChanges,
  result,
  calculationStatus,
  isRetrying,
  onRetry,
  invalidChanges,
  programmeDetailsErrors,
  trainingTimeErrors,
  gradeProgressionErrors,
  onGoToPage,
  savedCalculationId,
  savedName,
  name,
  saveStatus,
  onSave,
  onNameChange
}: Readonly<CctSummaryProps>) {
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;
  const pageSlug = (page: number) =>
    CCT_PAGE_NAMES[page].toLowerCase().replaceAll(" ", "-");
  const changeLinkId = (page: number) => `cct-change-${pageSlug(page)}`;
  const adjustmentErrors = (adjustments: CctInvalidAdjustment[]) =>
    programmeDetails
      ? adjustments.map(adjustment => ({
          key: `${adjustment.pointer}-${adjustment.message}`,
          text: cctInvalidAdjustmentText(programmeDetails, adjustment)
        }))
      : [];
  const cardErrors: Record<number, { key: string; text: string }[]> = {
    [CCT_PAGES.programmeDetails]: adjustmentErrors(programmeDetailsErrors),
    [CCT_PAGES.trainingTime]: adjustmentErrors(trainingTimeErrors),
    [CCT_PAGES.gradeProgression]: adjustmentErrors(gradeProgressionErrors),
    [CCT_PAGES.changes]: invalidChanges.map(invalidChange => ({
      key: `${invalidChange.change.id}-${invalidChange.pointer}`,
      text: cctInvalidChangeText(invalidChange)
    }))
  };
  const pagesWithErrors = [
    CCT_PAGES.programmeDetails,
    CCT_PAGES.trainingTime,
    CCT_PAGES.gradeProgression,
    CCT_PAGES.changes
  ].filter(page => cardErrors[page].length > 0);
  const hasErrors = pagesWithErrors.length > 0;
  const changeAction = (page: number) => (
    <Card.Action
      asElement={CctChangeButton}
      id={changeLinkId(page)}
      onClick={() => onGoToPage(page)}
      data-cy={changeLinkId(page)}
    >
      Change
    </Card.Action>
  );
  const cardErrorMessages = (page: number) =>
    cardErrors[page].map(({ key, text }) => (
      <ErrorMessage key={key} data-cy={`cct-card-error-${pageSlug(page)}`}>
        {text}
      </ErrorMessage>
    ));
  const canPrint = calculationStatus === "succeeded" && !hasErrors;

  return (
    <>
      <div className={canPrint ? "hide-from-print" : undefined}>
        {hasErrors && (
          <ErrorSummary
            aria-labelledby="cct-summary-errors-title"
            disableAutoFocus
            data-cy="cct-summary-errors"
          >
            <ErrorSummary.Title id="cct-summary-errors-title">
              There is a problem
            </ErrorSummary.Title>
            <ErrorSummary.List>
              {pagesWithErrors.map(page => (
                <ErrorSummary.ListItem
                  key={page}
                  href={`#${changeLinkId(page)}`}
                  onClick={e => {
                    e.preventDefault();
                    const changeLink = document.getElementById(
                      changeLinkId(page)
                    );
                    changeLink?.scrollIntoView({
                      behavior: "smooth",
                      block: "center"
                    });
                    changeLink?.focus({ preventScroll: true });
                  }}
                  data-cy={`cct-summary-error-link-${pageSlug(page)}`}
                >
                  {CCT_PAGE_NAMES[page]}
                </ErrorSummary.ListItem>
              ))}
            </ErrorSummary.List>
          </ErrorSummary>
        )}

        <Card feature>
          <Card.Heading>Your indicative completion date</Card.Heading>
          {calculationStatus === "failed" && (
            <CctRequestError isRetrying={isRetrying} onRetry={onRetry} />
          )}
          <SummaryList data-cy="cct-result-summary">
            <SummaryList.Row>
              <SummaryList.Key>
                Projected Completion of Training Date
              </SummaryList.Key>
              <SummaryList.Value>
                <strong>
                  {result ? formatCctDate(result.cctDate) : noResultText}
                </strong>
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Total WTE completed (months)</SummaryList.Key>
              <SummaryList.Value>
                {formatCctMonths(result?.totalWteMonthsCompleted)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Training remaining (months)</SummaryList.Key>
              <SummaryList.Value>
                {formatCctMonths(result?.monthsRemaining)}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {result && (
            <InsetText data-cy="cct-summary-disclaimer">
              <p>
                <strong>{CCT_INDICATIVE_DATE_TEXT}</strong>
              </p>
            </InsetText>
          )}
        </Card>

        <Card feature>
          <Card.Heading>Programme details</Card.Heading>
          {changeAction(CCT_PAGES.programmeDetails)}
          {cardErrorMessages(CCT_PAGES.programmeDetails)}
          {programmeDetails && (
            <CctProgrammeDetailsSummary
              programmeDetails={programmeDetails}
              specialties={specialties}
              result={result}
              calculationStatus={calculationStatus}
            />
          )}
        </Card>

        {programmeDetails && result && result.gradeProgression.length > 0 && (
          <Card feature>
            <Card.Heading>Grade progression</Card.Heading>
            <CctGradeYearsTable
              gradeYears={result.gradeProgression}
              programmeDetails={programmeDetails}
            />
          </Card>
        )}

        {programmeDetails && (
          <>
            <Card feature>
              <Card.Heading>Training time adjustments</Card.Heading>
              {changeAction(CCT_PAGES.trainingTime)}
              {cardErrorMessages(CCT_PAGES.trainingTime)}
              <CctTrainingTimeSummary
                programmeDetails={programmeDetails}
                result={result}
                calculationStatus={calculationStatus}
                headingLevel="h3"
              />
            </Card>
            <Card feature>
              <Card.Heading>Grade progression adjustments</Card.Heading>
              {changeAction(CCT_PAGES.gradeProgression)}
              {cardErrorMessages(CCT_PAGES.gradeProgression)}
              <CctGradeProgressionSummary programmeDetails={programmeDetails} />
            </Card>
          </>
        )}

        <Card feature>
          <Card.Heading>Changes</Card.Heading>
          {changeAction(CCT_PAGES.changes)}
          {cardErrorMessages(CCT_PAGES.changes)}
          {changes.length === 0 && (
            <p data-cy="cct-summary-no-changes">
              <em>{CCT_NO_CHANGES_TEXT}</em>
            </p>
          )}
          <CctChangesTable
            changes={changes}
            calculatedChanges={calculatedChanges}
            result={result}
          />
        </Card>

        {calculationStatus === "succeeded" && (
          <Card feature>
            <Card.Heading>Save your calculation</Card.Heading>
            {hasErrors ? (
              <p data-cy="cct-save-blocked">
                You need to fix the problems above before you can save this
                calculation.
              </p>
            ) : (
              <CctSaveForm
                name={name}
                saveStatus={saveStatus}
                onSave={onSave}
                onNameChange={onNameChange}
              />
            )}
          </Card>
        )}

        <div className="nhsuk-button-group">
          {canPrint && (
            <Button
              secondary
              type="button"
              onClick={() => globalThis.print()}
              data-cy="cct-save-pdf"
            >
              Save a copy as a PDF
            </Button>
          )}

          {savedCalculationId && (
            <CctDeleteButton id={savedCalculationId} name={savedName}>
              Delete this calculation
            </CctDeleteButton>
          )}
        </div>
      </div>

      {canPrint && programmeDetails && result && (
        <CctPrintSummary
          programmeDetails={programmeDetails}
          specialties={specialties}
          changes={changes}
          calculatedChanges={calculatedChanges}
          result={result}
          savedName={savedName}
        />
      )}
    </>
  );
}
