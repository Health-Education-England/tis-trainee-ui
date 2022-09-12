import {
  Button,
  Card,
  SummaryList,
  WarningCallout
} from "nhsuk-react-components";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  selectSavedFormB,
  updateFormBSection,
  updateFormBPreviousSection
} from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import {
  FORMR_PARTB_ACCEPTANCE,
  FORMR_PARTB_CONSENT,
  NEED_DISCUSSION_WITH_SOMEONE,
  NEED_DISCUSSION_WITH_SUPERVISOR
} from "../../../../utilities/Constants";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";
import ScrollTo from "../../ScrollTo";
import classes from "../FormRPartB.module.scss";
import FormSavePDF from "../../FormSavePDF";

import ViewSection1 from "./ViewSection1";

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
  let content;

  const makeSectionEditButton = (section: number) => {
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

  const viewSectionProps = { makeSectionEditButton, formData };

  if (formData.traineeTisId)
    content = (
      <>
        <ScrollTo />
        {!canEdit && <FormSavePDF history={history} formrPath={"/formr-b"} />}
        {!!canEdit && (
          <WarningCallout data-jest="warningConfirmation">
            <WarningCallout.Label visuallyHiddenText={false}>
              Confirmation
            </WarningCallout.Label>
            <p>
              Check the information entered below is correct, complete the
              Declarations, then click Submit at the bottom of the page.
            </p>
          </WarningCallout>
        )}
        <ViewSection1 {...viewSectionProps} />
        <div className="nhsuk-grid-row page-break">
          <div className="nhsuk-grid-column-two-thirds">
            <h2 data-cy="sectionHeader2">Section 2: Whole Scope of Practice</h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {makeSectionEditButton(2)}
          </div>
        </div>
        <Card feature>
          <Card.Content>
            <Card.Heading>Type of work</Card.Heading>
            {formData.work.length > 0
              ? formData.work.map((w, i) => (
                  <Card key={i}>
                    <Card.Content>
                      <h3 data-cy={`typeOfWork${i + 1}`}>
                        Type of work {i + 1}
                      </h3>
                      <SummaryList>
                        <SummaryList.Row>
                          <SummaryList.Key>Type of Work</SummaryList.Key>
                          <SummaryList.Value>{w.typeOfWork}</SummaryList.Value>
                        </SummaryList.Row>
                        <SummaryList.Row>
                          <SummaryList.Key>Training post</SummaryList.Key>
                          <SummaryList.Value>
                            {w.trainingPost}
                          </SummaryList.Value>
                        </SummaryList.Row>
                        <SummaryList.Row>
                          <SummaryList.Key>Start Date</SummaryList.Key>
                          <SummaryList.Value data-cy={`startDate${i + 1}`}>
                            {DateUtilities.ToLocalDate(w.startDate || null)}
                          </SummaryList.Value>
                        </SummaryList.Row>
                        <SummaryList.Row>
                          <SummaryList.Key>End Date</SummaryList.Key>
                          <SummaryList.Value data-cy={`endDate${i + 1}`}>
                            {DateUtilities.ToLocalDate(w.endDate || null)}
                          </SummaryList.Value>
                        </SummaryList.Row>
                        <SummaryList.Row>
                          <SummaryList.Key>Site Name</SummaryList.Key>
                          <SummaryList.Value>{w.site}</SummaryList.Value>
                        </SummaryList.Row>
                        <SummaryList.Row>
                          <SummaryList.Key>Site Location</SummaryList.Key>
                          <SummaryList.Value>
                            {w.siteLocation}
                          </SummaryList.Value>
                        </SummaryList.Row>
                      </SummaryList>
                    </Card.Content>
                  </Card>
                ))
              : null}
          </Card.Content>
        </Card>
        <Card feature>
          <Card.Content>
            <Card.Heading>Reasons for TIME OUT OF TRAINING (TOOT)</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Short and Long-term sickness absence
                </SummaryList.Key>
                <SummaryList.Value>
                  {formData.sicknessAbsence}
                </SummaryList.Value>
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
          </Card.Content>
        </Card>
        <div className="nhsuk-grid-row page-break">
          <div className="nhsuk-grid-column-two-thirds">
            <h2 data-cy="sectionHeader3">
              Section 3: Declarations relating to Good Medical Practice
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {makeSectionEditButton(3)}
          </div>
        </div>
        <Card feature>
          <Card.Content>
            <Card.Heading>Declarations</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  I declare that I accept the professional obligations placed on
                  me in Good Medical Practice in relation to honesty and
                  integrity
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
                  Do you have any GMC conditions, warnings or undertakings
                  placed on you by the GMC, employing Trust or other
                  organisation?
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
                <SummaryList.Value data-cy="healthStatement">
                  {FormRUtilities.showMsgIfEmpty(
                    formData.healthStatement,
                    "No health statement recorded"
                  )}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </Card.Content>
        </Card>
        <div className="nhsuk-grid-row page-break">
          <div className="nhsuk-grid-column-two-thirds">
            <h2 data-cy="sectionHeader4">
              Section 4: Update to your previous Form R Part B
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {makeSectionEditButton(4)}
          </div>
        </div>
        <Card feature>
          <Card.Content>
            <Card.Heading>Previous resolved declarations</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Did you declare any Significant Events, Complaints, Other
                  investigations on your PREVIOUS Form R Part B that have since
                  been RESOLVED?
                </SummaryList.Key>
                <SummaryList.Value data-jest="havePreviousDeclarations">
                  {BooleanUtilities.ToYesNo(formData.havePreviousDeclarations)}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
            {formData?.previousDeclarations.length > 0
              ? formData.previousDeclarations.map((event, index) => (
                  <Card key={index}>
                    <Card.Content>
                      <h3 data-cy={`previousDeclaration${index + 1}`}>
                        Declaration {index + 1}
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
                            {DateUtilities.ToLocalDate(
                              event.dateOfEntry || null
                            )}
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
                    </Card.Content>
                  </Card>
                ))
              : null}
          </Card.Content>
        </Card>
        <Card feature>
          <Card.Content>
            <Card.Heading>
              Summary of previous unresolved declarations
            </Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Do you have any PREVIOUSLY DECLARED Significant Events,
                  Complaints, or other investigations still UNRESOLVED?
                </SummaryList.Key>
                <SummaryList.Value data-jest="havePreviousDeclarations">
                  {BooleanUtilities.ToYesNo(
                    formData.havePreviousUnresolvedDeclarations
                  )}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
            {formData.havePreviousUnresolvedDeclarations?.toString() ===
              "true" && (
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>
                    Please provide a brief summary below, including where you
                    were working, the date of the event, and your reflection
                    where appropriate. If known, please identify what
                    investigations are pending relating to the event and which
                    organisation is undertaking this investigation.
                  </SummaryList.Key>
                  <SummaryList.Value data-cy="previousDeclarationSummary">
                    {formData.previousDeclarationSummary}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            )}
          </Card.Content>
        </Card>
        <div className="nhsuk-grid-row page-break">
          <div className="nhsuk-grid-column-two-thirds">
            <h2 data-cy="sectionHeader5">
              Section 5: New declarations since your previous Form R Part B
            </h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {makeSectionEditButton(5)}
          </div>
        </div>
        <Card feature>
          <Card.Content>
            <Card.Heading>New resolved declarations</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Do you have any new Significant Events, Complaints, Other
                  investigations to declare since your previous
                  ARCP/RITA/Appraisal that have since been RESOLVED?
                </SummaryList.Key>
                <SummaryList.Value data-jest="haveCurrentDeclarations">
                  {BooleanUtilities.ToYesNo(formData.haveCurrentDeclarations)}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
            {formData?.currentDeclarations.length > 0
              ? formData.currentDeclarations.map((event, index) => (
                  <Card key={index}>
                    <Card.Content>
                      <h3 data-cy={`currentDeclaration${index + 1}`}>
                        Declaration {index + 1}
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
                            {DateUtilities.ToLocalDate(
                              event.dateOfEntry || null
                            )}
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
                    </Card.Content>
                  </Card>
                ))
              : null}
          </Card.Content>
        </Card>
        <Card feature>
          <Card.Content>
            <Card.Heading>Summary of new unresolved declarations</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Do you have NEW declared Significant Events, Complaints, or
                  other investigations still UNRESOLVED?
                </SummaryList.Key>
                <SummaryList.Value data-jest="havePreviousDeclarations">
                  {BooleanUtilities.ToYesNo(
                    formData.haveCurrentUnresolvedDeclarations
                  )}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
            {formData.haveCurrentUnresolvedDeclarations?.toString() ===
              "true" && (
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>
                    Please provide a brief summary below, including where you
                    were working, the date of the event, and your reflection
                    where appropriate. If known, please identify what
                    investigations are pending relating to the event and which
                    organisation is undertaking this investigation.
                  </SummaryList.Key>
                  <SummaryList.Value data-cy="currentDeclarationSummary">
                    {formData.currentDeclarationSummary}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            )}
          </Card.Content>
        </Card>
        <div className="nhsuk-grid-row page-break">
          <div className="nhsuk-grid-column-two-thirds">
            <h2 data-cy="sectionHeader6">Section 6: Compliments</h2>
          </div>
          <div className="nhsuk-grid-column-one-third">
            {makeSectionEditButton(6)}
          </div>
        </div>
        <Card feature>
          <Card.Content>
            <Card.Heading>Compliments</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>Compliments</SummaryList.Key>
                <SummaryList.Value data-jest="compliments">
                  {FormRUtilities.showMsgIfEmpty(
                    formData.compliments,
                    "No compliments recorded"
                  )}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </Card.Content>
        </Card>
        {enableCovidDeclaration ? (
          <>
            <div className="nhsuk-grid-row page-break">
              <div className="nhsuk-grid-column-two-thirds">
                <h2 data-cy="sectionHeader7">Covid declarations</h2>
              </div>
              <div className="nhsuk-grid-column-one-third">
                {makeSectionEditButton(7)}
              </div>
            </div>
            <Card feature>
              <Card.Content>
                <Card.Heading>
                  Section 1: Trainee self-assessment of progress
                </Card.Heading>
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
              </Card.Content>
            </Card>
            {BooleanUtilities.ToBoolean(formData.haveCovidDeclarations) ? (
              <>
                <Card feature>
                  <Card.Content>
                    <Card.Heading>Section 2: Trainee Check-In</Card.Heading>
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
                  </Card.Content>
                </Card>
                <Card feature>
                  <Card.Content>
                    <Card.Heading>
                      Section 3: Trainee placement changes
                    </Card.Heading>
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
                              {
                                formData.covidDeclarationDto
                                  ?.changeCircumstances
                              }
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
                              {
                                formData.covidDeclarationDto
                                  ?.howPlacementAdjusted
                              }
                            </SummaryList.Value>
                          </SummaryList.Row>
                        </>
                      ) : null}
                    </SummaryList>
                  </Card.Content>
                </Card>
                <Card feature>
                  <Card.Content>
                    <Card.Heading>
                      Section 4: Educational Supervisor (ES) Report / Validation
                    </Card.Heading>
                    <SummaryList>
                      <SummaryList.Row>
                        <SummaryList.Key>
                          Education Supervisor Name
                        </SummaryList.Key>
                        <SummaryList.Value data-cy="covidSupName">
                          {FormRUtilities.showMsgIfEmpty(
                            formData.covidDeclarationDto
                              ?.educationSupervisorName!,
                            "No supervisor name provided"
                          )}
                        </SummaryList.Value>
                      </SummaryList.Row>
                      <SummaryList.Row>
                        <SummaryList.Key>
                          Education Supervisor Email Address
                        </SummaryList.Key>
                        <SummaryList.Value data-cy="covidSupEmail">
                          {FormRUtilities.showMsgIfEmpty(
                            formData.covidDeclarationDto
                              ?.educationSupervisorEmail!,
                            "No supervisor email provided"
                          )}
                        </SummaryList.Value>
                      </SummaryList.Row>
                    </SummaryList>
                  </Card.Content>
                </Card>
              </>
            ) : null}
          </>
        ) : null}
        {!canEdit && (
          <>
            <div className="nhsuk-grid-row page-break">
              <div className="nhsuk-grid-column-two-thirds">
                <h2 data-cy="sectionHeader5">Declarations</h2>
              </div>
            </div>
            <Card feature>
              <Card.Content>
                <Card.Heading>Declarations</Card.Heading>
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
              </Card.Content>
            </Card>
            <h3>
              Form Submitted on:&nbsp;
              {DateUtilities.ToLocalDate(formData.submissionDate)}
            </h3>
          </>
        )}
      </>
    );
  else content = <Redirect to="/formr-b" />;

  return <div>{content}</div>;
};

export default View;
