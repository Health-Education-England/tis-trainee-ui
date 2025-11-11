import { useNotificationMessage } from "../../utilities/hooks/useNotificationMessage";
import { NotificationMessageView } from "./NotificationMessageView";

export const NotificationMessage: React.FC = () => {
  const { notificationMessageContent, notificationMessageStatus } =
    useNotificationMessage();

  return (
    <NotificationMessageView
      notificationMessageContent={notificationMessageContent}
      notificationMessageStatus={notificationMessageStatus}
    />
  );
};
