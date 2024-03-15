import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import ErrorPage from "../common/ErrorPage";
import { BackLink, Col, Container, Label, Row } from "nhsuk-react-components";
import history from "../navigation/history";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useEffect } from "react";
import store from "../../redux/store/store";
import { getNotificationMessage } from "../../redux/slices/notificationsSlice";

export const NotificationMessage = () => {
  const { id } = useParams<{ id: string }>();
  //active notification (from previous page row click)
  const activeNotification = useAppSelector(
    state => state.notifications.activeNotification
  );
  // notification message
  const notificationMessage = useAppSelector(
    state => state.notifications.notificationMsg
  );
  // notification message status (message fetch not implemented yet)
  const notificationMessageStatus = useAppSelector(
    state => state.notifications.msgStatus
  );

  useEffect(() => {
    store.dispatch(getNotificationMessage(id));
  }, [id]);

  return (
    <div>
      <Row>
        <Col width="three-quarters">
          <BackLink
            className="back-link"
            data-cy="backLink"
            onClick={() => history.push("/notifications")}
          >
            Back to list
          </BackLink>
        </Col>
      </Row>
      {id === activeNotification?.id ? (
        <Container className="container">
          <Row>
            <Col width="three-quarters">
              <Label size="m">
                <b>{activeNotification.subject}</b>
              </Label>
            </Col>
            <Col width="one-quarter">
              <Label>
                {DateUtilities.ToLocalDateTime(activeNotification.sentAt)}
              </Label>
              <span>{activeNotification.type}</span>
            </Col>
          </Row>
          <Row>
            <Col width="full" className="notification-message">
              <NotificationMessageText
                notificationMessageStatus={notificationMessageStatus}
                notificationMessageText={notificationMessage}
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <ErrorPage
          message="This notification is not available"
          header="Notification not found"
        />
      )}
    </div>
  );
};

export default NotificationMessage;

type NotificationMessageTextType = {
  notificationMessageStatus: string;
  notificationMessageText: string;
};

function NotificationMessageText({
  notificationMessageStatus,
  notificationMessageText
}: NotificationMessageTextType) {
  if (notificationMessageStatus === "loading") {
    return <p>Loading...</p>;
  } else if (notificationMessageStatus === "failed") {
    return <ErrorPage message="Failed to load this notification" />;
  }
  return <p>{notificationMessageText}</p>;
}
