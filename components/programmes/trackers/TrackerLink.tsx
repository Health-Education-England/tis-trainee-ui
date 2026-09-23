import { Link } from "react-router-dom";
import { LinkType } from "../../../utilities/Constants";
import { resolveInternalTrackerLink } from "../../../utilities/NotificationsUtilities";
import { NotificationSubjectType } from "../../../models/Notifications";
import { TrackerActionType } from "../../../models/Tracker";
import { FormRPrefillLink } from "../../forms/form-builder/form-r/FormRPrefillLink";

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

  if (tag === "SIGN_FORM_R_PART_A" || tag === "SIGN_FORM_R_PART_B") {
    return (
      <FormRPrefillLink
        formType={tag === "SIGN_FORM_R_PART_A" ? "A" : "B"}
        programmeMembershipId={pmId}
        label={actionText}
      />
    );
  }

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
