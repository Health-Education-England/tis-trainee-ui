import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { loadTraineeProfile } from "../../redux/actions/trainee-profile-actions";
import { RootState } from "../../redux/types";
import PersonalDetailsComponent from "./personal-details/PersonalDetailsComponent";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";
import Loading from "../common/Loading";
import { Fieldset, Details } from "nhsuk-react-components";
import { TraineeProfileService } from "../../services/TraineeProfileService";
import ScrollTo from "../forms/ScrollTo";
import PageTitle from "../common/PageTitle";

const mapStateToProps = (state: RootState) => ({
  traineeProfile: state.profile.traineeProfile,
  isLoaded: state.profile.isLoaded
});

const mapDispatchToProps = {
  loadTraineeProfile
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type profileProps = ConnectedProps<typeof connector>;

class Profile extends React.PureComponent<profileProps> {
  componentDidMount() {
    this.props.loadTraineeProfile(new TraineeProfileService());
  }

  render() {
    const { traineeProfile, isLoaded } = this.props;

    if (!isLoaded) {
      return <Loading />;
    } else {
      return (
        traineeProfile && (
          <div id="profile">
            <PageTitle title="Profile" />
            <ScrollTo />
            <Fieldset>
              <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
                Profile
              </Fieldset.Legend>
            </Fieldset>
            <Details.ExpanderGroup>
              <PersonalDetailsComponent
                personalDetails={traineeProfile.personalDetails}
              />
              <Placements placements={traineeProfile.placements}></Placements>
              <Programmes
                programmeMemberships={traineeProfile.programmeMemberships}
              ></Programmes>
            </Details.ExpanderGroup>
          </div>
        )
      );
    }
  }
}

export default connector(Profile);
