import { useLocation } from "react-router-dom";
import { BackLink } from "nhsuk-react-components";
import style from "../Common.module.scss";
import history from "../navigation/history";

type FormBackLinkProps = {
  className?: string;
  text?: string;
};

export const FormBackLink = ({
  className = style.backLink,
  text
}: FormBackLinkProps) => {
  const location = useLocation();
  const path = location.pathname.split("/").slice(0, 2).join("/");

  return (
    <BackLink
      className={className}
      data-cy={
        text
          ? `backLink-to-${text.replaceAll(/\s+/g, "-").toLowerCase()}`
          : "backLink"
      }
      onClick={() => history.push(path)}
    >
      {text ?? "Back"}
    </BackLink>
  );
};

export default FormBackLink;
