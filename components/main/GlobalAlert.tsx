import React from "react";
import { useAppSelector } from "../../redux/hooks/hooks";

import { Fieldset } from "nhsuk-react-components";

export const GlobalAlert = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const showBookmarkAlert = useAppSelector(state => state.user.redirected);

  const alerts = {
    bookmark: {
      status: showBookmarkAlert,
      component: <BookmarkAlert />
    }
  };

  const hasAlerts = Object.values(alerts).some(alert => alert.status);

  if (preferredMfa !== "NOMFA") {
    return null;
  }

  return hasAlerts ? (
    <aside
      className="app-global-alert"
      id="app-global-alert"
      data-cy="globalAlert"
    >
      <div className="nhsuk-width-container">
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
