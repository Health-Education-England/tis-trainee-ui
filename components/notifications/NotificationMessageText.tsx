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
    return <ErrorPage message="Failed to load this message." />;
  }
  return (
    <div className="nhsuk-u-margin-top-2">
      <p className="nhsuk-body"> {notificationMessageText}</p>
    </div>
  );
}
