import { useAppSelector } from "../../redux/hooks/hooks";

export type SaveStatusProps = "idle" | "saving" | "succeeded" | "failed";

type AutoSaveMessageProps = {
  formName: string;
};

export const AutosaveMessage: React.FC<AutoSaveMessageProps> = ({
  formName
}) => {
  const autoSaveStatus = useAppSelector(state =>
    formName === "formA" ? state.formA.saveStatus : state.formB.saveStatus
  );
  const latestTimeStamp = useAppSelector(state =>
    formName === "formA"
      ? state.formA.saveLatestTimeStamp
      : state.formB.saveLatestTimeStamp
  );

  const statusMessages: { [key in SaveStatusProps]: string } = {
    idle: "Waiting for new changes...",
    saving: "In progress...",
    succeeded: `Success - ${latestTimeStamp}`,
    failed: `Fail - Last autosave success: ${latestTimeStamp}`
  };

  const message = statusMessages[autoSaveStatus];
  return (
    <div>
      <p data-cy="autosaveStatusMsg">{`Autosave status: ${message}`}</p>
    </div>
  );
};
