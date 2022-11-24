import React from "react";
import { PersonalDetails } from "../../../models/PersonalDetails";
import { SummaryList, Details } from "nhsuk-react-components";
import { KeyValue } from "../../../models/KeyValue";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";

const PersonalDetailsComponent: React.FC = () => {
  const {
    maidenName,
    knownAs,
    gender,
    dateOfBirth,
    email,
    telephoneNumber,
    mobileNumber,
    gmcNumber,
    gdcNumber,
    publicHealthNumber,
    gmcStatus,
    gdcStatus,
    permitToWork,
    settled,
    visaIssued,
    detailsNumber,
    title,
    forenames,
    surname,
    address1,
    address2,
    address3,
    postCode
  }: PersonalDetails = useAppSelector(selectTraineeProfile).personalDetails;
  const personalData: KeyValue[] = [
    { label: "Maiden name", value: maidenName },
    { label: "Known As", value: knownAs },
    { label: "Gender", value: gender },
    {
      label: "Date of birth",
      value: DateUtilities.ToLocalDate(dateOfBirth)
    },
    { label: "Email", value: email },
    { label: "Telephone", value: telephoneNumber },
    { label: "Mobile", value: mobileNumber }
  ];

  const registrationDetails: KeyValue[] = [
    {
      label: "General Medical Council (GMC)",
      value: gmcNumber
    },
    {
      label: "General Dental Council (GDC)",
      value: gdcNumber
    },
    {
      label: "Public Health Number",
      value: publicHealthNumber
    },
    {
      label: "GMC status",
      value: gmcStatus
    },
    {
      label: "GDC status",
      value: gdcStatus
    },
    { label: "Permit to Work", value: permitToWork },
    { label: "Settled", value: settled },
    { label: "Visa Issued", value: visaIssued },
    { label: "Details/Number", value: detailsNumber }
  ];

  return (
    <Details expander data-cy="personalDetailsExpander">
      <Details.Summary>Personal details</Details.Summary>
      <Details.Text>
        <SummaryList>
          <SummaryList.Row>
            <SummaryList.Key data-cy="fullNameKey">Full name</SummaryList.Key>
            <SummaryList.Value data-cy="fullNameValue">
              {title && title} {forenames && forenames} {surname}
            </SummaryList.Value>
          </SummaryList.Row>
          {personalData &&
            personalData.map(pd => (
              <SummaryList.Row key={pd.label} data-cy={pd.label}>
                <SummaryList.Key data-cy={pd.label}>{pd.label}</SummaryList.Key>
                <SummaryList.Value data-cy={pd.value}>
                  {pd.value}
                </SummaryList.Value>
              </SummaryList.Row>
            ))}

          <SummaryList.Row>
            <SummaryList.Key>Address</SummaryList.Key>
            <SummaryList.Value>
              <p>{address1}</p>
              <p>{address2}</p>
              <p>{address3}</p>
              <p data-cy="postCode">{postCode}</p>
            </SummaryList.Value>
          </SummaryList.Row>
          <div className="nhsuk-heading-m nhsuk-u-margin-top-4">
            Registration details
          </div>
          {registrationDetails &&
            registrationDetails.map(
              rd =>
                rd.value && (
                  <SummaryList.Row key={rd.label} data-cy={rd.label}>
                    <SummaryList.Key>{rd.label}</SummaryList.Key>
                    <SummaryList.Value>{rd.value}</SummaryList.Value>
                  </SummaryList.Row>
                )
            )}
        </SummaryList>
      </Details.Text>
    </Details>
  );
};

export default PersonalDetailsComponent;
