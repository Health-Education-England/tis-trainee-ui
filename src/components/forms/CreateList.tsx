import { ActionLink, LedeText, Table } from "nhsuk-react-components";
import { useEffect } from "react";
import { IFormR } from "../../models/IFormR";
import { LifeCycleState } from "../../models/LifeCycleState";
import Loading from "../common/Loading";
import ScrollTo from "./ScrollTo";
import styles from "./FormR.module.scss";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { selectAllforms, fetchForms } from "../../redux/slices/formsSlice";
import { fetchFeatureFlags } from "../../redux/slices/featureFlagsSlice";
import { loadSavedFormA } from "../../redux/slices/formASlice";
import FormsListBtn from "./FormsListBtn";
import { loadSavedFormB } from "../../redux/slices/formBSlice";
import { useHistory, useLocation } from "react-router-dom";

const CreateList = () => {
  let history = useHistory();
  let pathname = useLocation().pathname;
  const dispatch = useAppDispatch();
  const formRList = useAppSelector(selectAllforms);
  const formRListStatus = useAppSelector(state => state.forms.status);
  const featFlagStatus = useAppSelector(state => state.featureFlags.status);

  let content;

  useEffect(() => {
    dispatch(fetchForms(pathname));
  }, [dispatch, pathname]);

  useEffect(() => {
    dispatch(fetchFeatureFlags());
  }, [dispatch]);

  const handleRowClick = async (formId: any, pName: string) => {
    if (pName === "/formr-a") {
      await dispatch(loadSavedFormA(formId));
    } else if (pName === "/formr-b") {
      await dispatch(loadSavedFormB(formId));
    }
    history.push(`${pName}/${formId}`);
  };

  if (formRListStatus === "loading" || featFlagStatus === "loading")
    return <Loading />;
  else if (formRListStatus === "succeeded" && featFlagStatus === "succeeded") {
    const submittedForms = formRList.filter(
      (form: any) => form.lifecycleState === LifeCycleState.Submitted
    );

    if (submittedForms.length > 0) {
      content = submittedForms.map((formData: IFormR) => (
        <Table.Row key={formData.id} className={styles.listTableRow}>
          <td>
            <ActionLink
              onClick={() => handleRowClick(formData.id, pathname)}
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
  }
  return (
    <>
      <ScrollTo />
      <FormsListBtn pathName={pathname} formRList={formRList} />
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
