import { Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import { getNotificationCount } from "../../redux/slices/notificationsSlice";
import { NotificationsBtn } from "../notifications/NotificationsBtn";
import { EmailsBtn } from "../notifications/EmailsBtn";
import { UserFeaturesType } from "../../models/FeatureFlags";

const TSSHeader = () => {
  const { signOut } = useAuthenticator(context => [context.user]);
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

        <Header.AccountItem
          asElement={NavLink}
          data-cy="profileLink"
          href="/profile"
          icon
          to="/profile"
        >
          {concatName}
        </Header.AccountItem>
        <Header.AccountItem
          as="button"
          data-cy="signOutBtn"
          onClick={signOut}
          type="button"
        >
          Sign out
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
      name: "Less than full-time (LTFT)",
      mobileOnly: false,
      showWithNoMfa: false,
      featureEnabled: userFeatures.forms.ltft.enabled
    }
  ];

  const makeNavigationItem = (pathObj: {
    path: string;
    name: string;
    mobileOnly: boolean;
    showWithNoMfa: boolean;
    featureEnabled: boolean;
  }) => {
    const hasRestrictedMfa = preferredMfa === "NOMFA" || preferredMfa === "SMS";
    const shouldShow =
      pathObj.featureEnabled && (!hasRestrictedMfa || pathObj.showWithNoMfa);

    if (!shouldShow) {
      return null;
    }

    return (
      <Header.NavigationItem
        asElement={NavLink}
        className={pathObj.mobileOnly ? "mobile-only-nav" : undefined}
        data-cy={pathObj.name}
        href={`/${pathObj.path}`}
        key={pathObj.name}
        to={`/${pathObj.path}`}
      >
        {pathObj.name}
      </Header.NavigationItem>
    );
  };

  return paths.map(makeNavigationItem);
}
