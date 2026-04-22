import { useEffect, useState } from "react";
import { Fieldset, SummaryList } from "nhsuk-react-components";
import { Button } from "@aws-amplify/ui-react";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import DataSourceMsg from "../common/DataSourceMsg";
import style from "../Common.module.scss";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import { PersonalDetails } from "../../models/PersonalDetails";
import { updateEmail, updateGmc } from "../../redux/slices/traineeProfileSlice";
import { KeyValue } from "../../models/KeyValue";
import { DateUtilities } from "../../utilities/DateUtilities";
import { GmcDataType } from "./GmcEditForm";
import { GmcEditModal } from "./GmcEditModal";
import Loading from "../common/Loading";
import { EmailDataType } from "./EmailEditForm";
import { EmailEditModal } from "./EmailEditModal";

const gmcFieldLabel = "General Medical Council (GMC)";
const emailFieldLabel = "Email";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [showGmcModal, setShowGmcModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const handleGmcChangeClick = () => {
    setShowGmcModal(true);
  };
  const handleEmailChangeClick = () => {
    setShowEmailModal(true);
  };

  const pd = useAppSelector(
    state => state.traineeProfile.traineeProfileData.personalDetails
  );

  const userFeatures = useAppSelector(state => state.user.features);

  const handleGmcModalSubmit = (data: GmcDataType) => {
    setShowGmcModal(false);
    dispatch(updateGmc(data.gmcNumber));
  };

  const handleGmcModalClose = () => {
    setShowGmcModal(false);
  };

  const handleEmailModalSubmit = (data: EmailDataType) => {
    setShowEmailModal(false);
    dispatch(updateEmail(data.email));
  };

  const handleEmailModalClose = () => {
    setShowEmailModal(false);
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
    { label: emailFieldLabel, value: email },
    { label: "Telephone", value: telephoneNumber },
    { label: "Mobile", value: mobileNumber }
  ];

  enum FieldType {
    ReadOnly,
    Editable
  }

  interface FieldKeyValue extends KeyValue {
    type: FieldType;
  }

  const registrationDetails: FieldKeyValue[] = [
    {
      label: gmcFieldLabel,
      value: gmcNumber,
      type: userFeatures.details.profile.gmcUpdate.enabled
        ? FieldType.Editable
        : FieldType.ReadOnly
    },
    {
      label: "General Dental Council (GDC)",
      value: gdcNumber,
      type: FieldType.ReadOnly
    },
    {
      label: "Public Health Number",
      value: publicHealthNumber,
      type: FieldType.ReadOnly
    },
    {
      label: "GMC status",
      value: gmcStatus,
      type: FieldType.ReadOnly
    },
    {
      label: "GDC status",
      value: gdcStatus,
      type: FieldType.ReadOnly
    },
    { label: "Permit to Work", value: permitToWork, type: FieldType.ReadOnly },
    { label: "Settled", value: settled, type: FieldType.ReadOnly },
    { label: "Visa Issued", value: visaIssued, type: FieldType.ReadOnly },
    { label: "Details/Number", value: detailsNumber, type: FieldType.ReadOnly }
  ];

  useEffect(() => {
    dispatch(resetMfaJourney());
  }, [dispatch]);

  const isLoading: boolean = useAppSelector(
    state =>
      state.traineeProfile.gmcStatus === "loading" ||
      state.traineeProfile.emailStatus === "loading"
  );

  if (isLoading) {
    return <Loading />;
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
            <SummaryList.Key data-cy={`${pd.label}-key`}>
              {pd.label}
            </SummaryList.Key>
            <SummaryList.Value data-cy={`${pd.label}-value`}>
              {pd.value}
            </SummaryList.Value>
            <SummaryList.Actions>
              {pd.label === emailFieldLabel && (
                <Button
                  data-cy="updateEmailBtn"
                  onClick={handleEmailChangeClick}
                >
                  change
                </Button>
              )}
            </SummaryList.Actions>
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
              <SummaryList.Row key={rd.label}>
                <SummaryList.Key data-cy={`${rd.label}-key`}>
                  {rd.label}
                </SummaryList.Key>
                <SummaryList.Value data-cy={`${rd.label}-value`}>
                  {rd.value}
                </SummaryList.Value>
                <SummaryList.Actions>
                  {rd.type === FieldType.Editable &&
                    rd.label === gmcFieldLabel && (
                      <Button
                        data-cy={`updateGmcBtn`}
                        onClick={handleGmcChangeClick}
                      >
                        change
                      </Button>
                    )}
                </SummaryList.Actions>
              </SummaryList.Row>
            )
        )}
      </SummaryList>
      <GmcEditModal
        isOpen={showGmcModal}
        onClose={handleGmcModalClose}
        onSubmit={handleGmcModalSubmit}
      />
      <EmailEditModal
        isOpen={showEmailModal}
        onClose={handleEmailModalClose}
        onSubmit={handleEmailModalSubmit}
      />
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;
