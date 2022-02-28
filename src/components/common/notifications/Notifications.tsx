import { useAppSelector } from "../../../redux/hooks/hooks";
import NotificationItem from "./NotificationItem";

const Notifications = () => {
  const notifications = useAppSelector(
    state => state.notifications.notifications
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
