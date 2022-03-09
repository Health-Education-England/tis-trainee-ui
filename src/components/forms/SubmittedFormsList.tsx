import { ActionLink, Hint, LedeText, Table } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import { LifeCycleState } from "../../models/LifeCycleState";
import { DateUtilities } from "../../utilities/DateUtilities";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import styles from "./FormR.module.scss";

interface ISubmittedFormsList {
  formRList: IFormR[];
  path: string;
  history: string[];
}

const SubmittedFormsList = ({
  formRList,
  path,
  history
}: ISubmittedFormsList) => {
  const submittedForms: IFormR[] = formRList.filter(
    (form: IFormR) => form.lifecycleState === LifeCycleState.Submitted
  );
  let content: JSX.Element | JSX.Element[];
  if (submittedForms.length > 0) {
    content = submittedForms.map((formData: IFormR) => (
      <Table.Row key={formData.id} className={styles.listTableRow}>
        <td>
          <ActionLink
            onClick={() =>
              FormRUtilities.handleRowClick(formData.id!, path, history)
            }
            data-cy="submittedForm"
          >
            form submitted on{" "}
            {DateUtilities.ToLocalDate(formData.submissionDate)}
          </ActionLink>
        </td>
      </Table.Row>
    ));
  } else
    content = (
      <LedeText data-cy="noSubmittedFormsMsg">No forms submitted yet.</LedeText>
    );
  return (
    <>
      {submittedForms.length > 0 ? (
        <Hint data-cy="formsTrueHint">
          To save a PDF copy of your submitted form, please click on a form
          below and then click the <b>Save a copy as a PDF</b> button at the top
          of that page.
        </Hint>
      ) : (
        <Hint data-cy="formsFalseHint">
          After you submit your completed form, instructions on how to{" "}
          <b>save a copy as a PDF</b> will appear here.
        </Hint>
      )}
      <Table>
        <Table.Head>
          <Table.Row>
            <td>
              <b>Submitted forms</b>
            </td>
          </Table.Row>
        </Table.Head>
        <Table.Body>{content}</Table.Body>
      </Table>
    </>
  );
};

export default SubmittedFormsList;
