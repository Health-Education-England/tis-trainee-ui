import { Link } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useOutstandingActions } from "../../utilities/hooks/action-summary/useOutstandingActions";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";
import { useInProgressActions } from "../../utilities/hooks/action-summary/useInProgressActions";

const GlobalAlert = () => {
  // Don't show the Global alert if the user has not set their MFA
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  // BOOKMARK
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  // ACTION SUMMARY
  const draftFormProps = !!useAppSelector(state => state.forms?.draftFormProps);
  const { unsignedCojCount, programmeActions } = useOutstandingActions();
  const unsignedCoJ = unsignedCojCount > 0;
  const unreviewedProgramme = programmeActions.length > 0;
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
      unreviewedProgramme) &&
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
      <div className="nhsuk-width-container" style={{ marginBottom: "0.5em" }}>
        {outstandingActions.status && (
          <ActionsSummaryAlert
            unsignedCoJ={unsignedCoJ}
            inProgressFormR={inProgressFormR}
            importantInfo={importantInfo}
            unreviewedProgramme={unreviewedProgramme}
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
    <div className="nhsuk-grid-row" data-cy="bookmarkAlert">
      <div className="nhsuk-grid-column-full">
        <div className="app-global-alert__content">
          <div className="app-global-alert__message">
            <h2>We have moved</h2>
            <p>
              You are seeing this message because you accessed this site using
              an old address, we have redirected you here automatically.
            </p>
            <p>
              Please update any bookmarks or password managers to use the new{" "}
              <a href="/">{window.location.origin}</a> address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

type ActionsAlertProps = {
  unsignedCoJ: boolean;
  inProgressFormR: boolean;
  importantInfo: boolean;
  unreviewedProgramme: boolean;
};

function ActionsSummaryAlert({
  unsignedCoJ,
  inProgressFormR,
  importantInfo,
  unreviewedProgramme
}: Readonly<ActionsAlertProps>) {
  const ACTION_LINK = (
    <span>
      Please click <Link to="/">here</Link> for details.
    </span>
  );
  const importantInfoText = "Please review your Form R submissions.";
  const conditions = [
    {
      check: () => (unsignedCoJ || unreviewedProgramme) && !inProgressFormR,
      body: <span>You have outstanding actions to complete.</span>,
      cyTag: "outstandingAction"
    },
    {
      check: () => !(unsignedCoJ || unreviewedProgramme) && inProgressFormR,
      body: <span>You have in progress actions to complete.</span>,
      cyTag: "inProgressFormR"
    },
    {
      check: () => (unsignedCoJ || unreviewedProgramme) && inProgressFormR,
      body: (
        <span>You have outstanding and in progress actions to complete.</span>
      ),
      cyTag: "unsignedCoJAndInProgressFormR"
    }
  ];

  const { body, cyTag } = conditions.find(({ check }) => check()) ?? {
    body: null
  };

  return (
    <div className="nhsuk-grid-row" data-cy="actionsSummaryAlert">
      <div className="nhsuk-grid-column-full">
        <div className="app-global-alert__content">
          <div className="app-global-alert__message">
            <h2>Attention</h2>
            <p data-cy={cyTag}>{body}</p>
            {importantInfo && (
              <p data-cy={"checkFormRSubs"}>{importantInfoText}</p>
            )}
            <p>{ACTION_LINK}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
