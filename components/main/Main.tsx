import { Redirect } from "react-router-dom";
import PageTitle from "../common/PageTitle";
import TSSFooter from "../navigation/TSSFooter";
import Loading from "../common/Loading";
import { ConfirmProvider } from "material-ui-confirm";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { GlobalAlert } from "./GlobalAlert";
import TSSHeader from "../navigation/TSSHeader";
import packageJson from "../../package.json";
import { useRedirectHandler } from "../../utilities/hooks/useRedirectHandler";
import { useCriticalDataLoader } from "../../utilities/hooks/useCriticalDataLoader";
import ErrorPage from "../common/ErrorPage";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  fetchUserSession,
  getPreferredMfa
} from "../../redux/slices/userSlice";
import history from "../navigation/history";
import { useTraineeActionsRefresh } from "../../utilities/hooks/useTraineeActionsRefresh";
import Routes from "./Routes";

const appVersion = packageJson.version;

export const Main = () => {
  const dispatch = useAppDispatch();
  const [authActionsDispatched, setAuthActionsDispatched] = useState(false);
  const { isCriticalLoading, isCriticalSuccess, hasCriticalError } =
    useCriticalDataLoader();
  // Refresh trainee actions data only if user completes an action
  useTraineeActionsRefresh();
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);

  // Fetch user auth data if not already dispatched
  useEffect(() => {
    if (!authActionsDispatched) {
      Promise.all([dispatch(fetchUserSession()), dispatch(getPreferredMfa())])
        .then(() => {
          setAuthActionsDispatched(true);
        })
        .catch(error => {
          console.error("Error fetching user session or preferred MFA:", error);
        });
    }
  }, [authActionsDispatched, dispatch]);
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
  if (
    authActionsDispatched &&
    (preferredMfa === "NOMFA" || preferredMfa === "SMS") &&
    !window.location.pathname.startsWith("/mfa")
  ) {
    history.push("/mfa");
    return <Redirect to="/mfa" />;
  }
  if (isCriticalSuccess && authActionsDispatched)
    return (
      <ConfirmProvider>
        <GlobalAlert />
        <PageTitle />
        <TSSHeader />
        <Breadcrumbs />
        <main className="nhsuk-width-container nhsuk-u-margin-top-5">
          <Routes />
        </main>
        <TSSFooter appVersion={appVersion} />
      </ConfirmProvider>
    );
  return null;
};
