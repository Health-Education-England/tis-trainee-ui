import {
  Button,
  Col,
  Container,
  Pagination,
  Row
} from "nhsuk-react-components";
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
import { StartOverButton } from "../StartOverButton";
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
    <>
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
            disabled={isSubmitting}
            data-cy="LinkToPreviousSection"
            data-jest={section ? "LinkToPreviousSection" + (section - 1) : ""}
          >
            {prevSectionLabel.split("\n").map((item, _index) => (
              <div key={item}>{item}</div>
            ))}
          </Pagination.Link>
        )}
        {nextSectionLabel && (
          <Pagination.Link
            next
            onClick={() => {
              dispatch(updateFormBPreviousSection(null));
              handleSubmit();
            }}
            disabled={!isValid || isSubmitting}
            data-cy="LinkToNextSection"
            data-jest={section ? "LinkToNextSection" + (section + 1) : ""}
          >
            {nextSectionLabel.split("\n").map((item, _index) => (
              <div key={item}>{item}</div>
            ))}
          </Pagination.Link>
        )}
      </Pagination>
      <Container>
        <Row>
          <Col width="one-quarter">
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
          </Col>
          <Col width="one-quarter">
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
              {"Save & exit"}
            </Button>
          </Col>
          <Col width="one-quarter">
            <StartOverButton />
          </Col>
          <Col width="one-quarter">
            {previousSection && (
              <Button
                onClick={(e: { preventDefault: () => void }) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                disabled={isSubmitting}
                data-cy="BtnBackToSubmit"
              >
                Back to Submit
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FormRPartBPagination;
