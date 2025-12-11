import { Col, Container, Row } from "nhsuk-react-components";
import FormBackLink from "../common/FormBackLink";
import Loading from "../common/Loading";
import ErrorPage from "../common/ErrorPage";
import DOMPurify from "dompurify";
import { toastErrText } from "../../utilities/Constants";
import { NotificationMsgContentType } from "../../redux/slices/notificationsSlice";
import dayjs from "dayjs";

type NotificationMessageViewProps = {
  notificationMessageContent: NotificationMsgContentType;
  notificationMessageStatus: string;
};

export const NotificationMessageView: React.FC<
  NotificationMessageViewProps
> = ({ notificationMessageContent, notificationMessageStatus }) => {
  if (notificationMessageStatus === "loading") {
    return <Loading />;
  }

  return (
    <div>
      <Row>
        <Col width="three-quarters">
          <FormBackLink text="Back to notifications list" />
        </Col>
      </Row>
      <Container className="nhsuk-u-margin-bottom-5 nhsuk-u-padding-3 container">
        <Row>
          <Col width="full">
            {notificationMessageStatus === "succeeded" &&
            notificationMessageContent ? (
              <article>
                <h1
                  className="nhsuk-heading-l"
                  data-cy="notification-message-header"
                >
                  {notificationMessageContent.subject}
                </h1>
                <p data-cy="notification-message-sent-at">
                  <strong>
                    {`Sent ${dayjs(notificationMessageContent.sentAt).format(
                      "DD/MM/YYYY"
                    )}`}
                  </strong>
                </p>
                <div
                  className="nhsuk-u-margin-top-2"
                  data-cy="notification-message-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      notificationMessageContent.content,
                      {
                        ADD_ATTR: ["target"]
                      }
                    )
                  }}
                />
              </article>
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
