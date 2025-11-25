import { Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { SignOutBtn } from "../common/SignOutBtn";
import { useEffect, type ComponentProps } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getNotificationCount } from "../../redux/slices/notificationsSlice";
import { NotificationsBtn } from "../notifications/NotificationsBtn";
import { EmailsBtn } from "../notifications/EmailsBtn";
import { UserFeaturesType } from "../../models/FeatureFlags";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TSSHeader = () => {
  const dispatch = useAppDispatch();
  const unreadNotificationCount = useAppSelector(
    state => state.notifications.unreadNotificationCount
  );
  const notificationsStatus = useAppSelector(
    state => state.notifications.countStatus
  );
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const userFeatures = useAppSelector(state => state.user.features);
  const traineeProfileDetails = useAppSelector(
    state => state.traineeProfile.traineeProfileData.personalDetails
  );
  const concatName = `${traineeProfileDetails.forenames} ${traineeProfileDetails.surname}`;

  useEffect(() => {
    if (notificationsStatus === "idle") {
      dispatch(getNotificationCount());
    }
  }, [notificationsStatus, dispatch]);

  return (
    <Header
      service={{
        href: "/",
        text: "TIS Self-Service"
      }}
    >
      <Header.Account>
        {userFeatures.notifications.enabled && (
          <>
            <Header.AccountItem>
              <NotificationsBtn
                unreadNotificationCount={unreadNotificationCount}
                data-cy="notificationBtnHDR"
              />
            </Header.AccountItem>
            <Header.AccountItem>
              <EmailsBtn data-cy="emailBtnHDR" />
            </Header.AccountItem>
          </>
        )}

        <Header.AccountItem href="/profile">
          <span style={{ marginTop: "0.25rem" }}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }} />
            {concatName}
          </span>
        </Header.AccountItem>
        <Header.AccountItem>
          <SignOutBtn />
        </Header.AccountItem>
      </Header.Account>
      <Header.Navigation>
        {makeTSSHeaderLinks(preferredMfa, userFeatures)}
      </Header.Navigation>
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
      data-cy="nav-link-wrapper"
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
