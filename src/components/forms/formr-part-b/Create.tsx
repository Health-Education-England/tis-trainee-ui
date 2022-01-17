import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import Section1 from "./sections/Section1";
import Section2 from "./sections/Section2";
import Section3 from "./sections/Section3";
import Section4 from "./sections/Section4";
import Section5 from "./sections/Section5";
import Section6 from "./sections/Section6";
import CovidDeclaration from "./sections/CovidDeclaration";
import "../formr-part-b/sections/section-styles.scss";
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
import { fetchForms } from "../../../redux/slices/formsSlice";
import Confirm from "./sections/Confirm";
import { Redirect } from "react-router-dom";

export interface ISection {
  component: any;
  title: string;
}

const sections: ISection[] = [
  {
    component: Section1,
    title: "Section 1:\nDoctor's details"
  },

  {
    component: Section2,
    title: "Section 2:\nWhole Scope of Practice"
  },

  {
    component: Section3,
    title: "Section 3:\nDeclarations relating to\nGood Medical Practice"
  },
  {
    component: Section4,
    title: "Section 4:\nUpdate to your last Form R"
  },
  {
    component: Section5,
    title: "Section 5:\nNew Declarations\nsince your last Form R"
  },
  {
    component: Section6,
    title: "Section 6:\nCompliments"
  }
];

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

  // TODO needs moving out of Create
  let finalSections: ISection[];
  if (isfeatFlagCovid) {
    finalSections = [
      ...sections.slice(0, 6),
      { component: CovidDeclaration, title: "Covid declaration" },
      ...sections.slice(6)
    ];
  } else finalSections = sections;
  const makeProgressBar = () => {
    return finalSections.map((_sect, index) => (
      <div
        key={index}
        className={
          section === index + 1
            ? "progress-step progress-step-active"
            : "progress-step"
        }
      ></div>
    ));
  };

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
    dispatch(resetToInitFormB());
    dispatch(fetchForms("/formr-b"));
    history.push("/formr-b");
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
            <div className="progressbar">{makeProgressBar()}</div>
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
