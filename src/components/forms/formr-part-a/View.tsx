import {
  Row,
  Col,
  BackLink,
  WarningCallout,
  Panel,
  SummaryList
} from "nhsuk-react-components";
import { Link, Redirect } from "react-router-dom";
import { CCT_DECLARATION } from "../../../utilities/Constants";
import { DateUtilities } from "../../../utilities/DateUtilities";
import ScrollTo from "../ScrollTo";

import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { selectSavedFormA } from "../../../redux/slices/formASlice";
import { addNotification } from "../../../redux/slices/notificationsSlice";
import { useEffect } from "react";
interface IView {
  canEdit: boolean;
  history: any;
}

const View = ({ canEdit }: IView) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormA);
  let content;

  useEffect(() => {
    if (!formData.traineeTisId) {
      dispatch(
        addNotification({
          type: "Error",
          text: " - No form with that Id can be found"
        })
      );
    }
  }, [dispatch, formData]);

  if (formData.traineeTisId)
    content = (
      <>
        <ScrollTo />
        <Row>
          <Col width="one-half">
            <BackLink href="/formr-a">Go back to list</BackLink>
          </Col>
          <Col style={{ textAlign: "right" }} width="one-half">
            {!canEdit && (
              <Link
                className="hide-from-print"
                data-cy="linkHowToExport"
                to={{
                  pathname: "/formr-a/howtoexport"
                }}
              >
                How to export form as PDF
              </Link>
            )}
          </Col>
        </Row>
        {canEdit === true && (
          <WarningCallout label="Confirmation" data-cy="warningConfirmation">
            <p>
              Check the information entered below is correct and click Submit at
              the bottom of the page.
            </p>
          </WarningCallout>
        )}
        <Panel label="Personal Details">
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
                Medical School Awarding Primary Qualification (name and country)
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
              <SummaryList.Value>{formData.telephoneNumber}</SummaryList.Value>
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
        </Panel>
        <Panel className="page-break" label="Declarations">
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>I confirm that</SummaryList.Key>
              <SummaryList.Value>{formData.declarationType}</SummaryList.Value>
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
                Royal College / Faculty Assessing Training for the Award of CCT
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
        </Panel>
        <Panel label="Programme">
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
        </Panel>
      </>
    );
  else content = <Redirect to="/formr-a" />;

  return <div>{content}</div>;
};

export default View;
