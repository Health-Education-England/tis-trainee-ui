import { useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";
import { FormName } from "./form-builder/FormBuilder";

export type SaveStatusProps = "idle" | "saving" | "succeeded" | "failed";

type AutoSaveMessageProps = {
  formName: FormName;
};

const formStateMap = {
  formA: (state: RootState) => state.formA,
  formB: (state: RootState) => state.formB,
  ltft: (state: RootState) => state.ltft
};

const getFormState = (state: RootState, formName: FormName) => {
  return formStateMap[formName](state);
};

export const AutosaveMessage: React.FC<AutoSaveMessageProps> = ({
  formName
}) => {
  const formState = useAppSelector(state => getFormState(state, formName));
  const autoSaveStatus = formState.saveStatus;
  const latestTimeStamp = formState.saveLatestTimeStamp;

  const statusMessages = {
    idle: "Waiting for new changes...",
    saving: "In progress...",
    succeeded: `Success - ${latestTimeStamp}`,
    failed: `Fail - Last autosave success: ${latestTimeStamp}`
  };

  const message = statusMessages[autoSaveStatus as SaveStatusProps];
  return (
    <div>
      <p data-cy="autosaveStatusMsg">{`Autosave status: ${message}`}</p>
    </div>
  );
};
