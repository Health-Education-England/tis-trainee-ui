import { useEffect, useState } from "react";
import { Fieldset, SummaryList } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import { Redirect } from "react-router-dom";
import style from "../Common.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { PersonalDetails } from "../../models/PersonalDetails";
import { updateGmc } from "../../redux/slices/traineeProfileSlice";
import { KeyValue } from "../../models/KeyValue";
import { DateUtilities } from "../../utilities/DateUtilities";
import { GmcDataType } from "./GmcEditForm";
import { GmcEditModal } from "./GmcEditModal";

const editableFieldLabel = "General Medical Council (GMC)";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleChangeLinkClick = () => {
    setShowModal(true);
  };

  const pd = useAppSelector(
    state => state.traineeProfile.traineeProfileData.personalDetails
  );

  const updateGmcStatus = useAppSelector(state => state.traineeProfile.status);

  const handleModalFormSubmit = async (data: GmcDataType) => {
    await dispatch(updateGmc(data.gmcNumber));
    if (updateGmcStatus === "success") {
      setShowModal(false);
    }
  };

  const handleModalFormClose = () => {
    setShowModal(false);
  };

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
  }: PersonalDetails = pd;

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
      label: editableFieldLabel,
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

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  const content = (
    <div id="profile">
      <PageTitle title="Profile" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="profileHeading"
        >
          Profile
        </Fieldset.Legend>
      </Fieldset>
      <DataSourceMsg />
      <SummaryList>
        <SummaryList.Row>
          <SummaryList.Key data-cy="fullNameKey">Full name</SummaryList.Key>
          <SummaryList.Value data-cy="fullNameValue">
            {title && `${title} `}
            {forenames && `${forenames} `}
            {surname}
          </SummaryList.Value>
          <SummaryList.Actions></SummaryList.Actions>
        </SummaryList.Row>
        {personalData?.map(pd => (
          <SummaryList.Row key={pd.label} data-cy={pd.label}>
            <SummaryList.Key data-cy={pd.label}>{pd.label}</SummaryList.Key>
            <SummaryList.Value data-cy={pd.value}>{pd.value}</SummaryList.Value>
            <SummaryList.Actions></SummaryList.Actions>
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
          <SummaryList.Actions></SummaryList.Actions>
        </SummaryList.Row>
        <div className="nhsuk-heading-m nhsuk-u-margin-top-4">
          Registration details
        </div>
        {registrationDetails?.map(
          rd =>
            rd.value && (
              <SummaryList.Row key={rd.label} data-cy={rd.label}>
                <SummaryList.Key>{rd.label}</SummaryList.Key>
                <SummaryList.Value>{rd.value}</SummaryList.Value>
                <SummaryList.Actions>
                  {rd.label === editableFieldLabel && (
                    <a
                      className="internal-link"
                      data-cy={`gmcLink-}`}
                      onClick={handleChangeLinkClick}
                    >
                      change
                    </a>
                  )}
                </SummaryList.Actions>
              </SummaryList.Row>
            )
        )}
      </SummaryList>
      <GmcEditModal
        isOpen={showModal}
        onClose={handleModalFormClose}
        onSubmit={handleModalFormSubmit}
        gmcData={gmcNumber as unknown as GmcDataType}
        warningText={"potato"}
      />
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;
