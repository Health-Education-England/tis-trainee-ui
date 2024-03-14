import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import ErrorPage from "../common/ErrorPage";
import { BackLink, Col, Container, Label, Row } from "nhsuk-react-components";
import history from "../navigation/history";
import { DateUtilities } from "../../utilities/DateUtilities";

export const NotificationMessage = () => {
  // parse id from params
  const { id } = useParams<{ id: string }>();

  // retrive the notificationStatus from the store

  // retrieve active notification from store
  const activeNotification = useAppSelector(
    state => state.notifications.activeNotification
  );

  // TODO Placeholder for now
  const notificationMessage =
    "This is a placeholder for the notification message";

  // TODO poss useEffect to call thunk to update notifications list with new read status for this notification (if previously unread)
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
            {/* <Col width="full">
              <p>{notificationMessage}</p>
            </Col> */}
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

function NotificationMessageText(
  notificationMessageStatus: string,
  notificationMessageText: string
) {
  if (notificationMessageStatus === "loading") {
    return <p>Loading...</p>;
  } else if (notificationMessageStatus === "failed") {
    return <ErrorPage message="Failed to load this notification" />;
  }
  return <p>{notificationMessageText}</p>;
}
