import React from "react";
import { RootState } from "../../../redux/reducers";
import { GenericOwnProps } from "../../../redux/types";
import { connect, ConnectedProps } from "react-redux";
import {
  loadFormRPartBInitialValues,
  moveToNextSection,
  moveToPreviousSection,
  loadFormRPartB
} from "../../../redux/actions/formr-partb-actions";
import { loadReferenceData } from "../../../redux/actions/reference-data-actions";
import { TraineeProfileService } from "../../../services/TraineeProfileService";
import { TraineeReferenceService } from "../../../services/TraineeReferenceService";
import Loading from "../../common/Loading";
import Section1 from "./Sections/Section1";
import Section2 from "./Sections/Section2";
import { FormRPartB } from "../../../models/FormRPartB";

const mapStateToProps = (state: RootState, ownProps: GenericOwnProps) => ({
  initialFormValues: state.newFormRPartB.formData,
  localOffices: state.referenceData.localOffices,
  curricula: state.referenceData.curricula,
  isLoaded: state.referenceData.isLoaded,
  section: state.newFormRPartB.section,
  history: ownProps.history,
  location: ownProps.location
});

const mapDispatchProps = {
  loadFormRPartBInitialValues,
  loadReferenceData,
  loadFormRPartB,
  moveToNextSection,
  moveToPreviousSection
};

const connector = connect(mapStateToProps, mapDispatchProps);

class Create extends React.PureComponent<ConnectedProps<typeof connector>> {
  componentDidMount() {
    this.props.loadFormRPartBInitialValues(new TraineeProfileService());
    this.props.loadReferenceData(new TraineeReferenceService());
  }

  nextSection = (formData: FormRPartB | null) => {
    this.props.moveToNextSection(formData);
  };

  previousSection = (formData: FormRPartB | null) => {
    this.props.moveToPreviousSection(formData);
  };

  submitForm = (formData: FormRPartB | null) => {
    this.props.loadFormRPartB(formData);
  };

  render() {
    const {
      initialFormValues,
      localOffices,
      curricula,
      isLoaded,
      section
    } = this.props;

    if (!isLoaded || !initialFormValues) {
      return <Loading />;
    } else {
      const formData = this.props.location.formData || initialFormValues;

      if (localOffices.length > 0) {
        if (!localOffices.some(l => l.label === formData.localOfficeName)) {
          formData.localOfficeName = "";
        }

        if (!localOffices.some(l => l.label === formData.prevRevalBody)) {
          formData.prevRevalBody = "";
        }
      }

      if (
        curricula.length > 0 &&
        !curricula.some(l => l.label === formData.programmeSpecialty)
      ) {
        formData.programmeSpecialty = "";
      }

      switch (section) {
        case 1:
          return (
            <Section1
              localOffices={localOffices}
              curricula={curricula}
              formData={formData}
              nextSection={this.nextSection}
            ></Section1>
          );
        case 2:
          return (
            <Section2
              formData={formData}
              previousSection={this.previousSection}
              submitForm={this.submitForm}
              history={this.props.history}
            ></Section2>
          );

        default:
          return <Loading />;
      }
    }
  }
}

export default connector(Create);
