import { useState, useEffect } from "react";
import { Header } from "nhsuk-react-components";
import Logout from "../authentication/Logout";
import { NavLink } from "react-router-dom";
interface NavProps {
  showMenu: boolean;
  updateMenuStatus: any;
}

const Navbar = ({ showMenu, updateMenuStatus }: NavProps) => {
  const paths = [
    { path: "profile", name: "Profile" },
    { path: "formr-a", name: "Form R (Part A)" },
    { path: "formr-b", name: "Form R (Part B)" },
    { path: "support", name: "Support" }
  ];

  const addLinks = (): JSX.Element[] => {
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
      {addLinks()}
      <li className="nhsuk-header__navigation-item">
        <Logout />
      </li>
    </Header.Nav>
  );
};

export default Navbar;
