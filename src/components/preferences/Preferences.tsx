import { CognitoUser } from "amazon-cognito-identity-js";

interface IPreferences {
  user: CognitoUser | any;
  mfa: string;
}

const Preferences = ({ user, mfa }: IPreferences) => {
  return <div>Preferences</div>;
};

export default Preferences;
