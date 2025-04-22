import { Link, useLocation } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useActionsAndAlertsDataLoader } from "../../utilities/hooks/useActionsAndAlertDataLoader";
import { Fieldset } from "nhsuk-react-components";
import {
  faClock,
  faInfoCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAlertStatusData } from "../../utilities/hooks/useAlertStatusData";

export const GlobalAlert = () => {
  const { isActionsAndAlertLoading, isActionsAndAlertError } =
    useActionsAndAlertsDataLoader();

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);

  const alertStatusData = useAlertStatusData();
  const { showActionsSummaryAlert } = alertStatusData;

  const alerts = {
    actionSummary: {
      status: showActionsSummaryAlert && preferredMfa !== "NOMFA",
      component: <ActionsSummaryAlert {...alertStatusData} />
    },
    bookmark: {
      status: showBookmarkAlert,
      component: <BookmarkAlert />
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);

  if (isActionsAndAlertLoading && preferredMfa !== "NOMFA") {
    return null;
  }

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
        {isActionsAndAlertError && preferredMfa !== "NOMFA" && (
          <p className="nhsuk-error-summary__title">
            There was a problem loading any outstanding actions to confirm your
            Programmes and Placements. Please try again by refreshing the page.
          </p>
        )}
        {alerts.actionSummary.status && alerts.actionSummary.component}
        {alerts.bookmark.status && alerts.bookmark.component}
      </div>
    </aside>
  ) : null;
};

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

type ActionsAlertProps = {
  unsignedCoJ: boolean;
  inProgressFormR: boolean;
  importantInfo: boolean;
  unreviewedProgramme: boolean;
  unreviewedPlacement: boolean;
};

function ActionsSummaryAlert({
  unsignedCoJ,
  inProgressFormR,
  importantInfo,
  unreviewedProgramme,
  unreviewedPlacement
}: Readonly<ActionsAlertProps>) {
  const pathname = useLocation().pathname;
  const isActionSummaryPage = pathname === "/action-summary";
  const alertMessage = getActionAlertMessage(
    unsignedCoJ,
    inProgressFormR,
    unreviewedProgramme,
    unreviewedPlacement
  );

  return (
    <div data-cy="actionsSummaryAlert">
      {alertMessage.body && (
        <span data-cy={alertMessage.cyTag}>{alertMessage.body}</span>
      )}
      {importantInfo && (
        <span data-cy={"checkFormRSubs"}>
          <p>
            <FontAwesomeIcon icon={faInfoCircle} size="lg" color="#005eb8" />{" "}
            Please review your Form R submissions.
          </p>
        </span>
      )}
      {isActionSummaryPage ? null : (
        <p>
          <Link to="/action-summary">View action summary</Link> for details.
        </p>
      )}
    </div>
  );
}

function getActionAlertMessage(
  unsignedCoJ: boolean,
  inProgressFormR: boolean,
  unreviewedProgramme: boolean,
  unreviewedPlacement: boolean
) {
  const hasOutstandingActions =
    unsignedCoJ || unreviewedProgramme || unreviewedPlacement;

  if (hasOutstandingActions && inProgressFormR) {
    return {
      body: (
        <p>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="lg"
            color="#d5281b"
          />{" "}
          You have outstanding and in progress actions to complete.
        </p>
      ),
      cyTag: "unsignedCoJAndInProgressFormR"
    };
  }

  if (hasOutstandingActions) {
    return {
      body: (
        <p>
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            size="lg"
            color="#d5281b"
          />
          You have outstanding actions to complete.
        </p>
      ),
      cyTag: "outstandingAction"
    };
  }

  if (inProgressFormR) {
    return {
      body: (
        <p>
          <FontAwesomeIcon icon={faClock} size="lg" color="#E45245" /> You have
          in progress actions to complete.
        </p>
      ),
      cyTag: "inProgressFormR"
    };
  }

  return { body: null, cyTag: null };
}
