import {
  BackLink,
  Button,
  Col,
  Panel,
  Row,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  selectSavedFormB,
  updateFormBSection
} from "../../../redux/slices/formBSlice";
import store from "../../../redux/store/store";
import { BooleanUtilities } from "../../../utilities/BooleanUtilities";
import {
  FORMR_PARTB_ACCEPTANCE,
  FORMR_PARTB_CONSENT,
  NEED_DISCUSSION_WITH_SOMEONE,
  NEED_DISCUSSION_WITH_SUPERVISOR
} from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";
import ScrollTo from "../ScrollTo";
import classes from "./FormRPartB.module.scss";
import { updateFormBPreviousSection } from "../../../redux/slices/formBSlice";

interface IView {
  canEdit: boolean;
  history: any;
}

const View = ({ canEdit, history }: IView) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);
  const enableCovidDeclaration = useAppSelector(state =>
    state.featureFlags.featureFlags.formRPartB.covidDeclaration.valueOf()
  );
  const viewCompSection: number = store.getState().formB.sectionNumber;

  const SectionEditButton = (section: number) => {
    return (
      canEdit && (
        <Button
          type="button"
          className={classes.sectionEditButton}
          onClick={() => {
            dispatch(updateFormBPreviousSection(viewCompSection));
            dispatch(updateFormBSection(section));
          }}
          data-cy={`BtnEditSection${section}`}
        >
          Edit
        </Button>
      )
    );
  };

  return (
    formData && (
      <>
        <ScrollTo />
        {!canEdit && (
          <Row>
            <Col width="one-half">
              <BackLink
                style={{ cursor: "pointer" }}
                data-cy="backLink"
                onClick={() => history.goBack()}
              >
                Go back to list
              </BackLink>
            </Col>
            <Col style={{ textAlign: "right" }} width="one-half">
              <Link
                className="hide-from-print"
                data-jest="linkHowToExport"
                to={{
                  pathname: "/formr-b/howtoexport"
                }}
              >
                How to export form as PDF
              </Link>
            </Col>
          </Row>
        )}

        {canEdit && (
          <WarningCallout label="Confirmation" data-jest="warningConfirmation">
            <p>
              Check the information entered below is correct and click Submit at
              the bottom of the page.
            </p>
          </WarningCallout>
        )}
        <div className="nhsuk-grid-row nhsuk-u-margin-top-3">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader1">Section 1: Doctor's details</h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(1)}
          </div>
        </div>
        <Panel label="Personal details" data-cy="personalDetails">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Forename</SummaryList.Key>
              <SummaryList.Value>{formData.forename}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>GMC-Registered Surname</SummaryList.Key>
              <SummaryList.Value>{formData.surname}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>GMC Number</SummaryList.Key>
              <SummaryList.Value data-cy="gmcNumber">
                {formData.gmcNumber}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Email Address</SummaryList.Key>
              <SummaryList.Value>{formData.email}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Deanery / HEE Local Team</SummaryList.Key>
              <SummaryList.Value data-cy="localOfficeName">
                {formData.localOfficeName}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Previous Designated Revalidation Body
              </SummaryList.Key>
              <SummaryList.Value>{formData.prevRevalBody}</SummaryList.Value>
            </SummaryList.Row>
            {formData.prevRevalBodyOther && (
              <SummaryList.Row>
                <SummaryList.Key>
                  Other Previous Revalidation Body
                </SummaryList.Key>
                <SummaryList.Value>
                  {formData.prevRevalBodyOther}
                </SummaryList.Value>
              </SummaryList.Row>
            )}
            <SummaryList.Row>
              <SummaryList.Key>Current Revalidation Date</SummaryList.Key>
              <SummaryList.Value data-jest="currRevalDate">
                {DateUtilities.ToLocalDate(formData.currRevalDate || null)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Date of Previous Revalidation</SummaryList.Key>
              <SummaryList.Value data-jest="prevRevalDate">
                {DateUtilities.ToLocalDate(formData.prevRevalDate || null)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Programme / Training Specialty</SummaryList.Key>
              <SummaryList.Value>
                {formData.programmeSpecialty}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Dual Specialty</SummaryList.Key>
              <SummaryList.Value>{formData.dualSpecialty}</SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Panel>

        <div className="nhsuk-grid-row page-break">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader2">Section 2: Whole Scope of Practice</h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(2)}
          </div>
        </div>
        <Panel label="Type of work">
          {formData.work.length > 0
            ? formData.work.map((w, i) => (
                <Panel key={i} className={classes.workPanel}>
                  <h3 data-cy={`typeOfWork${i + 1}`}>Type of work {i + 1}</h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Type of Work</SummaryList.Key>
                      <SummaryList.Value>{w.typeOfWork}</SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Training post</SummaryList.Key>
                      <SummaryList.Value>{w.trainingPost}</SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Start Date</SummaryList.Key>
                      <SummaryList.Value
                        data-jest="startDate"
                        data-cy={`startDate${i + 1}`}
                      >
                        {DateUtilities.ToLocalDate(w.startDate || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>End Date</SummaryList.Key>
                      <SummaryList.Value data-jest="endDate">
                        {DateUtilities.ToLocalDate(w.endDate || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Site Name</SummaryList.Key>
                      <SummaryList.Value>{w.site}</SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Site Location</SummaryList.Key>
                      <SummaryList.Value>{w.siteLocation}</SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Panel>
              ))
            : null}
        </Panel>
        <Panel label="Reasons for TIME OUT OF TRAINING (TOOT)">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Short and Long-term sickness absence
              </SummaryList.Key>
              <SummaryList.Value>{formData.sicknessAbsence}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Parental leave (incl Maternity / Paternity leave)
              </SummaryList.Key>
              <SummaryList.Value>{formData.parentalLeave}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Career breaks within a Programme (OOPC) and non-training
                placements for experience (OOPE)
              </SummaryList.Key>
              <SummaryList.Value>{formData.careerBreaks}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Paid / unpaid leave (e.g. compassionate, jury service)
              </SummaryList.Key>
              <SummaryList.Value>{formData.paidLeave}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Unpaid/unauthorised leave including industrial action
              </SummaryList.Key>
              <SummaryList.Value>
                {formData.unauthorisedLeave}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Other</SummaryList.Key>
              <SummaryList.Value>{formData.otherLeave}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                <b>Total</b>
              </SummaryList.Key>
              <SummaryList.Key>
                <b data-cy="totalLeave">{formData.totalLeave}</b>
              </SummaryList.Key>
            </SummaryList.Row>
          </SummaryList>
        </Panel>

        <div className="nhsuk-grid-row page-break">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader3">
              Section 3: Declarations relating to Good Medical Practice
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(3)}
          </div>
        </div>
        <Panel label="Declarations">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                I declare that I accept the professional obligations placed on
                me in Good Medical Practice in relation to honesty and integrity
              </SummaryList.Key>
              <SummaryList.Value>
                {BooleanUtilities.ToYesNo(formData.isHonest)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                I declare that I accept the professional obligations placed on
                me in Good Medical Practice about my personal health
              </SummaryList.Key>
              <SummaryList.Value>
                {BooleanUtilities.ToYesNo(formData.isHealthy)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Do you have any GMC conditions, warnings or undertakings placed
                on you by the GMC, employing Trust or other organisation?
              </SummaryList.Key>
              <SummaryList.Value>
                {BooleanUtilities.ToYesNo(formData.isWarned)}
              </SummaryList.Value>
            </SummaryList.Row>
            {BooleanUtilities.ToBoolean(formData.isWarned) ? (
              <SummaryList.Row>
                <SummaryList.Key>
                  If yes, are you complying with these conditions /
                  undertakings?
                </SummaryList.Key>
                <SummaryList.Value data-cy="isComplying">
                  {BooleanUtilities.ToYesNo(formData.isComplying)}
                </SummaryList.Value>
              </SummaryList.Row>
            ) : null}

            <SummaryList.Row>
              <SummaryList.Key>Health Statement</SummaryList.Key>
              <SummaryList.Value>{formData.healthStatement}</SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Panel>

        <div className="nhsuk-grid-row page-break">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader4">
              Section 4: Update to your previous Form R Part B
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(4)}
          </div>
        </div>
        <Panel label="Previously declared events">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Did you declare any Significant Events, Complaints, Other
                investigations on your previous Form R Part B?
              </SummaryList.Key>
              <SummaryList.Value data-jest="havePreviousDeclarations">
                {BooleanUtilities.ToYesNo(formData.havePreviousDeclarations)}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {formData.previousDeclarations &&
          formData.previousDeclarations.length > 0
            ? formData.previousDeclarations.map((event, index) => (
                <Panel
                  key={index}
                  className={classes.previousDeclarationsPanel}
                >
                  <h3 data-cy={`previousDeclaration${index + 1}`}>
                    Previous declaration {index + 1}
                  </h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Declaration type</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDeclarationType${index + 1}`}
                        data-jest="previousDeclarationType"
                      >
                        {event.declarationType}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Date of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDateOfEntry${index + 1}`}
                        data-jest="previousDateOfEntry"
                      >
                        {DateUtilities.ToLocalDate(event.dateOfEntry || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Title</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDeclarationTitle${index + 1}`}
                        data-jest="previousDeclarationTitle"
                      >
                        {event.title}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Location of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousLocationOfEntry${index + 1}`}
                        data-jest="previousLocationOfEntry"
                      >
                        {event.locationOfEntry}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Panel>
              ))
            : null}
          {formData.previousDeclarations &&
          formData.previousDeclarations.length > 0 ? (
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  If any previously declared Significant Events, Complaints or
                  Other Investigations remain unresolved, please provide a brief
                  summary below, including where you were working, the date of
                  the event, and your reflection where appropriate. If known,
                  please identify what investigations are pending relating to
                  the event and which organisation is undertaking this
                  investigation.
                </SummaryList.Key>
                <SummaryList.Value data-jest="previousDeclarationSummary">
                  {formData.previousDeclarationSummary}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          ) : null}
        </Panel>

        <div className="nhsuk-grid-row page-break">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader5">
              Section 5: New declarations since your previous Form R Part B
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(5)}
          </div>
        </div>
        <Panel label="New declared events">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>I confirm that</SummaryList.Key>
              <SummaryList.Value data-jest="haveCurrentDeclarations">
                {BooleanUtilities.ToBoolean(formData.haveCurrentDeclarations)
                  ? "I have been involved in significant events/complaints/other investigations since my last ARCP/RITA/Appraisal"
                  : "I do not have anything new to declare since my last ARCP/RITA/Appraisal"}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>

          {formData.currentDeclarations &&
          formData.currentDeclarations.length > 0
            ? formData.currentDeclarations.map((event, index) => (
                <Panel key={index} className={classes.currentDeclarationsPanel}>
                  <h3 data-cy={`currentDeclaration${index + 1}`}>
                    Current declaration {index + 1}
                  </h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Declaration type</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`currentDeclarationType${index + 1}`}
                        data-jest="currentDeclarationType"
                      >
                        {event.declarationType}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Date of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`currentDateOfEntry${index + 1}`}
                        data-jest="currentDateOfEntry"
                      >
                        {DateUtilities.ToLocalDate(event.dateOfEntry || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Title</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`currentDeclarationTitle${index + 1}`}
                        data-jest="currentDeclarationTitle"
                      >
                        {event.title}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Location of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`currentLocationOfEntry${index + 1}`}
                        data-jest="currentLocationOfEntry"
                      >
                        {event.locationOfEntry}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Panel>
              ))
            : null}

          {formData.currentDeclarations &&
          formData.currentDeclarations.length > 0 ? (
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  If you know of any unresolved significant
                  events/complaints/other investigations since your last
                  ARCP/RITA/Appraisal, please provide below a brief summary,
                  including where you were working, the date of the event and
                  your reflection where appropriate. If known, please identify
                  what investigations are pending relating to the event and
                  which organisation is undertaking the investigation.
                </SummaryList.Key>
                <SummaryList.Value data-jest="previousDeclarationSummary">
                  {formData.currentDeclarationSummary}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          ) : null}
        </Panel>

        <div className="nhsuk-grid-row page-break">
          <div
            className={
              canEdit ? "nhsuk-grid-column-two-thirds" : "nhs-grid-column-full"
            }
          >
            <h2 data-cy="sectionHeader6">Section 6: Compliments</h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {SectionEditButton(6)}
          </div>
        </div>
        <Panel label="Compliments">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Compliments</SummaryList.Key>
              <SummaryList.Value data-jest="compliments">
                {formData.compliments ? formData.compliments : "None recorded"}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Panel>

        {enableCovidDeclaration ? (
          <>
            <div className="nhsuk-grid-row page-break">
              <div
                className={
                  canEdit
                    ? "nhsuk-grid-column-two-thirds"
                    : "nhs-grid-column-full"
                }
              >
                <h2 data-cy="sectionHeader7">Covid declarations</h2>
              </div>
              <div className="nhsuk-grid-column-one-third">
                {SectionEditButton(7)}
              </div>
            </div>
            <Panel label="Section 1: Trainee self-assessment of progress">
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>
                    Has covid effected placement?
                  </SummaryList.Key>
                  <SummaryList.Value>
                    {BooleanUtilities.ToYesNo(formData.haveCovidDeclarations)}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>

              {BooleanUtilities.ToBoolean(formData.haveCovidDeclarations) ? (
                <SummaryList>
                  <SummaryList.Row>
                    <SummaryList.Key>Covid Training Progress</SummaryList.Key>
                    <SummaryList.Value>
                      {formData.covidDeclarationDto?.selfRateForCovid}
                    </SummaryList.Value>
                  </SummaryList.Row>
                  {formData.covidDeclarationDto?.reasonOfSelfRate ? (
                    <SummaryList.Row>
                      <SummaryList.Key>
                        Covid Training Progress Reason
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {formData.covidDeclarationDto?.reasonOfSelfRate}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  ) : null}
                  <SummaryList.Row>
                    <SummaryList.Key>
                      Other Information for ARCP Panel
                    </SummaryList.Key>
                    <SummaryList.Value>
                      {formData.covidDeclarationDto?.otherInformationForPanel}
                    </SummaryList.Value>
                  </SummaryList.Row>
                </SummaryList>
              ) : null}
            </Panel>

            {BooleanUtilities.ToBoolean(formData.haveCovidDeclarations) ? (
              <>
                <Panel label="Section 2: Trainee Check-In">
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        {NEED_DISCUSSION_WITH_SUPERVISOR}
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {BooleanUtilities.ToYesNo(
                          formData.covidDeclarationDto
                            ?.discussWithSupervisorChecked
                        )}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        {NEED_DISCUSSION_WITH_SOMEONE}
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {BooleanUtilities.ToYesNo(
                          formData.covidDeclarationDto
                            ?.discussWithSomeoneChecked
                        )}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Panel>

                <Panel label="Section 3: Trainee placement changes">
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        Changes were made to my placement due to my individual
                        circumstances
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {BooleanUtilities.ToYesNo(
                          formData.covidDeclarationDto?.haveChangesToPlacement
                        )}
                      </SummaryList.Value>
                    </SummaryList.Row>

                    {BooleanUtilities.ToBoolean(
                      formData.covidDeclarationDto?.haveChangesToPlacement
                    ) ? (
                      <>
                        <SummaryList.Row>
                          <SummaryList.Key>
                            Circumstance of change
                          </SummaryList.Key>
                          <SummaryList.Value>
                            {formData.covidDeclarationDto?.changeCircumstances}
                          </SummaryList.Value>
                        </SummaryList.Row>

                        {formData.covidDeclarationDto?.changeCircumstances ===
                        "Other" ? (
                          <SummaryList.Row>
                            <SummaryList.Key>
                              Other circumstance
                            </SummaryList.Key>
                            <SummaryList.Value>
                              {
                                formData.covidDeclarationDto
                                  ?.changeCircumstanceOther
                              }
                            </SummaryList.Value>
                          </SummaryList.Row>
                        ) : null}

                        <SummaryList.Row>
                          <SummaryList.Key>
                            Please explain further how your placement was
                            adjusted
                          </SummaryList.Key>
                          <SummaryList.Value>
                            {formData.covidDeclarationDto?.howPlacementAdjusted}
                          </SummaryList.Value>
                        </SummaryList.Row>
                      </>
                    ) : null}
                  </SummaryList>
                </Panel>

                <Panel label="Section 4: Educational Supervisor (ES) Report / Validation">
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        Education Supervisor Name
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {formData.covidDeclarationDto?.educationSupervisorName}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>
                        Education Supervisor Email Address
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {formData.covidDeclarationDto?.educationSupervisorEmail}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Panel>
              </>
            ) : null}
          </>
        ) : null}

        {!canEdit && (
          <>
            <div className="nhsuk-grid-row page-break">
              <div className="nhs-grid-column-full">
                <h2 data-cy="sectionHeader5">Declarations</h2>
              </div>
            </div>
            <Panel label="Declarations">
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>I confirm that</SummaryList.Key>
                  <SummaryList.Value data-jest="dec">
                    {FORMR_PARTB_ACCEPTANCE}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>I confirm that</SummaryList.Key>
                  <SummaryList.Value data-jest="dec">
                    {FORMR_PARTB_CONSENT}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </Panel>
          </>
        )}
      </>
    )
  );
};

export default View;
