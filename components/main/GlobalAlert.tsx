import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { ActionLink, Fieldset, Legend } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useTraineeActions } from "../../utilities/hooks/useTraineeActions";

export const GlobalAlert = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  const { hasOutstandingActions } = useTraineeActions();
  const pathname = useLocation().pathname;
  const [surveyDismissed, setSurveyDismissed] = useState(false);

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
    },
    survey: {
      status: !surveyDismissed,
      component: <SurveyAlert onDismiss={() => setSurveyDismissed(true)} />
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
        {alerts.survey.status && alerts.survey.component}
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
      <Fieldset>
        <Legend size="s" className="bookmark-alert-header">
          We have moved
        </Legend>
      </Fieldset>
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

function SurveyAlert({ onDismiss }: Readonly<{ onDismiss: () => void }>) {
  return (
    <div className="survey-alert" data-cy="surveyAlert">
      <div>
        <p>
          <b>Help us improve TSS:</b> We are running an annual survey to better
          understand how TSS is meeting user needs, where we can do better, and
          the impact of changes.
        </p>
        <p>
          It should only take a few minutes to complete, and will really help
          improve the service.
        </p>
        <p>
          <ActionLink
            href="https://forms.office.com/pages/responsepage.aspx?id=slTDN7CF9UeyIge0jXdO44uWlnrGjTNIhMe4L0OxPpdURjBMUjU2R09MRDBRNkkwWTNPMkJaQ1ZBWC4u&route=shorturl"
            target="_blank"
            rel="noopener noreferrer"
            className="survey-link"
          >
            Take the survey now
          </ActionLink>
        </p>
      </div>
      <button
        className="survey-alert-close"
        aria-label="Dismiss survey alert"
        title="Dismiss survey alert"
        onClick={onDismiss}
      >
        x
      </button>
    </div>
  );
}
