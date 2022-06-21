import { useState, useEffect } from "react";
import { Button, Header } from "nhsuk-react-components";
import { NavLink } from "react-router-dom";
interface NavProps {
  showMenu: boolean;
  updateMenuStatus: any;
  signOut: any;
  mfa: string;
}

const Navbar = ({ showMenu, updateMenuStatus, signOut, mfa }: NavProps) => {
  const paths = [
    { path: "profile", name: "Profile" },
    { path: "formr-a", name: "Form R (Part A)" },
    { path: "formr-b", name: "Form R (Part B)" },
    { path: "support", name: "Support" },
    { path: "mfa", name: "MFA set-up" }
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
      {mfa !== "NOMFA" && addLinks()}
      <li>
        <Button
          data-cy="logoutBtn"
          onClick={signOut}
          style={{ margin: "6px 0 8px 8px", padding: "4px 6px" }}
        >
          Logout
        </Button>
      </li>
    </Header.Nav>
  );
};

export default Navbar;
