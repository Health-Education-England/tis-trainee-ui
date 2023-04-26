import { Switch, Route, Redirect, useLocation } from "react-router-dom";
import Profile from "../profile/Profile";
import FormRPartA from "../forms/formr-part-a/FormRPartA";
import FormRPartB from "../forms/formr-part-b/FormRPartB";
import Support from "../support/Support";
import PageNotFound from "../common/PageNotFound";
import PageTitle from "../common/PageTitle";
import HEEHeader from "../navigation/HEEHeader";
import HEEFooter from "../navigation/HEEFooter";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hooks";
import { fetchTraineeProfileData } from "../../redux/slices/traineeProfileSlice";
import { fetchReference } from "../../redux/slices/referenceSlice";
import Loading from "../common/Loading";
import MFA from "../authentication/setMfa/MFA";
import { ConfirmProvider } from "material-ui-confirm";
import {
  getCognitoGroups,
  getPreferredMfa
} from "../../redux/slices/userSlice";
import Home from "../home/Home";
import Placements from "../placements/Placements";
import Programmes from "../programmes/Programmes";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import Dsp from "../dsp/Dsp";
import GlobalAlert from "./GlobalAlert";

interface IMain {
  signOut: any;
  appVersion: string;
}

export const Main = ({ signOut, appVersion }: IMain) => {
  const dispatch = useAppDispatch();
  const traineeProfileDataStatus = useAppSelector(
    state => state.traineeProfile.status
  );
  let content;
  const pathname = useLocation().pathname;

  useEffect(() => {
    dispatch(getPreferredMfa());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCognitoGroups());
  }, [dispatch]);

  useEffect(() => {
    if (traineeProfileDataStatus === "idle") {
      dispatch(fetchTraineeProfileData());
    }
  }, [traineeProfileDataStatus, dispatch]);

  // combined Reference data
  const referenceStatus = useAppSelector(state => state.reference.status);

  useEffect(() => {
    if (referenceStatus === "idle") {
      dispatch(fetchReference());
    }
  }, [referenceStatus, dispatch]);

  if (traineeProfileDataStatus === "loading" || referenceStatus === "loading")
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
        <PageTitle />
        <HEEHeader signOut={signOut} />
        {pathname !== "/home" ? <GlobalAlert /> : null}
        <Breadcrumbs />
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/placements" component={Placements} />
            <Route exact path="/programmes" component={Programmes} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/credential" component={Dsp} />
            <Route path="/formr-a" component={FormRPartA} />
            <Route path="/formr-b" component={FormRPartB} />
            <Route exact path="/support" component={Support} />
            <Route path="/mfa" component={MFA} />
            <Redirect exact path="/" to="/home" />
            <Redirect
              exact
              path="/credential-issued"
              to={{
                pathname: "/credential/issued",
                search: location.search
              }}
            />
            <Redirect
              exact
              path="/credential-verified"
              to={{
                pathname: "/credential/issue",
                search: location.search
              }}
            />
            <Redirect
              exact
              path="/invalid-credential"
              to={{
                pathname: "/credential/invalid",
                search: location.search
              }}
            />
            <Route path="/*" component={PageNotFound} />
          </Switch>
        </main>
        <HEEFooter appVersion={appVersion} />
      </>
    );
  return <ConfirmProvider>{content}</ConfirmProvider>;
};
