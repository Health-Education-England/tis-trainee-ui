import { ActionLink, Card, Details } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import SupportMsg from "./SupportMsg";
import SupportList from "./SupportList";
import { localOfficeContacts } from "../../models/LocalOfficeContacts";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { useEffect, useState } from "react";
import { dispatchCojNotif } from "../../utilities/CojUtilities";
import { resetNotifications } from "../../redux/slices/notificationsSlice";
import store from "../../redux/store/store";

const Support = () => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  const personOwner = traineeProfileData.personalDetails?.personOwner;
  const gmcNo = traineeProfileData.personalDetails?.gmcNumber;
  const tisId = traineeProfileData.traineeTisId;
  const emailIds = gmcNo
    ? `GMC no. ${gmcNo}, TIS ID ${tisId}`
    : `TIS ID ${tisId}`;
  const [mappedContact, setIsMappedContact] = useState("");

  useEffect(() => {
    dispatchCojNotif();
    if (personOwner) {
      for (const localOffice of localOfficeContacts) {
        if (localOffice.name === personOwner) {
          setIsMappedContact(localOffice.contact);
        }
      }
    }
    return () => {
      store.dispatch(resetNotifications());
    };
  }, [personOwner]);

  const content = (
    <>
      <PageTitle title="Support" />
      <h1 data-cy="pageTitle" style={{ marginBottom: 16, color: "#005EB8" }}>
        Support
      </h1>
      <Details>
        <Details.Summary>Got a question?</Details.Summary>
        <Details.Text>
          <p>
            If you have a query about completing the Form R or the information
            we currently hold for you then please click on the link provided in
            the Contact section.
          </p>
          <p>
            Clicking on the link will either give you an email address to use
            or, if you are based in London and South East, forward you to the
            PGMDE Support Portal to submit your query.
          </p>
          <p>
            Based on your current information, this link should direct your
            query to someone best placed to help you.
          </p>
          <p>
            However, if you feel another contact than the one given would be
            more suitable, then please choose an alternative from the drop-down
            list.
          </p>
        </Details.Text>
      </Details>
      <Card feature data-cy="loSupportLabel">
        <Card.Content>
          <Card.Heading>
            Form R (including unsubmitting a form) & Personal Details queries
          </Card.Heading>
          <SupportMsg personOwner={personOwner} mappedContact={mappedContact} />
          <SupportList mappedContact={mappedContact} emailIds={emailIds} />
        </Card.Content>
      </Card>
      <Card feature data-cy="techSupportLabel">
        <Card.Content>
          <Card.Heading>Technical issues</Card.Heading>
          <ActionLink
            data-cy="techSupportLink"
            href={`mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (${emailIds})`}
          >
            Please click here to email TIS Support
          </ActionLink>
        </Card.Content>
      </Card>
    </>
  );
  return <div>{content}</div>;
};

export default Support;
