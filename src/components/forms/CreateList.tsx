import { ActionLink, LedeText, Table } from "nhsuk-react-components";
import { IFormR } from "../../models/IFormR";
import { LifeCycleState } from "../../models/LifeCycleState";
import ErrorPage from "../common/ErrorPage";
import Loading from "../common/Loading";
import ScrollTo from "./ScrollTo";
import styles from "./FormR.module.scss";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { selectAllforms, fetchForms } from "../../redux/slices/formsSlice";
import { useEffect } from "react";
import { loadSavedForm } from "../../redux/slices/formASlice";
import FormsListBtn from "./FormsListBtn";
import { useHistory } from "react-router-dom";

const CreateList = () => {
  let content;
  let history = useHistory();
  const dispatch = useAppDispatch();

  const formRPartAList = useAppSelector(selectAllforms);
  const formRPartAListStatus = useAppSelector(state => state.forms.status);
  const formRPartAListError = useAppSelector(state => state.forms.error);
  const formRPartAStatus = useAppSelector(state => state.formA.status);

  useEffect(() => {
    if (formRPartAListStatus === "idle") {
      dispatch(fetchForms());
    }
  }, [formRPartAListStatus, dispatch]);

  const handleRowClick = (formId: any) => {
    if (formRPartAStatus === "idle") {
      dispatch(loadSavedForm(formId));
    }
    history.push(`/formr-a/${formId}`);
    // TODO could set canEdit to false here (unless this is already default value)?
    // could get the id from param in the View comp e.g. const { formId } = match.params
  };

  if (formRPartAListStatus === "loading") return <Loading />;
  else if (formRPartAListStatus === "succeeded") {
    const submittedForms = formRPartAList.filter(
      (form: any) => form.lifecycleState === LifeCycleState.Submitted
    );

    if (submittedForms.length > 0) {
      content = submittedForms.map((formData: IFormR) => (
        <Table.Row key={formData.id} className={styles.listTableRow}>
          <td>
            <ActionLink
              onClick={() => handleRowClick(formData.id)}
              data-cy="submittedForm"
            >
              form submitted on{" "}
              {DateUtilities.ToLocalDate(formData.submissionDate)}
            </ActionLink>
          </td>
        </Table.Row>
      ));
    } else {
      content = <LedeText>No forms submitted yet.</LedeText>;
    }
  } else if (formRPartAListStatus === "failed") {
    content = <ErrorPage error={formRPartAListError}></ErrorPage>;
  }

  return (
    <>
      <ScrollTo />
      <FormsListBtn formRPartAList={formRPartAList} />
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

export default CreateList;
