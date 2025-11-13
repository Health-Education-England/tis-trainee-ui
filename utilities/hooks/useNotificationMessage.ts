import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { getNotificationMessage } from "../../redux/slices/notificationsSlice";
import { useAppSelector } from "../../redux/hooks/hooks";
import store from "../../redux/store/store";

export const useNotificationMessage = () => {
  const { id } = useParams<{ id: string }>();

  const notificationMessageContent = useAppSelector(
    state => state.notifications.notificationMsg
  );
  const notificationMessageStatus = useAppSelector(
    state => state.notifications.msgStatus
  );

  useEffect(() => {
    store.dispatch(getNotificationMessage(id));
  }, [id]);

  return {
    notificationMessageContent,
    notificationMessageStatus
  };
};
