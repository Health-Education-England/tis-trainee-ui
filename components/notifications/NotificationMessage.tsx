import { useNotificationMessage } from "../../utilities/hooks/useNotificationMessage";
import { NotificationMessageView } from "./NotificationMessageView";

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
