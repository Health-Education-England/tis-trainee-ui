import { NotificationMessageView } from "./NotificationMessageView";
import { useNotificationMessage } from "../../utilities/hooks/useNotificationMessage";

export const NotificationMessage: React.FC = () => {
  const { notificationMessageHTML, notificationMessageStatus } =
    useNotificationMessage();

  return (
    <NotificationMessageView
      notificationMessageHTML={notificationMessageHTML}
      notificationMessageStatus={notificationMessageStatus}
    />
  );
};
