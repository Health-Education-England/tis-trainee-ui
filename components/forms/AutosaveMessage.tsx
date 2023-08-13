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

  const statusMessages: { [key in AutosaveStatusProps]: string } = {
    idle: "Not triggered yet.",
    saving: "In progress...",
    succeeded: "Successful.",
    failed: "failed."
  };

  const message = statusMessages[autoSaveStatus];
  return (
    <div>
      <p>{`Autosave status: ${message}`}</p>
    </div>
  );
};
