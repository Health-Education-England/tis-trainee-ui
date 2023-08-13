import { Button, Pagination } from "nhsuk-react-components";
import React from "react";
import { FormRPartB } from "../../../models/FormRPartB";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  decrementFormBSection,
  updatedFormB,
  updateFormBPreviousSection,
  updatesaveBtnActive
} from "../../../redux/slices/formBSlice";
import { IProgSection } from "../../../models/IProgressSection";
import classes from "./FormRPartB.module.scss";
import { saveDraftForm } from "../../../utilities/FormBuilderUtilities";
import history from "../../navigation/history";
interface IFormRPartBPagination {
  prevSectionLabel: string;
  nextSectionLabel: string;
  values: FormRPartB;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  previousSection: number | null;
  isValid?: boolean;
  isSubmitting?: boolean;
  finalSections?: IProgSection[];
  resetForm?: any;
}

const FormRPartBPagination = ({
  prevSectionLabel,
  nextSectionLabel,
  handleSubmit,
  values,
  previousSection,
  isValid,
  isSubmitting,
  finalSections,
  resetForm
}: IFormRPartBPagination) => {
  const dispatch = useAppDispatch();
  const section = useAppSelector(state => state.formB.sectionNumber);
  const isAutosaving =
    useAppSelector(state => state.formB.autosaveStatus) === "saving";

  const paginationClasses = [
    classes.heePagination,
    section === 1 ? classes.twoCol : null
  ]
    .filter(c => c)
    .join(" ");

  return (
    <Pagination className={paginationClasses}>
      {prevSectionLabel && (
        <Pagination.Link
          previous
          onClick={() => {
            if (!finalSections?.length) {
              dispatch(updatedFormB(values));
            }
            dispatch(decrementFormBSection());
            dispatch(updateFormBPreviousSection(null));
          }}
          data-cy="LinkToPreviousSection"
          data-jest={section ? "LinkToPreviousSection" + (section - 1) : ""}
        >
          {prevSectionLabel.split("\n").map((item, _index) => (
            <div key={item}>{item}</div>
          ))}
        </Pagination.Link>
      )}
      <Pagination.Link>
        <Button
          secondary
          onClick={(e: { preventDefault: () => void }) => {
            e.preventDefault();
            if (section === 8) {
              resetForm();
            }
            dispatch(updatesaveBtnActive());
            saveDraftForm("formB", values, history);
          }}
          disabled={isSubmitting}
          data-cy="BtnSaveDraft"
        >
          Save for later
        </Button>
      </Pagination.Link>
      <Pagination.Link>
        {!nextSectionLabel && (
          <Button
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleSubmit();
            }}
            disabled={!isValid || isSubmitting || isAutosaving}
            data-cy="BtnSubmitForm"
          >
            Submit Form
          </Button>
        )}
      </Pagination.Link>
      <Pagination.Link>
        {previousSection && (
          <Button
            onClick={(e: { preventDefault: () => void }) => {
              e.preventDefault();
              handleSubmit();
            }}
            data-cy="BtnBackToSubmit"
          >
            Back to Submit
          </Button>
        )}
      </Pagination.Link>
      {nextSectionLabel && (
        <Pagination.Link
          next
          onClick={() => {
            dispatch(updateFormBPreviousSection(null));
            handleSubmit();
          }}
          data-cy="LinkToNextSection"
          data-jest={section ? "LinkToNextSection" + (section + 1) : ""}
        >
          {nextSectionLabel.split("\n").map((item, _index) => (
            <div key={item}>{item}</div>
          ))}
        </Pagination.Link>
      )}
    </Pagination>
  );
};

export default FormRPartBPagination;
