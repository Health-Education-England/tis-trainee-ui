import { useEffect, useState } from "react";
import "./App.scss";
import {
  AuthState,
  CognitoUserInterface,
  onAuthUIStateChange
} from "@aws-amplify/ui-components";
import { BrowserRouter } from "react-router-dom";
import PageTitle from "./components/common/PageTitle";
import HEEHeader from "./components/navigation/HEEHeader";
import { LoginNew } from "./components/authentication/LoginNew";
import HEEFooter from "./components/navigation/HEEFooter";
import { Main } from "./components/main/Main";
import { CacheUtilities } from "./utilities/CacheUtilities";
import packageJson from "../package.json";

const globalAny: any = global;
globalAny.appVersion = packageJson.version;

const App: React.FunctionComponent = () => {
  const [authState, setAuthState] = useState<AuthState>();
  const [user, setUser] = useState<CognitoUserInterface>();
  const [appVersion, setAppVersion] = useState("");

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authUser) => {
      setAuthState(nextAuthState);
      setUser(authUser as CognitoUserInterface);
    });
  }, []);

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
      <HEEHeader authState={authState} user={user} />
      {authState === AuthState.SignedIn ? (
        <Main user={user} />
      ) : (
        <LoginNew user={user} />
      )}
      <HEEFooter appVersion={appVersion} authState={authState} user={user} />
    </BrowserRouter>
  );
};

export default App;
