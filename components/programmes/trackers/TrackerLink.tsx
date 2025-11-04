import { Link } from "react-router-dom";
import { LinkType } from "../../../utilities/Constants";
import { resolveInternalTrackerLink } from "../../../utilities/NotificationsUtilities";
import { NotificationSubjectType } from "../../../models/Notifications";
import { TrackerActionType } from "../../../models/Tracker";

type TrackerLinkProps = {
  textLink: LinkType;
  actionText: string;
  pmId: string;
  tag: TrackerActionType;
  notificationsMap: Map<NotificationSubjectType, string>;
};

export function TrackerLink({
  textLink,
  actionText,
  pmId,
  tag,
  notificationsMap
}: Readonly<TrackerLinkProps>) {
  const { text, isInternal } = textLink;

  if (isInternal) {
    const resolvedPath = resolveInternalTrackerLink(
      text,
      pmId,
      tag,
      notificationsMap
    );
    return <Link to={resolvedPath}>{actionText}</Link>;
  }

  return (
    <a href={text} target="_blank" rel="noopener noreferrer">
      {actionText}
    </a>
  );
}
