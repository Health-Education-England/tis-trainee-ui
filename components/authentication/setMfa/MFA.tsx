import { Redirect, Route, Switch } from "react-router-dom";
import PageTitle from "../../common/PageTitle";
import { Fieldset } from "nhsuk-react-components";
import ChooseMfa from "./ChooseMfa";
import CreateSms from "./sms/CreateSms";
import CreateTotp from "./totp/CreateTotp";
import PageNotFound from "../../common/PageNotFound";
import style from "../../Common.module.scss";

const MFA = () => {
  return (
    <>
      <PageTitle title="MFA" />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="mfaHeading"
        >
          MFA (Multi-Factor Authentication) set-up
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route exact path="/mfa/sms" component={CreateSms} />
        <Route exact path="/mfa/totp" component={CreateTotp} />
        <Route exact path="/mfa" component={ChooseMfa} />
        <Redirect exact path="/" to="/mfa" />
        <Route path="/mfa/*" component={PageNotFound} />
      </Switch>
    </>
  );
};

export default MFA;
