import { Redirect, Route, Switch } from "react-router-dom";
import PageTitle from "../../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import ChooseMfa from "./ChooseMfa";
import CreateSms from "./sms/CreateSms";
import CreateTotp from "./totp/CreateTotp";
import { CognitoUser } from "amazon-cognito-identity-js";
import PageNotFound from "../../common/PageNotFound";
import { useEffect } from "react";
import { dispatchCojNotif } from "../../../utilities/CojUtilities";
import store from "../../../redux/store/store";
import { resetNotifications } from "../../../redux/slices/notificationsSlice";

interface IMFA {
  user: CognitoUser | any;
  mfa: string;
}

const MFA = ({ user, mfa }: IMFA) => {
  useEffect(() => {
    dispatchCojNotif();
    return () => {
      store.dispatch(resetNotifications());
    };
  }, []);

  return (
    <>
      <PageTitle title="MFA" />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Set up Multi-Factor Authentication (MFA)
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route
          path="/mfa/sms"
          render={() => <CreateSms user={user} mfa={mfa} />}
        />
        <Route
          path="/mfa/totp"
          render={() => <CreateTotp user={user} mfa={mfa} />}
        />
        <Route path="/mfa" render={() => <ChooseMfa mfa={mfa} />} />
        <Redirect exact path="/" to="/mfa" />
        <Route path="/*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default MFA;
