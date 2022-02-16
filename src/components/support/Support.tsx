import { Details, Panel } from "nhsuk-react-components";
import PageTitle from "../common/PageTitle";
import SupportMsg from "./SupportMsg";
import SupportList from "./SupportList";
import { localOfficeContacts } from "../../models/LocalOfficeContacts";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import Loading from "../common/Loading";
import { useEffect, useState } from "react";

const Support = () => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);

  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const personOwner = traineeProfileData.personalDetails?.personOwner;

  const [mappedContact, setIsMappedContact] = useState("");

  useEffect(() => {
    if (personOwner) {
      for (const localOffice of localOfficeContacts) {
        if (localOffice.name === personOwner) {
          setIsMappedContact(localOffice.contact);
        }
      }
    }
  }, [personOwner]);

  let content;
  if (traineeProfileDataStatus === "loading") return <Loading />;
  else if (traineeProfileDataStatus === "succeeded")
    content = (
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
              we currrently hold for you then please click on the link provided
              in the Contact section.
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
              more suitable, then please choose an alternative from the
              drop-down list.
            </p>
          </Details.Text>
        </Details>

        <Panel label="Contact">
          <SupportMsg personOwner={personOwner} mappedContact={mappedContact} />
          <SupportList mappedContact={mappedContact} />
        </Panel>
      </>
    );

  return <div>{content}</div>;
};

export default Support;
