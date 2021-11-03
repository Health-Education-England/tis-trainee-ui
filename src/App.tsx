import { useEffect, useState } from "react";
import "./App.scss";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { BrowserRouter } from "react-router-dom";
import PageTitle from "./components/common/PageTitle";
import HEEHeader from "./components/navigation/HEEHeader";
import { LoginNew } from "./components/authentication/LoginNew";
import HEEFooter from "./components/navigation/HEEFooter";
import { Main } from "./components/main/Main";
import { CacheUtilities } from "./utilities/CacheUtilities";
import packageJson from "../package.json";
import Auth from "@aws-amplify/auth";

const globalAny: any = global;
globalAny.appVersion = packageJson.version;

const App: React.FunctionComponent = () => {
  const [authState, setAuthState] = useState<AuthState>();
  const [hasTisId, setHasTisId] = useState(false);
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    return onAuthUIStateChange(nextAuthState => {
      setAuthState(nextAuthState);
    });
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (authState === AuthState.SignedIn) {
        const fetchedUser = await Auth.currentAuthenticatedUser();
        if (fetchedUser.attributes["custom:tisId"]) {
          setHasTisId(true);
        }
      }
    };
    fetchUser();
  }, [authState]);

  useEffect(() => {
    const fetchAppVersion = async () => {
      const version = await CacheUtilities.checkAppVersion(
        globalAny.appVersion
      );
      setAppVersion(version);
    };
    fetchAppVersion();
  }, []);

  return (
    <BrowserRouter>
      <PageTitle />
      <HEEHeader authState={authState} hasTisId={hasTisId} />
      {authState === AuthState.SignedIn ? (
        <Main hasTisId={hasTisId} />
      ) : (
        <LoginNew />
      )}
      <HEEFooter
        appVersion={appVersion}
        authState={authState}
        hasTisId={hasTisId}
      />
    </BrowserRouter>
  );
};

export default App;
