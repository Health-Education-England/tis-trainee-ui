import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import ErrorPage from "../common/ErrorPage";
import { Col, Container, Row } from "nhsuk-react-components";
import history from "../navigation/history";
import { useEffect } from "react";
import store from "../../redux/store/store";
import { getNotificationMessage } from "../../redux/slices/notificationsSlice";
import { toastErrText } from "../../utilities/Constants";
import FormBackLink from "../common/FormBackLink";
import Loading from "../common/Loading";
import DOMPurify from "dompurify";

export const NotificationMessage = () => {
  const { id } = useParams<{ id: string }>();

  const notificationMessageHTML = useAppSelector(
    state => state.notifications.notificationMsg
  );
  const notificationMessageStatus = useAppSelector(
    state => state.notifications.msgStatus
  );

  useEffect(() => {
    store.dispatch(getNotificationMessage(id));
  }, [id]);

  if (notificationMessageStatus === "loading") {
    return <Loading />;
  }

  if (notificationMessageStatus === "failed") {
    return (
      <ErrorPage
        message={toastErrText.fetchNotificationMessage}
        header="Notification message error"
      />
    );
  }

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
      <Container className="nhsuk-u-margin-bottom-5 nhsuk-u-padding-3 container">
        <Row>
          <Col width="full">
            {notificationMessageStatus === "succeeded" ? (
              <div
                className="nhsuk-u-margin-top-2"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(notificationMessageHTML, {
                    ADD_ATTR: ["target"]
                  })
                }}
              />
            ) : (
              <ErrorPage
                message={toastErrText.fetchNotificationMessage}
                header="Notification message error"
              />
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotificationMessage;
