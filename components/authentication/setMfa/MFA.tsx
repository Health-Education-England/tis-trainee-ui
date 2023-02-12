import { Redirect, Route, Switch } from "react-router-dom";
import PageTitle from "../../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import ChooseMfa from "./ChooseMfa";
import CreateSms from "./sms/CreateSms";
import CreateTotp from "./totp/CreateTotp";
import PageNotFound from "../../common/PageNotFound";

const MFA = () => {
  return (
    <>
      <PageTitle title="MFA" />
      <Fieldset>
        <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
          Set up Multi-Factor Authentication (MFA)
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route path="/mfa/sms" component={CreateSms} />
        <Route path="/mfa/totp" component={CreateTotp} />
        <Route path="/mfa" component={ChooseMfa} />
        <Redirect exact path="/" to="/mfa" />
        <Route path="/*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default MFA;
