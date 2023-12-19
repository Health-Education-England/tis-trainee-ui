import {
  IconDefinition,
  faCircle,
  faClock,
  faInfoCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Label } from "nhsuk-react-components";
import { Link } from "react-router-dom";

type FormType = "A" | "B";
type Message =
  | "in progress"
  | "infoLatestSubFormRWithinYear"
  | "infoLatestSubFormRMoreThanYear"
  | "infoNoFormEver";

type FormMsgProps = {
  formType: FormType;
  message: Message;
  latestSubFormDate?: string;
};

export default function FormMessage({
  formType,
  message,
  latestSubFormDate
}: Readonly<FormMsgProps>) {
  let icon: IconDefinition = faCircle;
  let iconSize: "xs" | "sm" | "lg" | "xl" = "lg";
  let color: string = "#000000";
  let text: JSX.Element = <></>;
  switch (message) {
    case "in progress":
      icon = faClock;
      color = "#ED8B00";
      text = (
        <>
          You have a saved draft{" "}
          <Link
            to={`/formr-${formType.toLowerCase()}`}
          >{`Form R (${formType})`}</Link>
          .
        </>
      );
      break;
    case "infoNoFormEver":
      icon = faExclamationTriangle;
      color = "#ED8B00";
      text = (
        <>
          You have yet to submit a{" "}
          <Link
            to={`/formr-${formType.toLowerCase()}`}
          >{`Form R (${formType})`}</Link>{" "}
          on TIS Self-Service.
        </>
      );
      break;
    case "infoLatestSubFormRMoreThanYear":
      icon = faExclamationTriangle;
      color = "#ED8B00";
      text = (
        <>
          It is a year at least since you submitted a{" "}
          <Link
            to={`/formr-${formType.toLowerCase()}`}
          >{`Form R (${formType})`}</Link>{" "}
          on {latestSubFormDate}.
        </>
      );
      break;
    case "infoLatestSubFormRWithinYear":
      icon = faInfoCircle;
      color = "#005EB8";
      text = (
        <>
          Your latest{" "}
          <Link
            to={`/formr-${formType.toLowerCase()}`}
          >{`Form R (${formType})`}</Link>{" "}
          was submitted within the last year on {latestSubFormDate}.
        </>
      );
      break;
  }

  return (
    <li data-cy={`${message}-${formType}`}>
      <Label size="s">
        <FontAwesomeIcon icon={icon} color={color} size={iconSize} /> {text}
      </Label>
    </li>
  );
}
