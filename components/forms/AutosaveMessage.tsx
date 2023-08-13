import { useAppSelector } from "../../redux/hooks/hooks";

export type AutosaveStatusProps = "idle" | "saving" | "succeeded" | "failed";

type AutoSaveMessageProps = {
  formName: string;
};

export const AutosaveMessage: React.FC<AutoSaveMessageProps> = ({
  formName
}) => {
  const autoSaveStatus = useAppSelector(state =>
    formName === "formA"
      ? state.formA.autosaveStatus
      : state.formB.autosaveStatus
  );
  const latestTimeStamp = useAppSelector(state =>
    formName === "formA"
      ? state.formA.autoSaveLatestTimeStamp
      : state.formB.autoSaveLatestTimeStamp
  );

  const statusMessages: { [key in AutosaveStatusProps]: string } = {
    idle: "Waiting for new changes...",
    saving: "In progress...",
    succeeded: `Success (${latestTimeStamp})`,
    failed: `Fail (last autosave success: ${latestTimeStamp})`
  };

  const message = statusMessages[autoSaveStatus];
  return (
    <div>
      <p>{`Autosave status: ${message}`}</p>
    </div>
  );
};
