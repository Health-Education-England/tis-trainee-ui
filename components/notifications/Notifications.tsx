import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../forms/ScrollTo";
import PageTitle from "../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import { useAppSelector } from "../../redux/hooks/hooks";
import PageNotFound from "../common/PageNotFound";
import { NotificationsTable } from "./NotificationsTable";
import { NotificationMessage } from "./NotificationMessage";

export const Notifications = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  return (
    <>
      <PageTitle title="Notifications" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy="notificationsHeading"
        >
          Notifications
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/notifications/:id"
          component={NotificationMessage}
        />
        <Route exact path="/notifications" component={NotificationsTable} />
        <Route path="/notifications/*" component={PageNotFound} />
      </Switch>
    </>
  );
};
