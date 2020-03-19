import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { fetchTraineeProfile } from "../../redux/actions/personActions";
import { RootState } from "../../redux/types";
import PersonalDetailsComponent from "./personal-details/PersonalDetails";
import Programmes from "./programmes/Programmes";
import Placements from "./placements/Placements";

const mapStateToProps = (state: RootState) => ({
  traineeProfile: state.persons.traineeProfile,
  isLoaded: state.persons.isLoaded,
  error: state.persons.error
});

const mapDispatchToProps = {
  fetchTraineeProfile: fetchTraineeProfile
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type profileProps = ConnectedProps<typeof connector>;

class Profile extends React.PureComponent<profileProps> {
  componentDidMount() {
    this.props.fetchTraineeProfile();
  }

  render() {
    const { traineeProfile, isLoaded, error } = this.props;

    if (error) {
      return <div>Error: Failed to load data</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        traineeProfile && (
          <div className="nhsuk-width-container">
            <PersonalDetailsComponent
              personalDetails={traineeProfile.personalDetails}
            />
            <Placements placements={traineeProfile.placements}></Placements>
            <Programmes
              programmeMemberships={traineeProfile.programmeMemberships}
            ></Programmes>
          </div>
        )
      );
    }
  }
}

export default connector(Profile);
