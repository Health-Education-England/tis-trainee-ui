import { Link } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useOutstandingActions } from "../../utilities/hooks/action-summary/useOutstandingActions";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";
import { useInProgressActions } from "../../utilities/hooks/action-summary/useInProgressActions";
import { Fieldset } from "nhsuk-react-components";
import {
  faClock,
  faInfoCircle,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const GlobalAlert = () => {
  // Don't show the Global alert if the user has not set their MFA
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  // BOOKMARK
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  // ACTION SUMMARY
  const draftFormProps = !!useAppSelector(state => state.forms?.draftFormProps);
  const { unsignedCojCount, programmeActions, placementActions } =
    useOutstandingActions();
  const unsignedCoJ = unsignedCojCount > 0;
  const unreviewedProgramme = programmeActions.length > 0;
  const unreviewedPlacement = placementActions.length > 0;
  const { isInProgressFormA, isInProgressFormB } = useInProgressActions();
  const inProgressFormR =
    isInProgressFormA || isInProgressFormB || draftFormProps;
  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();
  const importantInfo: boolean =
    !!infoActionsA.isForInfoYearPlusSubForm ||
    !!infoActionsB.isForInfoYearPlusSubForm ||
    noSubFormRA ||
    noSubFormRB;

  const showActionsSummaryAlert =
    (unsignedCoJ ||
      inProgressFormR ||
      draftFormProps ||
      importantInfo ||
      unreviewedProgramme ||
      unreviewedPlacement) &&
    preferredMfa !== "NOMFA";

  const alerts = {
    bookmark: {
      status: showBookmarkAlert,
      component: <BookmarkAlert />
    },
    outstandingActions: {
      status: showActionsSummaryAlert,
      component: (
        <ActionsSummaryAlert
          unsignedCoJ={unsignedCoJ}
          inProgressFormR={inProgressFormR}
          importantInfo={importantInfo}
          unreviewedProgramme={unreviewedProgramme}
          unreviewedPlacement={unreviewedPlacement}
        />
      )
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);
  const { bookmark, outstandingActions } = alerts;

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
        {outstandingActions.status && (
          <ActionsSummaryAlert
            unsignedCoJ={unsignedCoJ}
            inProgressFormR={inProgressFormR}
            importantInfo={importantInfo}
            unreviewedProgramme={unreviewedProgramme}
            unreviewedPlacement={unreviewedPlacement}
          />
        )}
        {bookmark.status && <BookmarkAlert />}
      </div>
    </aside>
  ) : null;
};
export default GlobalAlert;

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
  const conditions = [
    {
      check: () =>
        (unsignedCoJ || unreviewedProgramme || unreviewedPlacement) &&
        !inProgressFormR,
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
    },
    {
      check: () =>
        !(unsignedCoJ || unreviewedProgramme || unreviewedPlacement) &&
        inProgressFormR,
      body: (
        <p>
          <FontAwesomeIcon icon={faClock} size="lg" color="#E45245" /> You have
          in progress actions to complete.
        </p>
      ),
      cyTag: "inProgressFormR"
    },
    {
      check: () =>
        (unsignedCoJ || unreviewedProgramme || unreviewedPlacement) &&
        inProgressFormR,
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
    }
  ];

  const { body, cyTag } = conditions.find(({ check }) => check()) ?? {
    body: null
  };

  return (
    <div data-cy="actionsSummaryAlert">
      <span data-cy={cyTag}>{body}</span>
      {importantInfo && (
        <span data-cy={"checkFormRSubs"}>
          <p>
            <FontAwesomeIcon icon={faInfoCircle} size="lg" color="#005eb8" />{" "}
            Please review your Form R submissions.
          </p>
        </span>
      )}
      <p>
        See <Link to="/action-summary">Action Summary</Link> for details.
      </p>
    </div>
  );
}
