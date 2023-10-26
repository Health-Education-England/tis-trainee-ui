import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";

const GlobalAlert = () => {
  const currentPath = useLocation().pathname;
  const hasSignableCoj = useAppSelector(
    state => state.traineeProfile.hasSignableCoj
  );
  const showCojAlert = hasSignableCoj && !currentPath.includes("/sign-coj");
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);

  const alerts = useMemo(
    () => ({
      coj: {
        status: showCojAlert,
        component: <CojAlert />
      },
      bookmark: {
        status: showBookmarkAlert,
        component: <BookmarkAlert />
      }
    }),
    [showCojAlert, showBookmarkAlert]
  );

  const [hasAlerts, setHasAlerts] = useState(false);
  useEffect(() => {
    setHasAlerts(Object.values(alerts).some(alert => alert.status));
  }, [alerts]);

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
        {Object.entries(alerts).map(
          ([type, alert]) =>
            alert.status && (
              <React.Fragment key={type}>{alert.component}</React.Fragment>
            )
        )}
      </div>
    </aside>
  ) : null;
};

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

function CojAlert() {
  const pathName = useLocation().pathname;
  return (
    <div className="nhsuk-grid-row" data-cy="cojAlert">
      <div className="nhsuk-grid-column-full">
        <div className="app-global-alert__content">
          <div className="app-global-alert__message">
            <h2>Please sign your Conditions of Joining Agreement</h2>
            {pathName === "/programmes" ? null : (
              <NavLink data-cy="cojLink" to={`/programmes`}>
                <p>Click here to navigate to your Programmes page to sign</p>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobalAlert;
