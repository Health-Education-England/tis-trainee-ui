import React, { FormEvent } from "react";
import { Button, Pagination } from "nhsuk-react-components";
import SubmitButton from "../../SubmitButton";
import { FormRPartB } from "../../../../models/FormRPartB";
import classes from "../FormRPartB.module.scss";

interface Props {
  values: FormRPartB;
  previousSection: (v: FormRPartB, prevSection?: number) => void;
  handleSubmit: (e?: FormEvent<HTMLFormElement> | undefined) => void;
  saveDraft: (v: FormRPartB) => void;
  section: number;
  prevSectionLabel?: string;
  nextSectionLabel?: string;
  continueToSubmit?: boolean;
}

const FormRPartBPagination: React.FC<Props> = (props: Props) => {
  const {
    values,
    nextSectionLabel,
    prevSectionLabel,
    section,
    continueToSubmit
  } = props;

  const paginationClasses = [
    classes.heePagination,
    section === 0 ? classes.twoCol : null
  ]
    .filter(c => c)
    .join(" ");
  return (
    <Pagination className={paginationClasses}>
      {prevSectionLabel ? (
        <Pagination.Link
          previous
          onClick={() => props.previousSection(values, section && section - 1)}
          data-cy="LinkToPreviousSection"
          data-jest={section ? "LinkToPreviousSection" + (section - 1) : ""}
        >
          {prevSectionLabel.split("\n").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Pagination.Link>
      ) : null}

      <Pagination.Link>
        <SubmitButton
          clickHandler={() => props.saveDraft(values)}
          type="button"
          data-cy="BtnSaveDraft"
          label="Save & Exit"
        />
      </Pagination.Link>

      {continueToSubmit ? (
        <Pagination.Link onClick={() => props.handleSubmit()}>
          <Button type="submit" data-cy="BtnContinue">
            Continue to submit
          </Button>
        </Pagination.Link>
      ) : null}

      {nextSectionLabel ? (
        <Pagination.Link
          next
          onClick={() => props.handleSubmit()}
          data-cy="LinkToNextSection"
          data-jest={section ? "LinkToNextSection" + (section + 1) : ""}
        >
          {nextSectionLabel.split("\n").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </Pagination.Link>
      ) : null}
    </Pagination>
  );
};

export default FormRPartBPagination;
