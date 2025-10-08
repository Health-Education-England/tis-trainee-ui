import { Route, Switch } from "react-router-dom";
import ScrollTo from "../forms/ScrollTo";
import PageTitle from "../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import PageNotFound from "../common/PageNotFound";
import { NotificationsTable } from "./NotificationsTable";
import { NotificationMessage } from "./NotificationMessage";
import { useAppSelector } from "../../redux/hooks/hooks";

export const Notifications = () => {
  const viewingType = useAppSelector(state => state.notifications.viewingType);
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
          {viewingType === "IN_APP" ? "In-app" : "Email"} Notifications
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
