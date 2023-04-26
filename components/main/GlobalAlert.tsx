import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";

const GlobalAlert = () => {
  return (
    <div
      className="app-global-alert"
      id="app-global-alert"
      role="complementary"
    >
      <div className="nhsuk-width-container">
        <CojAlert />
      </div>
    </div>
  );
};

function CojAlert() {
  const pathName = useLocation().pathname;
  const showCojAlert = useAppSelector(
    state => state.traineeProfile.hasSignableCoj
  );

  return !showCojAlert ? null : (
    <div className="nhsuk-grid-row">
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
