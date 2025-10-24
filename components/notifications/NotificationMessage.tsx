import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import ErrorPage from "../common/ErrorPage";
import { Col, Container, Label, Row } from "nhsuk-react-components";
import history from "../navigation/history";
import { DateUtilities } from "../../utilities/DateUtilities";
import { useEffect } from "react";
import store from "../../redux/store/store";
import { getNotificationMessage } from "../../redux/slices/notificationsSlice";
import { NotificationMessageText } from "./NotificationMessageText";
import { toastErrText } from "../../utilities/Constants";
import FormBackLink from "../common/FormBackLink";

export const NotificationMessage = () => {
  const { id } = useParams<{ id: string }>();
  //active notification (from previous page row click)
  const activeNotification = useAppSelector(
    state => state.notifications.activeNotification
  );
  const notificationMessage = useAppSelector(
    state => state.notifications.notificationMsg
  );
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
          <FormBackLink
            history={history}
            path="/notifications"
            dataCy="backLink-to-notifications"
            text="Back to list"
          />
        </Col>
      </Row>
      {id && id === activeNotification?.id ? (
        <Container className="nhsuk-u-margin-bottom-5 nhsuk-u-padding-3 container">
          <Row>
            <Col width="three-quarters">
              <Label size="m">
                <b>{activeNotification?.subjectText}</b>
              </Label>
            </Col>
            <Col width="one-quarter">
              <Label>
                {DateUtilities.ToLocalDateTime(activeNotification?.sentAt)}
              </Label>
              <span>{activeNotification?.subject}</span>
            </Col>
          </Row>
          <Row>
            <Col width="full">
              <NotificationMessageText
                notificationMessageStatus={notificationMessageStatus}
                notificationMessageText={notificationMessage}
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <ErrorPage message={toastErrText.fetchNotificationMessage} />
      )}
    </div>
  );
};

export default NotificationMessage;
