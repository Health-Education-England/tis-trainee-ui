import { Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { SignOutBtn } from "../common/SignOutBtn";
import { NHSEnglandLogoWhite } from "../../public/NHSEnglandLogoWhite";
import store from "../../redux/store/store";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useEffect } from "react";
import { getNotifications } from "../../redux/slices/notificationsSlice";
import { NotificationsBtn } from "../notifications/NotificationsBtn";

const TSSHeader = () => {
  const dispatch = useAppDispatch();
  const unreadNotificationCount = useAppSelector(
    state => state.notifications.unreadNotificationCount
  );
  const notificationsStatus = useAppSelector(
    state => state.notifications.status
  );
  useEffect(() => {
    if (notificationsStatus === "idle") {
      dispatch(getNotifications());
    }
  }, [notificationsStatus, dispatch]);

  return (
    <Header>
      <Header.Container>
        <div className="nhsuk-header__logo" data-cy="headerLogo">
          <a
            href="/"
            aria-label="TSS home page"
            className="nhsuk-header__navigation-link header-logo-link"
          >
            <NHSEnglandLogoWhite />
          </a>
        </div>
        <Header.Content>
          <div className="mobile-header">
            <NotificationsBtn
              unreadNotificationCount={unreadNotificationCount}
              data-cy="notificationBtnHDR"
            />
            <Header.MenuToggle data-cy="menuToggleBtn" />
          </div>
          <div className="top-nav-container">
            <NotificationsBtn
              unreadNotificationCount={unreadNotificationCount}
              data-cy="notificationBtnHDR"
            />
            <div className="top-nav-container">
              <NavLink
                className="nhsuk-header__navigation-link"
                data-cy="topNavSupport"
                to="/support"
              >
                Support
              </NavLink>
              <NavLink
                className="nhsuk-header__navigation-link"
                data-cy="topNavMfaSetup"
                to="/mfa"
              >
                MFA set-up
              </NavLink>
              <SignOutBtn />
            </div>
          </div>
        </Header.Content>
      </Header.Container>
      <div className="nhsuk-width-container">
        <span className="tss-name" data-cy="tssName">
          TIS Self-Service{" "}
          <a
            className="tss-beta-link"
            href="https://architecture.digital.nhs.uk/information/glossary"
            target="_blank"
            rel="noreferrer"
          >
            <i>(Private Beta)</i>
          </a>
        </span>
      </div>
      <Header.Nav className="header-nav">
        {makeTSSHeaderLinks()}
        <div className="nhsuk-header__navigation-item mobile-only-nav">
          <SignOutBtn />
        </div>
      </Header.Nav>
    </Header>
  );
};

export default TSSHeader;

function makeTSSHeaderLinks() {
  const preferredMfa = store.getState().user.preferredMfa;
  const paths = [
    {
      path: "action-summary",
      name: "Action Summary",
      mobileOnly: false,
      showWithNoMfa: false
    },
    {
      path: "programmes",
      name: "Programmes",
      mobileOnly: false,
      showWithNoMfa: false
    },
    {
      path: "placements",
      name: "Placements",
      mobileOnly: false,
      showWithNoMfa: false
    },
    {
      path: "formr-a",
      name: "Form R (A)",
      mobileOnly: false,
      showWithNoMfa: false
    },
    {
      path: "formr-b",
      name: "Form R (B)",
      mobileOnly: false,
      showWithNoMfa: false
    },
    { path: "support", name: "Support", mobileOnly: true, showWithNoMfa: true },
    { path: "mfa", name: "MFA set-up", mobileOnly: true, showWithNoMfa: true },
    {
      path: "profile",
      name: "Profile",
      mobileOnly: false,
      showWithNoMfa: false
    }
  ];

  const makeLi = (pathObj: {
    path: string;
    name: string;
    mobileOnly: boolean;
    showWithNoMfa: boolean;
  }) => (
    <div
      key={pathObj.name}
      className={`nhsuk-header__navigation-item ${
        pathObj.mobileOnly ? "mobile-only-nav" : ""
      }`}
      hidden={preferredMfa === "NOMFA" && !pathObj.showWithNoMfa}
    >
      <NavLink
        data-cy={pathObj.name}
        className="nhsuk-header__navigation-link"
        to={`/${pathObj.path}`}
      >
        {pathObj.name}
      </NavLink>
    </div>
  );
  return paths.map(p => makeLi(p));
}
