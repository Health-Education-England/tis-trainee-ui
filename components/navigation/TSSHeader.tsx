import { Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { SignOutBtn } from "../common/SignOutBtn";
import { NHSEnglandLogoWhite } from "../../public/NHSEnglandLogoWhite";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { useEffect } from "react";
import { getNotifications } from "../../redux/slices/notificationsSlice";
import { NotificationsBtn } from "../notifications/NotificationsBtn";
import { UserFeaturesType } from "../../models/FeatureFlags";

const TSSHeader = () => {
  const dispatch = useAppDispatch();
  const unreadNotificationCount = useAppSelector(
    state => state.notifications.unreadNotificationCount
  );
  const notificationsStatus = useAppSelector(
    state => state.notifications.status
  );
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const userFeatures = useAppSelector(state => state.user.features);

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
      <Header.Nav style={{ maxWidth: "100%" }}>
        {makeTSSHeaderLinks(preferredMfa, userFeatures)}
        <div className="nhsuk-header__navigation-item mobile-only-nav">
          <SignOutBtn />
        </div>
      </Header.Nav>
    </Header>
  );
};
export default TSSHeader;

function makeTSSHeaderLinks(
  preferredMfa: string,
  userFeatures: UserFeaturesType
) {
  const paths = [
    {
      path: "action-summary",
      name: "Action Summary",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.actions.enabled
    },
    {
      path: "programmes",
      name: "Programmes",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.details.programmes.enabled
    },
    {
      path: "placements",
      name: "Placements",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.details.placements.enabled
    },
    {
      path: "cct",
      name: "CCT",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.cct.enabled
    },
    {
      path: "formr-a",
      name: "Form R (A)",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.forms.formr.enabled
    },
    {
      path: "formr-b",
      name: "Form R (B)",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.forms.formr.enabled
    },
    {
      path: "support",
      name: "Support",
      mobileOnly: true,
      showWithNoMfa: true,
      featureEnabled: true
    },
    {
      path: "mfa",
      name: "MFA set-up",
      mobileOnly: true,
      showWithNoMfa: true,
      featureEnabled: true
    },
    {
      path: "profile",
      name: "Profile",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.details.profile.enabled
    },
    {
      path: "ltft",
      name: "Changing hours (LTFT)",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.forms.ltft.enabled
    }
  ];

  const makeLi = (pathObj: {
    path: string;
    name: string;
    mobileOnly: boolean;
    showWithNoMfa: boolean;
    featureEnabled: boolean;
  }) => (
    <div
      key={pathObj.name}
      className={`nhsuk-header__navigation-item ${
        pathObj.mobileOnly ? "mobile-only-nav" : ""
      }`}
      hidden={
        ((preferredMfa === "NOMFA" || preferredMfa === "SMS") &&
          !pathObj.showWithNoMfa) ||
        !pathObj?.featureEnabled
      }
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
