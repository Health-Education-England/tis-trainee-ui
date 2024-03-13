import { Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { SignOutBtn } from "../common/SignOutBtn";
import { NHSEnglandLogoWhite } from "../../public/NHSEnglandLogoWhite";
import store from "../../redux/store/store";
import { NotificationBtn } from "../common/NotificationBtn";
import { useAppSelector } from "../../redux/hooks/hooks";

const TSSHeader = () => {
  const unreadNotificationCount = useAppSelector(
    state => state.notifications.unreadNotificationCount
  );
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
          <NotificationBtn
            unreadNotificationCount={unreadNotificationCount}
            data-cy="notificationBtnHDR"
          />
          <Header.MenuToggle data-cy="menuToggleBtn" />
          <div className="top-nav-container">
            <NotificationBtn
              unreadNotificationCount={unreadNotificationCount}
              data-cy="notificationBtnHDR"
            />
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
      path: "profile",
      name: "Profile",
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
      path: "programmes",
      name: "Programmes",
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
    { path: "mfa", name: "MFA set-up", mobileOnly: true, showWithNoMfa: true }
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
