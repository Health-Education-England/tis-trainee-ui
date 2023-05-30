import { Card, WarningCallout, SummaryList } from "nhsuk-react-components";
import { Redirect } from "react-router-dom";
import { CCT_DECLARATION } from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";
import ScrollTo from "../../../components/forms/ScrollTo";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectSavedFormA } from "../../../redux/slices/formASlice";
import FormSavePDF from "../../../components/forms/FormSavePDF";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
interface IView {
  canEdit: boolean;
  history: any;
}

const View = ({ canEdit, history }: IView) => {
  const formData = useAppSelector(selectSavedFormA);
  let content;

  if (formData.traineeTisId)
    content = (
      <>
        <ScrollTo />
        {!canEdit && <FormSavePDF history={history} path={"/formr-a"} />}
        {!!canEdit && (
          <WarningCallout data-cy="warningConfirmation">
            <WarningCallout.Label visuallyHiddenText={false}>
              Confirmation
            </WarningCallout.Label>
            <p>
              Check the information entered below is correct and click Submit at
              the bottom of the page.
            </p>
          </WarningCallout>
        )}
        {!canEdit &&
          FormRUtilities.displaySubmissionDate(
            formData.submissionDate,
            "submissionDateTop"
          )}
        <Card feature>
          <Card.Content>
            <Card.Heading>Personal Details</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>Forename</SummaryList.Key>
                <SummaryList.Value>{formData.forename}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>GMC-Registered Surname</SummaryList.Key>
                <SummaryList.Value data-cy="surname">
                  {formData.surname}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>GMC Number</SummaryList.Key>
                <SummaryList.Value>{formData.gmcNumber}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Deanery / HEE Local Office</SummaryList.Key>
                <SummaryList.Value data-cy="localOfficeName">
                  {formData.localOfficeName}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Date of Birth</SummaryList.Key>
                <SummaryList.Value>
                  {DateUtilities.ToLocalDate(formData.dateOfBirth)}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Gender</SummaryList.Key>
                <SummaryList.Value>{formData.gender}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Immigration Status</SummaryList.Key>
                <SummaryList.Value>
                  {formData.immigrationStatus}
                </SummaryList.Value>
              </SummaryList.Row>
              {formData.immigrationStatus.toLowerCase().includes("other") ? (
                <SummaryList.Row>
                  <SummaryList.Key>Immigration Status (Other)</SummaryList.Key>
                  <SummaryList.Value>
                    {formData.otherImmigrationStatus}
                  </SummaryList.Value>
                </SummaryList.Row>
              ) : null}
              <SummaryList.Row>
                <SummaryList.Key>Primary Qualification</SummaryList.Key>
                <SummaryList.Value>{formData.qualification}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Date Awarded</SummaryList.Key>
                <SummaryList.Value>
                  {DateUtilities.ToLocalDate(formData.dateAttained)}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>
                  Medical School Awarding Primary Qualification (name and
                  country)
                </SummaryList.Key>
                <SummaryList.Value>{formData.medicalSchool}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Home Address</SummaryList.Key>
                <SummaryList.Value>
                  <p>{formData.address1}</p>
                  <p>{formData.address2}</p>
                  <p>{formData.address3}</p>
                  <p>{formData.postCode}</p>
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Contact Telephone</SummaryList.Key>
                <SummaryList.Value>
                  {formData.telephoneNumber}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Contact Mobile</SummaryList.Key>
                <SummaryList.Value data-cy="mobileNumber">
                  {formData.mobileNumber}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Email Address</SummaryList.Key>
                <SummaryList.Value>{formData.email}</SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </Card.Content>
        </Card>
        <Card className="page-break" feature>
          <Card.Content>
            <Card.Heading>Declarations</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>I confirm that</SummaryList.Key>
                <SummaryList.Value data-cy="declarationTypeVal">
                  {formData.declarationType}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Programme Specialty</SummaryList.Key>
                <SummaryList.Value>
                  {formData.programmeSpecialty}
                </SummaryList.Value>
              </SummaryList.Row>
              {formData.declarationType === CCT_DECLARATION ? (
                <>
                  <SummaryList.Row>
                    <SummaryList.Key>CCT Specialty 1</SummaryList.Key>
                    <SummaryList.Value>
                      {formData.cctSpecialty1}
                    </SummaryList.Value>
                  </SummaryList.Row>
                  <SummaryList.Row>
                    <SummaryList.Key>CCT Specialty 2</SummaryList.Key>
                    <SummaryList.Value>
                      {formData.cctSpecialty2}
                    </SummaryList.Value>
                  </SummaryList.Row>
                </>
              ) : null}
              <SummaryList.Row>
                <SummaryList.Key>
                  Royal College / Faculty Assessing Training for the Award of
                  CCT
                </SummaryList.Key>
                <SummaryList.Value>{formData.college}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>
                  Anticipated Completion Date of Current Programme (if known)
                </SummaryList.Key>
                <SummaryList.Value>
                  {DateUtilities.ToLocalDate(formData.completionDate)}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </Card.Content>
        </Card>
        <Card feature>
          <Card.Content>
            <Card.Heading>Programme</Card.Heading>
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>Training Grade</SummaryList.Key>
                <SummaryList.Value>{formData.trainingGrade}</SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Start Date</SummaryList.Key>
                <SummaryList.Value>
                  {DateUtilities.ToLocalDate(formData.startDate)}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>Post type or Appointment</SummaryList.Key>
                <SummaryList.Value>
                  {formData.programmeMembershipType}
                </SummaryList.Value>
              </SummaryList.Row>
              <SummaryList.Row>
                <SummaryList.Key>
                  Full Time or % of Full Time Training
                </SummaryList.Key>
                <SummaryList.Value>
                  {formData.wholeTimeEquivalent}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          </Card.Content>
        </Card>
        {!canEdit &&
          FormRUtilities.displaySubmissionDate(
            formData.submissionDate,
            "submissionDate"
          )}
      </>
    );
  else content = <Redirect to="/formr-a" />;

  return <div>{content}</div>;
};

export default View;
