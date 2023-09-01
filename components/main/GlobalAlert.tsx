import { NavLink, useLocation } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../redux/hooks/hooks";

const GlobalAlert = () => {
  const currentPath = useLocation().pathname;
  const hasSignableCoj = useAppSelector(
    state => state.traineeProfile.hasSignableCoj
  );
  const showCojAlert = hasSignableCoj && !currentPath.includes("/sign-coj");

  const alerts = useMemo(
    () => ({
      coj: {
        status: showCojAlert,
        component: <CojAlert />
      },
      bookmark: {
        status: window.location.search.includes("redirected=1"),
        component: <BookmarkAlert />
      }
    }),
    [showCojAlert]
  );

  const [hasAlerts, setHasAlerts] = useState(false);
  useEffect(() => {
    setHasAlerts(Object.values(alerts).some(alert => alert.status));
  }, [alerts]);

  return hasAlerts ? (
    <div
      className="app-global-alert"
      id="app-global-alert"
      role="complementary"
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
    </div>
  ) : null;
};

function BookmarkAlert() {
  return (
    <div className="nhsuk-grid-row" data-cy="BookmarkAlert">
      <div className="nhsuk-grid-column-full">
        <div className="app-global-alert__content">
          <div className="app-global-alert__message">
            <h2>Welcome to the new Self Service Domain</h2>
            <p>
              Please replace any saved bookmarks for Self Service with this new
              URL.
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
