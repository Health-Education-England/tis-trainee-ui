import { INotification, NotificationType } from "../../../models/INotification";
import "./NotificationItem.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faClose,
  faExclamationCircle,
  faWarning
} from "@fortawesome/free-solid-svg-icons";
import { removeNotification } from "../../../redux/slices/notificationsSlice";
import { useEffect } from "react";
import ScrollTo from "../../forms/ScrollTo";
import { NavLink } from "react-router-dom";
import store from "../../../redux/store/store";

// add a conditional to check url/ page and if not profile then show btn
interface INotificationItem {
  notification: INotification;
}

const chooseIcon = (notifType: string) => {
  switch (notifType) {
    case NotificationType.Success:
      return faCheckCircle;
    case NotificationType.Error:
      return faExclamationCircle;
    default:
      return faWarning;
  }
};

const NotificationItem = ({ notification }: INotificationItem) => {
  const faIcon = chooseIcon(notification.type);

  const handleClick = (id: string) => {
    store.dispatch(removeNotification(id));
  };
  useEffect(() => {
    if (!NotificationType.Error) {
      const removeNotif = setTimeout(
        () => store.dispatch(removeNotification(notification.id)),
        10000
      );
      return () => {
        clearTimeout(removeNotif);
      };
    }
  }, [notification.id]);

  return (
    <>
      <ScrollTo />
      <div className={`notification ${notification.type}`}>
        <div className="msg-container" data-cy="notifContainer">
          <FontAwesomeIcon
            data-cy="faIcon"
            className="fa-icon"
            icon={faIcon}
            size="lg"
          />{" "}
          <span data-cy="notifText">{`${notification.type} ${notification.text}. `}</span>
          {notification.link && (
            <NavLink
              className={""}
              data-cy="notifLink"
              to={`${notification.link}`}
            >
              Click here to sign it now.
            </NavLink>
          )}
        </div>
        <button
          data-cy="notifCloseBtn"
          className={`closeBtn ${notification.type}`}
          onClick={() => handleClick(notification.id)}
          title="close notification"
        >
          <FontAwesomeIcon icon={faClose} size="lg" />
        </button>
      </div>
    </>
  );
};

export default NotificationItem;
