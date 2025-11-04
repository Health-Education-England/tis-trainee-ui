import { Col, Container, Row } from "nhsuk-react-components";
import history from "../navigation/history";
import FormBackLink from "../common/FormBackLink";
import Loading from "../common/Loading";
import ErrorPage from "../common/ErrorPage";
import DOMPurify from "dompurify";
import { toastErrText } from "../../utilities/Constants";

type NotificationMessageViewProps = {
  notificationMessageHTML: string;
  notificationMessageStatus: string;
};

export const NotificationMessageView: React.FC<
  NotificationMessageViewProps
> = ({ notificationMessageHTML, notificationMessageStatus }) => {
  if (notificationMessageStatus === "loading") {
    return <Loading />;
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
