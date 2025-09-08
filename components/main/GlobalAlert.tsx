import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { Fieldset } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useTraineeActions } from "../../utilities/hooks/useTraineeActions";

export const GlobalAlert = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  const { hasOutstandingActions } = useTraineeActions();
  const pathname = useLocation().pathname;
  if (preferredMfa === "NOMFA") return null;

  const isActionSummaryPage = pathname === "/action-summary";

  const alerts = {
    actionSummary: {
      status: hasOutstandingActions && !isActionSummaryPage,
      component: <ActionsSummaryAlert />
    },
    bookmark: {
      status: showBookmarkAlert,
      component: <BookmarkAlert />
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
        {alerts.bookmark.status && alerts.bookmark.component}
        {alerts.actionSummary.status && alerts.actionSummary.component}
      </div>
    </aside>
  ) : null;
};

function ActionsSummaryAlert() {
  return (
    <div data-cy="outstandingTraineeActions">
      <p>
        <FontAwesomeIcon icon={faExclamationCircle} size="lg" color="red" /> You
        have outstanding actions to complete.
      </p>
      <p>
        <Link to="/action-summary">Go to Action Summary page</Link> for details.
      </p>
    </div>
  );
}

function BookmarkAlert() {
  return (
    <div data-cy="bookmarkAlert" className="bookmark-alert">
      <Fieldset.Legend size="s" className="bookmark-alert-header">
        We have moved
      </Fieldset.Legend>
      <p>
        You are seeing this message because you accessed this site using an old
        address, we have redirected you here automatically.
      </p>
      <p>
        Please update any bookmarks or password managers to use the new{" "}
        <a href="/">{window.location.origin}</a> address.
      </p>
    </div>
  );
}
