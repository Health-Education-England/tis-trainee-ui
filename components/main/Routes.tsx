import { Switch, Route, Redirect } from "react-router-dom";
import { UserFeaturesType } from "../../models/FeatureFlags";
import ActionSummary from "../actionSummary/ActionSummary";
import MFA from "../authentication/setMfa/MFA";
import PageNotFound from "../common/PageNotFound";
import { Cct } from "../forms/cct/Cct";
import CojView from "../forms/conditionOfJoining/CojView";
import FormRPartA from "../forms/form-builder/form-r/part-a/FormRPartA";
import FormRPartB from "../forms/form-builder/form-r/part-b/FormRPartB";
import { Ltft } from "../forms/ltft/Ltft";
import Home from "../home/Home";
import { Notifications } from "../notifications/Notifications";
import { Placements } from "../placements/Placements";
import Profile from "../profile/Profile";
import { Programmes } from "../programmes/Programmes";
import { OnboardingTracker } from "../programmes/trackers/OnboardingTracker";
import Support from "../support/Support";
import { useAppSelector } from "../../redux/hooks/hooks";

interface RoutesProps {
  userFeatures: UserFeaturesType;
}

const Routes = () => {
  const userFeatures = useAppSelector(state => state.user.features);

  return (
    <Switch>
      {userFeatures.actions.enabled && (
        <Route exact path="/action-summary" component={ActionSummary} />
      )}
      <Route exact path="/home" component={Home} />
      {userFeatures.details.placements.enabled && (
        <Route exact path="/placements" component={Placements} />
      )}
      {userFeatures.details.programmes.enabled && (
        <Route exact path="/programmes" component={Programmes} />
      )}
      {userFeatures.details.programmes.enabled && (
        <Route
          exact
          path="/programmes/:id/onboarding-tracker"
          component={OnboardingTracker}
        />
      )}
      {userFeatures.details.programmes.conditionsOfJoining.enabled && (
        <Route exact path="/programmes/:id/sign-coj" component={CojView} />
      )}
      {userFeatures.details.profile.enabled && (
        <Route exact path="/profile" component={Profile} />
      )}
      {userFeatures.forms.formr.enabled && (
        <Route path="/formr-a" component={FormRPartA} />
      )}
      {userFeatures.forms.formr.enabled && (
        <Route path="/formr-b" component={FormRPartB} />
      )}
      <Route exact path="/support" component={Support} />
      <Route path="/mfa" component={MFA} />
      {userFeatures.notifications.enabled && (
        <Route path="/notifications" component={Notifications} />
      )}
      {userFeatures.cct.enabled && <Route path="/cct" component={Cct} />}
      {userFeatures.forms.ltft.enabled && (
        <Route path="/ltft" component={Ltft} />
      )}
      <Redirect exact path="/" to="/home" />
      <Route path="/*" component={PageNotFound} />
    </Switch>
  );
};

export default Routes;
