import { INotification } from "../../../models/INotification";
import "./NotificationItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfoCircle,
  faClose,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { removeNotification } from "../../../redux/slices/notificationsSlice";
import { useEffect } from "react";

interface INotificationItem {
  notification: INotification;
}

const chooseIcon = (notifType: string) => {
  switch (notifType) {
    case "Success":
      return faCheckCircle;
    case "Error":
      return faExclamationCircle;
    default:
      return faInfoCircle;
  }
};

const NotificationItem = ({ notification }: INotificationItem) => {
  const dispatch = useAppDispatch();
  const faIcon = chooseIcon(notification.type);

  const handleClick = (id: string) => {
    dispatch(removeNotification(id));
  };
  useEffect(() => {
    const removeNotif = setTimeout(
      () => dispatch(removeNotification(notification.id)),
      6000
    );
    return () => {
      clearTimeout(removeNotif);
    };
  }, [dispatch, notification.id]);

  return (
    <>
      <div className={`notification ${notification.type}`}>
        <div className="msg-container">
          <FontAwesomeIcon className="fa-icon" icon={faIcon} size="lg" />{" "}
          {`${notification.type} ${notification.text}. `}
        </div>
        <button
          className={`closeBtn ${notification.type}`}
          onClick={() => handleClick(notification.id)}
        >
          <FontAwesomeIcon icon={faClose} size="lg" />
        </button>
      </div>
    </>
  );
};

export default NotificationItem;
