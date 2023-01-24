import { useState, useEffect } from "react";
import { Button, Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { resetUser } from "../../redux/slices/userSlice";
interface NavProps {
  showMenu: boolean;
  updateMenuStatus: any;
  signOut: any;
  mfa: string;
}

const Navbar = ({ showMenu, updateMenuStatus, signOut, mfa }: NavProps) => {
  const dispatch = useAppDispatch();
  const paths = [
    { path: "profile", name: "Profile" },
    { path: "formr-a", name: "Form R (Part A)" },
    { path: "formr-b", name: "Form R (Part B)" },
    { path: "preferences", name: "Preferences" }
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
    if (mfa === "NOMFA") {
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
    dispatch(resetUser());
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
