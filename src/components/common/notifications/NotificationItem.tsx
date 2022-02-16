import {
  INotification,
  notificationColour
} from "../../../models/INotification";

interface INotificationItem {
  notification: INotification;
}

const checkNotificationType = (errorType: string) => {
  switch (errorType) {
    case "Success":
      return notificationColour.Success;
    case "Error":
      return notificationColour.Error;
    default:
      return notificationColour.Info;
  }
};

const NotificationItem = ({ notification }: INotificationItem) => {
  const bgColour = checkNotificationType(notification.type);
  return (
    <div
      style={{
        backgroundColor: bgColour,
        color: "#fff",
        border: `2px solid #fff`,
        padding: "12px",
        textAlign: "center"
      }}
    >
      {`${notification.type} ${notification.text}. `}
    </div>
  );
};

export default NotificationItem;
