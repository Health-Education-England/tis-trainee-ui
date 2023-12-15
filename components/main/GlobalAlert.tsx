import { Link } from "react-router-dom";
import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useOutstandingActions } from "../../utilities/hooks/action-summary/useOutstandingActions";
import { useInfoActions } from "../../utilities/hooks/action-summary/useInfoActions";
import { useInProgressActions } from "../../utilities/hooks/action-summary/useInProgressActions";

const GlobalAlert = () => {
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);
  // ACTION SUMMARY
  const draftFormProps = !!useAppSelector(state => state.forms?.draftFormProps);
  const { unsignedCojCount } = useOutstandingActions();
  const unsignedCoJ = unsignedCojCount > 0;
  const { isInProgressFormA, isInProgressFormB } = useInProgressActions();
  const inProgressFormR =
    isInProgressFormA || isInProgressFormB || draftFormProps;
  const { noSubFormRA, noSubFormRB, infoActionsA, infoActionsB } =
    useInfoActions();

  const importantInfo: boolean =
    !!infoActionsA.isForInfoMoreThanYearSubForm ||
    !!infoActionsB.isForInfoMoreThanYearSubForm;

  const showActionsSummaryAlert =
    unsignedCoJ ||
    inProgressFormR ||
    draftFormProps ||
    noSubFormRA ||
    noSubFormRB ||
    importantInfo;

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
        />
      )
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container" style={{ marginBottom: "0.5em" }}>
        {alerts.bookmark.status && <BookmarkAlert />}
        {alerts.outstandingActions.status && (
          <ActionsSummaryAlert
            unsignedCoJ={unsignedCoJ}
            inProgressFormR={inProgressFormR}
            importantInfo={importantInfo}
          />
        )}
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

type OutstandingActionsAlertProps = {
  unsignedCoJ: boolean;
  inProgressFormR: boolean;
  importantInfo: boolean;
};

function ActionsSummaryAlert({
  unsignedCoJ,
  inProgressFormR,
  importantInfo
}: Readonly<OutstandingActionsAlertProps>) {
  const ACTION_LINK = (
    <span>
      Please click <Link to="/">here</Link> for details.
    </span>
  );
  const importantInfoText =
    "You have important information about your Form R submission dates you might want to check.";
  const conditions = [
    {
      check: () => unsignedCoJ && !inProgressFormR,
      header: "Action Required",
      body: <span>You have outstanding actions to complete.</span>
    },
    {
      check: () => !unsignedCoJ && inProgressFormR,
      header: "Action Required",
      body: <span>You have in progress actions to complete.</span>
    },
    {
      check: () => unsignedCoJ && inProgressFormR,
      header: "Action Required",
      body: (
        <span>You have outstanding and in progress actions to complete.</span>
      )
    }
  ];

  const { header, body } = conditions.find(({ check }) => check()) ?? {
    header: "",
    body: ""
  };

  return (
    <div className="nhsuk-grid-row" data-cy="outstandingActionsAlert">
      <div className="nhsuk-grid-column-full">
        <div className="app-global-alert__content">
          <div className="app-global-alert__message">
            <h2>{header}</h2>
            <p>{body}</p>
            {importantInfo && <p>{importantInfoText}</p>}
            <p>{ACTION_LINK}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
