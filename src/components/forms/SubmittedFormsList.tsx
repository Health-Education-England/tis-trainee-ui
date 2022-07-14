import {
  ActionLink,
  Hint,
  Table,
  WarningCallout
} from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import {
  DateUtilities,
  DateType,
  isWithinRange
} from "../../utilities/DateUtilities";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import styles from "./FormR.module.scss";

interface ISubmittedFormsList {
  formRList: IFormR[];
  path: string;
  history: string[];
  latestSubDate: DateType;
}

const SubmittedFormsList = ({
  formRList,
  path,
  history,
  latestSubDate
}: ISubmittedFormsList) => {
  let content: JSX.Element | JSX.Element[];

  if (formRList.length) {
    content = formRList.map((formData: IFormR) => (
      <Table.Row key={formData.id} className={styles.listTableRow}>
        <td>
          <ActionLink
            onClick={() =>
              FormRUtilities.handleRowClick(formData.id!, path, history)
            }
            data-cy="submittedForm"
          >
            form submitted on{" "}
            {DateUtilities.ToLocalDateTime(formData.submissionDate)}
          </ActionLink>
        </td>
      </Table.Row>
    ));
  } else
    content = (
      <Table.Row>
        <td>
          <p data-cy="noSubmittedFormsMsg">No forms submitted yet.</p>
        </td>
      </Table.Row>
    );
  return (
    <>
      {formRList.length ? (
        <>
          <Hint data-cy="formsTrueHint">
            To save a PDF copy of your submitted form, please click on a form
            below and then click the <b>Save a copy as a PDF</b> button at the
            top of that page.
          </Hint>
          <WarningCallout label="Important!" data-cy="formsListWarning">
            {isWithinRange(latestSubDate, 31, "d") && (
              <p>
                Your previous form was submitted recently on{" "}
                {DateUtilities.ToLocalDateTime(latestSubDate)}.
              </p>
            )}
            <h4>Need to amend a recently-submitted form?</h4>
            <p>
              Please click the <b>Support</b> link (menu or footer link) to
              contact your Local Office. They will put the specified form back
              into an 'unsubmitted' state for you to make the necessary
              amendments and re-submit - rather than you having to complete
              another form.
            </p>
          </WarningCallout>
        </>
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
