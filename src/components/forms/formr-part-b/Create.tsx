import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import ProgressBar from "../ProgressBar";
import React from "react";
import Loading from "../../common/Loading";
import { FormRPartB } from "../../../models/FormRPartB";
import { LifeCycleState } from "../../../models/LifeCycleState";
import store from "../../../redux/store/store";
import {
  incrementFormBSection,
  resetToInitFormB,
  saveFormB,
  selectSaveBtnActive,
  updatedFormB,
  updateFormB,
  updateFormBSection
} from "../../../redux/slices/formBSlice";
import Confirm from "./sections/Confirm";
import { Redirect } from "react-router-dom";
import { FormRUtilities } from "../../../utilities/FormRUtilities";

const Create = ({ history }: { history: string[] }) => {
  const dispatch = useAppDispatch();
  const isfeatFlagCovid: boolean = useAppSelector(state =>
    state.featureFlags.featureFlags.formRPartB.covidDeclaration.valueOf()
  );
  const section: number = useAppSelector(state => state.formB.sectionNumber);
  const previousSection: number | null = useAppSelector(
    state => state.formB.previousSectionNumber
  );
  const tisId: string | undefined = useAppSelector(
    state => state.formB.formBData.traineeTisId
  );
  const saveBtnActive = useAppSelector(selectSaveBtnActive);
  const finalSections = FormRUtilities.makeFormRBSections(isfeatFlagCovid);

  const saveDraft = async (formData: FormRPartB) => {
    if (formData.lifecycleState !== LifeCycleState.Unsubmitted) {
      dispatch(
        updatedFormB({
          ...formData,
          submissionDate: null,
          lifecycleState: LifeCycleState.Draft,
          lastModifiedDate: new Date()
        })
      );
    } else
      dispatch(updatedFormB({ ...formData, lastModifiedDate: new Date() }));

    const updatedFormBData = store.getState().formB.formBData;
    if (formData.id) {
      await dispatch(updateFormB(updatedFormBData));
    } else await dispatch(saveFormB(updatedFormBData));
    const formRBStatus = store.getState().formB.status;
    if (formRBStatus === "succeeded") {
      dispatch(resetToInitFormB());
      history.push("/formr-b");
    }
  };

  const handleSectionSubmit = (formValues: FormRPartB) => {
    if (!saveBtnActive) {
      dispatch(updatedFormB(formValues));
      if (previousSection) {
        dispatch(updateFormBSection(previousSection));
      } else {
        dispatch(incrementFormBSection());
      }
    }
  };

  const sectionCompProps = {
    prevSectionLabel: section > 1 ? finalSections[section - 2].title : "",
    nextSectionLabel:
      section < finalSections.length
        ? finalSections[section].title
        : "Review & Submit",
    saveDraft,
    history: history,
    previousSection: previousSection,
    handleSectionSubmit,
    finalSections
  };

  let content;

  if (!tisId) {
    return <Redirect to="/formr-b" />;
  }

  if (section < finalSections.length + 1) {
    content = (
      <main>
        <div className="form-wrapper">
          <section>
            <ProgressBar sections={finalSections} section={section} />
            <div className="page-wrapper">
              {section < finalSections.length + 1 ? (
                React.createElement(
                  finalSections[section - 1].component,
                  sectionCompProps
                )
              ) : (
                <Loading />
              )}
            </div>
          </section>
        </div>
      </main>
    );
  } else content = <Confirm {...sectionCompProps} />;

  return <div>{content}</div>;
};

export default Create;
