import { Button, Pagination } from "nhsuk-react-components";
import React from "react";
import { FormRPartB } from "../../../models/FormRPartB";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import {
  decrementFormBSection,
  updatedFormB,
  updateFormBPreviousSection
} from "../../../redux/slices/formBSlice";
import classes from "./FormRPartB.module.scss";

interface IFormRPartBPagination {
  prevSectionLabel: string;
  nextSectionLabel: string;
  values: FormRPartB;
  saveDraft: (formData: FormRPartB) => Promise<void>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  previousSection: number | null;
  isValid?: boolean;
  isSubmitting?: boolean;
}

const FormRPartBPagination = ({
  prevSectionLabel,
  nextSectionLabel,
  handleSubmit,
  values,
  saveDraft,
  previousSection,
  isValid,
  isSubmitting
}: IFormRPartBPagination) => {
  const dispatch = useAppDispatch();
  const section = useAppSelector(state => state.formB.sectionNumber);

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
            dispatch(updatedFormB(values));
            dispatch(decrementFormBSection());
          }}
          data-cy="LinkToPreviousSection"
          data-jest={section ? "LinkToPreviousSection" + (section - 1) : ""}
        >
          {prevSectionLabel.split("\n").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Pagination.Link>
      )}
      <Pagination.Link>
        <Button
          secondary
          onClick={() => saveDraft(values)}
          disabled={isSubmitting}
          data-cy="BtnSaveDraft"
        >
          Save & Exit
        </Button>
      </Pagination.Link>
      {!nextSectionLabel && (
        <Button
          onClick={() => handleSubmit()}
          disabled={!isValid && isSubmitting}
          data-cy="BtnSubmitForm"
        >
          Submit Form
        </Button>
      )}
      {previousSection && (
        <Button
          onClick={() => handleSubmit()}
          disabled={!isValid && isSubmitting}
          data-cy="BtnBackToSubmit"
        >
          Back to Submit Page
        </Button>
      )}
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
          {nextSectionLabel.split("\n").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Pagination.Link>
      )}
    </Pagination>
  );
};

export default FormRPartBPagination;
