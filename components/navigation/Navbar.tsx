import { useState, useEffect } from "react";
import { Button, Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { resetMfaJourney } from "../../redux/slices/userSlice";
import store from "../../redux/store/store";
interface NavProps {
  showMenu: boolean;
  updateMenuStatus: any;
  signOut: any;
}

const Navbar = ({ showMenu, updateMenuStatus, signOut }: NavProps) => {
  const dispatch = useAppDispatch();
  const paths = [
    { path: "profile", name: "Profile" },
    { path: "formr-a", name: "Form R (Part A)" },
    { path: "formr-b", name: "Form R (Part B)" }
  ];
  const noMfaPaths = [
    { path: "support", name: "Support" },
    { path: "mfa", name: "MFA set-up" }
  ];

  const makeLi = (pathObj: { path: string; name: string }) => (
    <li key={pathObj.name} className="nhsuk-header__navigation-item">
      <NavLink
        data-cy={pathObj.name}
        className="nhsuk-header__navigation-link"
        onClick={handleClick}
        to={`/${pathObj.path}`}
      >
        {pathObj.name}
      </NavLink>
    </li>
  );

  const addLinks = (): JSX.Element[] => {
    const preferredMfa = store.getState().user.preferredMfa;
    if (preferredMfa === "NOMFA") {
      return noMfaPaths.map(p => makeLi(p));
    } else return [...paths, ...noMfaPaths].map(p => makeLi(p));
  };

  const [open, setOpen] = useState<boolean | undefined>(showMenu);
  useEffect(() => {
    setOpen(showMenu);
  }, [showMenu]);

  const handleClick = () => {
    setOpen(false);
    updateMenuStatus(false);
  };

  const doSignOut = () => {
    dispatch(resetMfaJourney());
    signOut();
  };

  return (
    <Header.Nav open={open} title="Menu">
      {addLinks()}
      <li>
        <Button
          data-cy="logoutBtn"
          onClick={doSignOut}
          style={{ margin: "6px 0 8px 8px", padding: "4px 6px" }}
        >
          Logout
        </Button>
      </li>
    </Header.Nav>
  );
};

export default Navbar;
