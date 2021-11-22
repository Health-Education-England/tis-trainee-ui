import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Details, Panel } from "nhsuk-react-components";
import { localOfficeContacts } from "../../models/LocalOfficeContacts";
import { loadTraineeProfile } from "../../redux/actions/trainee-profile-actions";
import { RootState } from "../../redux/reducers";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import Loading from "../common/Loading";
import PageTitle from "../common/PageTitle";
import { SupportList } from "./SupportList";
import { SupportMsg } from "./SupportMsg";

const mapStateToProps = (state: RootState) => ({
  traineeProfile: state.profile.traineeProfile,
  isLoaded: state.profile.isLoaded
});

const mapDispatchToProps = {
  loadTraineeProfile
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type profileProps = ConnectedProps<typeof connector>;
interface LocalState {
  contact: string;
  dataError: boolean;
  matchError: boolean;
  personOwner: string | null | undefined;
}
export class Support extends React.PureComponent<profileProps, LocalState> {
  constructor(props: profileProps) {
    super(props);
    this.state = {
      contact: "",
      dataError: false,
      matchError: false,
      personOwner: ""
    };
  }

  fetchTraineeProfileProps = () =>
    this.props.loadTraineeProfile(new TraineeProfileService());

  fetchPersonOwner = () => {
    return this.props.traineeProfile?.personalDetails?.personOwner;
  };

  findMappedContact(loadedPersonOwner: string | null | undefined) {
    for (const localOffice of localOfficeContacts) {
      if (localOffice.name === loadedPersonOwner) {
        return localOffice.contact;
      }
    }
    return null;
  }

  async componentDidMount() {
    await this.fetchTraineeProfileProps();
    const fetchedPersonOwner = this.fetchPersonOwner();
    if (!fetchedPersonOwner) {
      this.setState({ dataError: true });
      return;
    }
    this.setState({ personOwner: fetchedPersonOwner });
    const mappedContact = this.findMappedContact(fetchedPersonOwner);
    if (mappedContact) {
      this.setState({ contact: mappedContact });
    } else this.setState({ matchError: true });
  }

  render() {
    const { traineeProfile, isLoaded } = this.props;
    const { contact, dataError, matchError, personOwner } = this.state;

    if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        traineeProfile && (
          <>
            <PageTitle title="Support" />
            <h1 style={{ marginBottom: 16, color: "#005EB8" }}>Support</h1>
            <Details>
              <Details.Summary>Got a question?</Details.Summary>
              <Details.Text>
                <p>
                  If you have a query about completing the Form R or the
                  information we currrently hold for you then please click on
                  the link provided in the Contact section.
                </p>
                <p>
                  Clicking on the link will either give you an email address to
                  use or, if you are based in London and South East, forward you
                  to the PGMDE Support Portal to submit your query.
                </p>
                <p>
                  Based on your current information, this link should direct
                  your query to someone best placed to help you.
                </p>
                <p>
                  However, if you feel another contact than the one given would
                  be more suitable, then please choose an alternative from the
                  drop-down list.
                </p>
              </Details.Text>
            </Details>

            <Panel label="Contact">
              <SupportMsg
                dataError={dataError}
                matchError={matchError}
                personOwner={personOwner}
              />
              <SupportList contact={contact} />
            </Panel>
          </>
        )
      );
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Support);
