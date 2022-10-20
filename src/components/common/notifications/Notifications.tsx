import { useAppSelector } from "../../../redux/hooks/hooks";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  // Only show unique notifications (filtered by notif text)
  const notifications = useAppSelector(
    state => state.notifications.notifications
  ).filter(
    (notif, index, notifArr) =>
      notifArr.findIndex(v => v.text === notif.text) === index
  );

  return (
    <>
      {notifications &&
        notifications.map(notification => (
          <div key={notification.id}>
            <NotificationItem notification={notification} />
          </div>
        ))}
    </>
  );
};

export default Notifications;
