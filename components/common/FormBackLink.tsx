import { BackLink } from "nhsuk-react-components";
import { FormRUtilities } from "../../utilities/FormRUtilities";
import style from "../Common.module.scss";

type FormBackLinkProps = {
  history: any;
  path: string;
  className?: string;
  dataCy?: string;
  text?: string;
};

export const FormBackLink = ({
  history,
  path,
  className = style.backLink,
  dataCy = "backLink",
  text
}: FormBackLinkProps) => {
  const linkText = mapPathToText(path, text);
  return (
    <BackLink
      className={className}
      data-cy={dataCy}
      onClick={() => FormRUtilities.historyPush(history, path)}
    >
      {linkText}
    </BackLink>
  );
};

export default FormBackLink;

function mapPathToText(path: string, text: string | undefined): string {
  if (text) return text;
  const linkText = path.slice(1);
  if (linkText === "formr-a" || linkText === "formr-b")
    return "Back to forms list";
  return `Go to ${linkText.charAt(0).toUpperCase() + linkText.slice(1)} page`;
}
