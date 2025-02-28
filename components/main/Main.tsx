import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/form-builder/form-r/part-a/FormRPartA";
import FormRPartB from "../forms/form-builder/form-r/part-b/FormRPartB";
import Support from "../support/Support";
import PageNotFound from "../common/PageNotFound";
import PageTitle from "../common/PageTitle";
import TSSFooter from "../navigation/TSSFooter";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import Loading from "../common/Loading";
import MFA from "../authentication/setMfa/MFA";
import { ConfirmProvider } from "material-ui-confirm";
import {
  getCognitoGroups,
  getPreferredMfa,
  updatedRedirected
} from "../../redux/slices/userSlice";
import Home from "../home/Home";
import { Placements } from "../placements/Placements";
import { Programmes } from "../programmes/Programmes";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import GlobalAlert from "./GlobalAlert";
import CojView from "../forms/conditionOfJoining/CojView";
import TSSHeader from "../navigation/TSSHeader";
import packageJson from "../../package.json";
import { loadFormAList } from "../../redux/slices/formASlice";
import { loadFormBList } from "../../redux/slices/formBSlice";
import { fetchTraineeActionsData } from "../../redux/slices/traineeActionsSlice";
import { Notifications } from "../notifications/Notifications";
import ActionSummary from "../actionSummary/ActionSummary";
import { OnboardingTracker } from "../programmes/trackers/OnboardingTracker";
import { Cct } from "../forms/cct/Cct";
import { Ltft } from "../forms/ltft/Ltft";
import useIsBetaTester from "../../utilities/hooks/useIsBetaTester";

const appVersion = packageJson.version;

export const Main = () => {
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  const traineeActionsDataStatus = useAppSelector(
    state => state.traineeActions.status
  );
  const formAListStatus = useAppSelector(state => state.formA.status);
  const formBListStatus = useAppSelector(state => state.formB.status);
  const redirected = useAppSelector(state => state.user.redirected);
  let content;
  const pathname = useLocation().pathname;
  const queryParams = new URLSearchParams(location.search);
  const isMatchedQueryParamsRedirect = queryParams.get("redirected") === "1";

  useEffect(() => {
    dispatch(getPreferredMfa());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCognitoGroups());
  }, [dispatch]);

  useEffect(() => {
    if (formAListStatus === "idle") {
      dispatch(loadFormAList());
    }
    if (formBListStatus === "idle") {
      dispatch(loadFormBList());
    }
  }, [dispatch, formAListStatus, formBListStatus]);

  useEffect(() => {
    // Store whether the user was redirected.
    if (redirected || isMatchedQueryParamsRedirect) {
      dispatch(updatedRedirected(true));
    }
  }, [dispatch, redirected, isMatchedQueryParamsRedirect]);

  // If the user was redirected the URL param should be cleaned to avoid it being bookmarked.
  if (redirected) {
    queryParams.delete("redirected");
    window.history.pushState(
      null,
      "",
      location.pathname +
        (queryParams.toString() ? "?" + queryParams.toString() : "")
    );
  }

  useEffect(() => {
    if (traineeProfileDataStatus === "idle") {
      dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileDataStatus, dispatch]);

  useEffect(() => {
    if (traineeActionsDataStatus === "idle") {
      dispatch(fetchTraineeActionsData());
    }
  }, [traineeActionsDataStatus, dispatch]);

  // combined Reference data
  const referenceStatus = useAppSelector(state => state.reference.status);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(fetchReference());
    }
  }, [referenceStatus, dispatch]);

  if (
    traineeProfileDataStatus === "loading" ||
    referenceStatus === "loading" ||
    traineeActionsDataStatus === "loading"
  )
    return (
      <div className="centreSpinner">
        <Loading />
      </div>
    );
  else if (
    traineeProfileDataStatus === "succeeded" &&
    referenceStatus === "succeeded"
  )
    content = (
      <>
        {pathname !== "/action-summary" ? <GlobalAlert /> : null}
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
      </>
    );
  return <ConfirmProvider>{content}</ConfirmProvider>;
};
