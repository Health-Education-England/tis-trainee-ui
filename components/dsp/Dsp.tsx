import { Redirect, Route, Switch } from "react-router-dom";
import PageTitle from "../common/PageTitle";
import ScrollTo from "../forms/ScrollTo";
import { Fieldset } from "nhsuk-react-components";
import style from "../Common.module.scss";
import CredentialStart from "./CredentialStart";
import CredentialVerified from "./CredentialVerified";
import CredentialIssued from "./CredentialIssued";
import CredentialInvalid from "./CredentialInvalid";
import PageNotFound from "../common/PageNotFound";

export default function Dsp() {
  return (
    <>
      <PageTitle title="Dsp" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className={style.fieldLegHeader}
          data-cy="dspHeading"
        >
          Digital Staff Passport
        </Fieldset.Legend>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/credential/verified"
          component={CredentialVerified}
        />
        <Route exact path="/credential/issued" component={CredentialIssued} />
        <Route exact path="/credential/invalid" component={CredentialInvalid} />
        <Route exact path="/credential" component={CredentialStart} />
        <Redirect exact path="/" to="/credential" />
        <Route path="/credential/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
