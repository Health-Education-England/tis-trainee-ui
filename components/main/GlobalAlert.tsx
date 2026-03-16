import { useAppSelector } from "../../redux/hooks/hooks";
import { ActionLink, CloseIcon, Fieldset } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import { useTraineeActions } from "../../utilities/hooks/useTraineeActions";
import { useState } from "react";

export const GlobalAlert = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  const { hasOutstandingActions } = useTraineeActions();
  const pathname = useLocation().pathname;
  const [recruitDismissed, setRecruitDismissed] = useState(false);

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
    recruit: {
      status: !recruitDismissed,
      component: <RecruitAlert onDismiss={() => setRecruitDismissed(true)} />
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);

  return hasAlerts ? (
    <aside
      className="app-global-alert hide-from-print"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
        {alerts.bookmark.status && alerts.bookmark.component}
        {alerts.actionSummary.status && alerts.actionSummary.component}
        {alerts.recruit.status && alerts.recruit.component}
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

function RecruitAlert({ onDismiss }: Readonly<{ onDismiss: () => void }>) {
  return (
    <div className="recruit-alert" data-cy="recruitAlert">
      <div>
        <p>
          <b>Shape the future deferral journey for all resident doctors.</b>
        </p>
        <p>
          Take part in NHS user research, influence real service improvements,
          and receive a letter of participation for continuing professional
          development (CPD).
        </p>
        <p>
          <ActionLink
            href="https://forms.office.com/pages/responsepage.aspx?id=slTDN7CF9UeyIge0jXdO44uWlnrGjTNIhMe4L0OxPpdUQlBTRTc1RUhJMlhERVBMQ0VBUzNHRkoxRi4u&route=shorturl"
            target="_blank"
            rel="noopener noreferrer"
            className="recruit-link"
          >
            Sign up now
          </ActionLink>
        </p>
      </div>
      <button
        className="recruit-alert-close"
        aria-label="Dismiss recruitment alert"
        title="Dismiss recruitment alert"
        onClick={onDismiss}
      >
        <CloseIcon />
      </button>
    </div>
  );
}
