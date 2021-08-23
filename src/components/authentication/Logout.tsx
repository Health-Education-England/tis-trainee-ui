import { Auth, Hub } from "aws-amplify";

const handleSignOutButtonClick = async (event: {
  preventDefault: () => void;
}) => {
  event.preventDefault();
  try {
    await Auth.signOut();
    Hub.dispatch("UI Auth", {
      event: "AuthStateChange",
      message: "signedout"
    });
  } catch (error) {
    console.log("error signing out: ", error);
  }
};

const Logout = () => {
  return (
    <a
      data-jest="btn-logout"
      href="/"
      className="nhsuk-header__navigation-link"
      onClick={handleSignOutButtonClick}
    >
      Logout
    </a>
  );
};

export default Logout;
