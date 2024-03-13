import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import ErrorPage from "../common/ErrorPage";
import { BackLink, Col, Container, Label, Row } from "nhsuk-react-components";
import history from "../navigation/history";

type NotificationMessageProps = {};

export const NotificationMessage = (props: NotificationMessageProps) => {
  // parse id from params
  const { id } = useParams<{ id: string }>();

  // retrieve active notification from store
  const activeNotification = useAppSelector(
    state => state.notifications.activeNotification
  );

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
                <b>{activeNotification.title}</b>
              </Label>
            </Col>
            <Col width="one-quarter">
              <Label>{activeNotification.sendDate.toLocaleDateString()}</Label>
              <span>{activeNotification.category}</span>
            </Col>
          </Row>
          <Row>
            <Col width="full">
              <p>{activeNotification.message}</p>
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
