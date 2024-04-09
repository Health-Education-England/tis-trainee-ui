import { toastErrText } from "../../utilities/Constants";
import DOMPurify from "dompurify";
import ErrorPage from "../common/ErrorPage";

type NotificationMessageTextType = {
  notificationMessageStatus: string;
  notificationMessageText: string;
};

export function NotificationMessageText({
  notificationMessageStatus,
  notificationMessageText
}: Readonly<NotificationMessageTextType>) {
  if (notificationMessageStatus === "loading") {
    return <p>Loading...</p>;
  } else if (notificationMessageStatus === "failed") {
    return <ErrorPage message={toastErrText.fetchNotificationMessage} />;
  }
  return (
    <div
      className="nhsuk-u-margin-top-2"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(notificationMessageText)
      }}
    />
  );
}
