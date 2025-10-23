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
  const linkText = path.slice(1);
  const capitalizedPathText =
    linkText.charAt(0).toUpperCase() + linkText.slice(1);
  return (
    <BackLink
      className={className}
      data-cy={dataCy}
      onClick={() => FormRUtilities.historyPush(history, path)}
    >
      {text ? text : `Go to ${capitalizedPathText} page`}
    </BackLink>
  );
};

export default FormBackLink;
