import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import {
  NEED_DISCUSSION_WITH_SOMEONE,
  NEED_DISCUSSION_WITH_SUPERVISOR
} from "../../../../utilities/Constants";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";

interface IViewSection7 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection7 = ({ makeSectionEditButton, formData }: IViewSection7) => {
  return (
    <div>
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
              <SummaryList.Key>Has covid effected placement?</SummaryList.Key>
              <SummaryList.Value>
                {BooleanUtilities.ToYesNo(formData.haveCovidDeclarations)}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>

          {BooleanUtilities.ToBoolean(formData.haveCovidDeclarations) && (
            <SummaryList data-cy="covidTrainingProgress">
              <SummaryList.Row>
                <SummaryList.Key>Covid Training Progress</SummaryList.Key>
                <SummaryList.Value>
                  {formData.covidDeclarationDto?.selfRateForCovid}
                </SummaryList.Value>
              </SummaryList.Row>
              {formData.covidDeclarationDto?.reasonOfSelfRate && (
                <SummaryList.Row>
                  <SummaryList.Key data-cy="covidTrainingReason">
                    Covid Training Progress Reason
                  </SummaryList.Key>
                  <SummaryList.Value>
                    {formData.covidDeclarationDto?.reasonOfSelfRate}
                  </SummaryList.Value>
                </SummaryList.Row>
              )}
              <SummaryList.Row>
                <SummaryList.Key>
                  Other Information for ARCP Panel
                </SummaryList.Key>
                <SummaryList.Value>
                  {formData.covidDeclarationDto?.otherInformationForPanel}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          )}
        </Card.Content>
      </Card>
      {BooleanUtilities.ToBoolean(formData.haveCovidDeclarations) && (
        <>
          <Card feature>
            <Card.Content>
              <Card.Heading data-cy="covidTrainingSection2">
                Section 2: Trainee Check-In
              </Card.Heading>
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>
                    {NEED_DISCUSSION_WITH_SUPERVISOR}
                  </SummaryList.Key>
                  <SummaryList.Value>
                    {BooleanUtilities.ToYesNo(
                      formData.covidDeclarationDto?.discussWithSupervisorChecked
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>
                    {NEED_DISCUSSION_WITH_SOMEONE}
                  </SummaryList.Key>
                  <SummaryList.Value>
                    {BooleanUtilities.ToYesNo(
                      formData.covidDeclarationDto?.discussWithSomeoneChecked
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </Card.Content>
          </Card>
          <Card feature>
            <Card.Content>
              <Card.Heading data-cy="covidTrainingSection3">
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
                ) && (
                  <>
                    <SummaryList.Row>
                      <SummaryList.Key data-cy="circumstanceOfChange">
                        Circumstance of change
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {formData.covidDeclarationDto?.changeCircumstances}
                      </SummaryList.Value>
                    </SummaryList.Row>

                    {formData.covidDeclarationDto?.changeCircumstances ===
                      "Other" && (
                      <SummaryList.Row>
                        <SummaryList.Key data-cy="otherCircumstance">
                          Other circumstance
                        </SummaryList.Key>
                        <SummaryList.Value>
                          {
                            formData.covidDeclarationDto
                              ?.changeCircumstanceOther
                          }
                        </SummaryList.Value>
                      </SummaryList.Row>
                    )}

                    <SummaryList.Row>
                      <SummaryList.Key>
                        Please explain further how your placement was adjusted
                      </SummaryList.Key>
                      <SummaryList.Value>
                        {formData.covidDeclarationDto?.howPlacementAdjusted}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </>
                )}
              </SummaryList>
            </Card.Content>
          </Card>
          <Card feature>
            <Card.Content>
              <Card.Heading data-cy="covidTrainingSection4">
                Section 4: Educational Supervisor (ES) Report / Validation
              </Card.Heading>
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>Education Supervisor Name</SummaryList.Key>
                  <SummaryList.Value data-cy="covidSupName">
                    {FormRUtilities.showMsgIfEmpty(
                      formData.covidDeclarationDto?.educationSupervisorName!,
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
                      formData.covidDeclarationDto?.educationSupervisorEmail!,
                      "No supervisor email provided"
                    )}
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </Card.Content>
          </Card>
        </>
      )}
    </div>
  );
};

export default ViewSection7;
