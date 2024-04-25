import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import ProgressBar from "../../../components/forms/ProgressBar";
import React from "react";
import Loading from "../../common/Loading";
import { FormRPartB } from "../../../models/FormRPartB";
import {
  incrementFormBSection,
  selectSaveBtnActive,
  updatedFormB,
  updateFormBSection
} from "../../../redux/slices/formBSlice";
import Confirm from "./sections/Confirm";
import { Redirect } from "react-router-dom";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import store from "../../../redux/store/store";

const Create = ({ history }: { history: string[] }) => {
  const dispatch = useAppDispatch();
  const isfeatFlagCovid: boolean = useAppSelector(state =>
    state.featureFlags.featureFlags.formRPartB.covidDeclaration.valueOf()
  );
  const section: number = useAppSelector(state => state.formB.sectionNumber);
  const previousSection: number | null = useAppSelector(
    state => state.formB.previousSectionNumber
  );
  const formBData: FormRPartB | undefined = useAppSelector(
    state => state.formB.formData
  );
  const { traineeTisId: tisId, haveCovidDeclarations } = formBData;
  const saveBtnActive = useAppSelector(selectSaveBtnActive);
  const finalSections = FormRUtilities.makeFormRBSections(
    isfeatFlagCovid,
    haveCovidDeclarations
  );

  const handleSectionSubmit = (formValues: FormRPartB) => {
    const lastSavedFormData = store.getState().formB.formData;
    if (!saveBtnActive) {
      dispatch(
        updatedFormB({
          ...formValues,
          id: lastSavedFormData?.id,
          lastModifiedDate: lastSavedFormData?.lastModifiedDate,
          lifecycleState: lastSavedFormData.lifecycleState,
          traineeTisId: lastSavedFormData?.traineeTisId
        })
      );
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
