import { useState, useEffect } from "react";
import { Header } from "nhsuk-react-components";
import Logout from "../authentication/Logout";
import { NavLink } from "react-router-dom";
import { CognitoUserInterface } from "@aws-amplify/ui-components";
interface NavProps {
  showMenu: boolean;
  updateMenuStatus: any;
  user: CognitoUserInterface | undefined;
}

const Navbar = ({ showMenu, updateMenuStatus, user }: NavProps) => {
  const paths = [
    { path: "profile", name: "Profile" },
    { path: "formr-a", name: "FormR (Part A)" },
    { path: "formr-b", name: "FormR (Part B)" },
    { path: "support", name: "Support" }
  ];

  const addLinks = () => {
    return paths.map(p => (
      <li key={p.name} className="nhsuk-header__navigation-item">
        <NavLink
          className="nhsuk-header__navigation-link"
          onClick={handleClick}
          to={`/${p.path}`}
        >
          {p.name}
        </NavLink>
      </li>
    ));
  };

  const [open, setOpen] = useState<boolean | undefined>(showMenu);
  useEffect(() => {
    setOpen(showMenu);
  }, [showMenu]);

  const handleClick = () => {
    setOpen(false);
    updateMenuStatus(false);
  };
  return (
    <Header.Nav open={open} title="Menu">
      {user ? addLinks() : null}
      <li className="nhsuk-header__navigation-item">
        <Logout />
      </li>
    </Header.Nav>
  );
};

export default Navbar;
