import { Button, WarningCallout } from "nhsuk-react-components";
import { Redirect } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks/hooks";
import {
  selectSavedFormB,
  updateFormBSection,
  updateFormBPreviousSection
} from "../../../../redux/slices/formBSlice";
import store from "../../../../redux/store/store";
import ScrollTo from "../../ScrollTo";
import classes from "../FormRPartB.module.scss";
import FormSavePDF from "../../FormSavePDF";

import ViewSection1 from "./ViewSection1";
import ViewSection2 from "./ViewSection2";
import ViewSection3 from "./ViewSection3";
import ViewSection4 from "./ViewSection4";
import ViewSection5 from "./ViewSection5";
import ViewSection6 from "./ViewSection6";
import ViewSection7 from "./ViewSection7";
import ViewSection8 from "./ViewSection8";
import { DateUtilities } from "../../../../utilities/DateUtilities";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";

interface IView {
  canEdit: boolean;
  history: any;
}

const View = ({ canEdit, history }: IView) => {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectSavedFormB);
  const enableCovidDeclaration = useAppSelector(state =>
    state.featureFlags.featureFlags.formRPartB.covidDeclaration.valueOf()
  );
  const viewCompSection: number = store.getState().formB.sectionNumber;
  let content;

  const makeSectionEditButton = (section: number) => {
    return (
      canEdit && (
        <Button
          type="button"
          className={classes.sectionEditButton}
          onClick={() => {
            dispatch(updateFormBPreviousSection(viewCompSection));
            dispatch(updateFormBSection(section));
          }}
          data-cy={`BtnEditSection${section}`}
        >
          Edit
        </Button>
      )
    );
  };

  const viewSectionProps = { makeSectionEditButton, formData };

  if (formData.traineeTisId)
    content = (
      <>
        <ScrollTo />
        {!canEdit && <FormSavePDF history={history} formrPath={"/formr-b"} />}
        {!!canEdit && (
          <WarningCallout data-jest="warningConfirmation">
            <WarningCallout.Label visuallyHiddenText={false}>
              Confirmation
            </WarningCallout.Label>
            <p>
              Check the information entered below is correct, complete the
              Declarations, then click Submit at the bottom of the page.
            </p>
          </WarningCallout>
        )}
        {FormRUtilities.displaySubmissionDate(formData.submissionDate)}
        <ViewSection1 {...viewSectionProps} />
        <ViewSection2 {...viewSectionProps} />
        <ViewSection3 {...viewSectionProps} />
        <ViewSection4 {...viewSectionProps} />
        <ViewSection5 {...viewSectionProps} />
        <ViewSection6 {...viewSectionProps} />
        {enableCovidDeclaration ? <ViewSection7 {...viewSectionProps} /> : null}
        {!canEdit && <ViewSection8 {...viewSectionProps} />}
        {FormRUtilities.displaySubmissionDate(formData.submissionDate)}
      </>
    );
  else content = <Redirect to="/formr-b" />;

  return <div>{content}</div>;
};

export default View;
