import { Link } from "react-router-dom";
import { LinkType } from "../../../utilities/Constants";

type TrackerLinkProps = {
  textLink: LinkType;
  actionText: string;
  pmId: string;
};

export function TrackerLink({
  textLink,
  actionText,
  pmId
}: Readonly<TrackerLinkProps>) {
  const { text, isInternal } = textLink;

  if (isInternal) {
    const resolvedPath = text.includes(":id")
      ? text.replace(":id", pmId)
      : text;
    return <Link to={resolvedPath}>{actionText}</Link>;
  }

  return (
    <a href={text} target="_blank" rel="noopener noreferrer">
      {actionText}
    </a>
  );
}
