import { Button, Card, InsetText, SummaryList } from "nhsuk-react-components";
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
  CCT_NOT_CALCULATED
} from "../../../utilities/CctConstants";
import {
  formatCctDate,
  formatCctMonths
} from "../../../utilities/CctUtilities";
import { CctCalculationStatus } from "../../../utilities/hooks/useCctCalculation";
import { CctSaveStatus } from "../../../redux/slices/cctSlice";
import { CctChangesTable } from "./CctChangesSection";
import { CctDeleteButton } from "./CctDeleteButton";
import {
  CctGradeProgressionSummary,
  CctGradeYearsTable
} from "./CctGradeProgressionSection";
import { CctPrintSummary } from "./CctPrintSummary";
import { CctProgrammeDetailsSummary } from "./CctProgrammeDetailsSection";
import { CctRequestError } from "./CctRequestError";
import { CctSaveForm } from "./CctSaveForm";
import { CctTrainingTimeSummary } from "./CctTrainingTimeSection";

type CctSummaryProps = {
  programmeDetails: CctProgrammeDetails | null;
  specialties: CctSpecialty[];
  changes: CctChange[];
  calculatedChanges: CctCalculatedChange[];
  result: CctResult | null;
  calculationStatus: CctCalculationStatus;
  isRetrying: boolean;
  onRetry: () => void;
  hasInvalidChanges: boolean;
  onGoToChanges: () => void;
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
  hasInvalidChanges,
  onGoToChanges,
  savedCalculationId,
  savedName,
  name,
  saveStatus,
  onSave,
  onNameChange
}: Readonly<CctSummaryProps>) {
  const noResultText =
    calculationStatus === "failed" ? CCT_NO_VALUE : CCT_NOT_CALCULATED;
  const canPrint = calculationStatus === "succeeded" && !hasInvalidChanges;

  return (
    <>
      <div className={canPrint ? "hide-from-print" : undefined}>
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
          {programmeDetails && (
            <CctProgrammeDetailsSummary
              programmeDetails={programmeDetails}
              specialties={specialties}
              result={result}
              calculationStatus={calculationStatus}
            />
          )}
        </Card>

        {programmeDetails && (
          <>
            <Card feature>
              <Card.Heading>Training time adjustments</Card.Heading>
              <CctTrainingTimeSummary
                programmeDetails={programmeDetails}
                result={result}
                calculationStatus={calculationStatus}
                headingLevel="h3"
              />
            </Card>
            <Card feature>
              <Card.Heading>Grade progression adjustments</Card.Heading>
              <CctGradeProgressionSummary programmeDetails={programmeDetails} />
            </Card>
          </>
        )}

        <Card feature>
          <Card.Heading>Changes</Card.Heading>
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

        {programmeDetails && result && result.gradeProgression.length > 0 && (
          <Card feature>
            <Card.Heading>Grade progression</Card.Heading>
            <CctGradeYearsTable
              gradeYears={result.gradeProgression}
              programmeDetails={programmeDetails}
            />
          </Card>
        )}

        {calculationStatus === "succeeded" && (
          <Card feature>
            <Card.Heading>Save your calculation</Card.Heading>
            {hasInvalidChanges ? (
              <>
                <p data-cy="cct-save-blocked">
                  There is a problem with your changes. You need to fix it
                  before you can save this calculation.
                </p>
                <Button
                  secondary
                  type="button"
                  onClick={onGoToChanges}
                  data-cy="cct-go-to-changes"
                >
                  Go to changes
                </Button>
              </>
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
