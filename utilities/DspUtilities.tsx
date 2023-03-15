import { Redirect } from "react-router-dom";

export class DspUtilities {
  public static redirectToCredInvalid() {
    localStorage.removeItem("verification");
    return <Redirect to="/credential/invalid" />;
  }
}
