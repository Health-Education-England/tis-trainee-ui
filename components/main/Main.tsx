import { Switch, Route, Redirect } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/form-builder/form-r/part-a/FormRPartA";
import FormRPartB from "../forms/form-builder/form-r/part-b/FormRPartB";
import Support from "../support/Support";
import PageNotFound from "../common/PageNotFound";
import PageTitle from "../common/PageTitle";
import TSSFooter from "../navigation/TSSFooter";
import Loading from "../common/Loading";
import MFA from "../authentication/setMfa/MFA";
import { ConfirmProvider } from "material-ui-confirm";
import Home from "../home/Home";
import { Placements } from "../placements/Placements";
import { Programmes } from "../programmes/Programmes";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { GlobalAlert } from "./GlobalAlert";
import CojView from "../forms/conditionOfJoining/CojView";
import TSSHeader from "../navigation/TSSHeader";
import packageJson from "../../package.json";
import { Notifications } from "../notifications/Notifications";
import ActionSummary from "../actionSummary/ActionSummary";
import { OnboardingTracker } from "../programmes/trackers/OnboardingTracker";
import { Cct } from "../forms/cct/Cct";
import { Ltft } from "../forms/ltft/Ltft";
import useIsBetaTester from "../../utilities/hooks/useIsBetaTester";
import { useRedirectHandler } from "../../utilities/hooks/useRedirectHandler";
import { useCriticalDataLoader } from "../../utilities/hooks/useCriticalDataLoader";
import ErrorPage from "../common/ErrorPage";

const appVersion = packageJson.version;

export const Main = () => {
  const isBetaTester = useIsBetaTester();
  const { isCriticalLoading, isCriticalSuccess, hasCriticalError } =
    useCriticalDataLoader();
  useRedirectHandler();

  if (isCriticalLoading)
    return (
      <div className="centreSpinner">
        <Loading />
      </div>
    );
  if (hasCriticalError)
    return (
      <ErrorPage message="There was an error loading the app data. Please try again by refreshing the page." />
    );

  if (isCriticalSuccess)
    return (
      <ConfirmProvider>
        <GlobalAlert />
        <PageTitle />
        <TSSHeader />
        <Breadcrumbs />
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          <Switch>
            <Route exact path="/action-summary" component={ActionSummary} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/placements" component={Placements} />
            <Route exact path="/programmes" component={Programmes} />
            <Route exact path="/programmes/:id/sign-coj" component={CojView} />
            <Route
              exact
              path="/programmes/:id/onboarding-tracker"
              component={OnboardingTracker}
            />
            <Route exact path="/profile" component={Profile} />
            <Route path="/formr-a" component={FormRPartA} />
            <Route path="/formr-b" component={FormRPartB} />
            <Route exact path="/support" component={Support} />
            <Route path="/mfa" component={MFA} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/cct" component={Cct} />
            {isBetaTester ? <Route path="/ltft" component={Ltft} /> : null}
            <Redirect exact path="/" to="/home" />
            <Route path="/*" component={PageNotFound} />
          </Switch>
        </main>
        <TSSFooter appVersion={appVersion} />
      </ConfirmProvider>
    );
  return null;
};
