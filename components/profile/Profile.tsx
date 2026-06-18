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
import { updateGmc } from "../../redux/slices/traineeProfileSlice";
import { KeyValue } from "../../models/KeyValue";
import { DateUtilities } from "../../utilities/DateUtilities";
import { GmcDataType } from "./GmcEditForm";
import { GmcEditModal } from "./GmcEditModal";
import Loading from "../common/Loading";

const gmcFieldLabel = "General Medical Council (GMC)";

const Profile = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleChangeLinkClick = () => {
    setShowModal(true);
  };

  const pd = useAppSelector(
    state => state.traineeProfile.traineeProfileData.personalDetails
  );

  const userFeatures = useAppSelector(state => state.user.features);

  const handleModalFormSubmit = (data: GmcDataType) => {
    setShowModal(false);
    dispatch(updateGmc(data.gmcNumber));
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
    state => state.traineeProfile.gmcStatus === "loading"
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
                  {rd.type === FieldType.Editable &&
                    rd.label === gmcFieldLabel && (
                      <Button
                        className="internal-link"
                        data-cy={`updateGmcLink`}
                        onClick={handleChangeLinkClick}
                        variation="link"
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
        isOpen={showModal}
        onClose={handleModalFormClose}
        onSubmit={handleModalFormSubmit}
      />
    </div>
  );
  return <div>{content}</div>;
};

export default Profile;
