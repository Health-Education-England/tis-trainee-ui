import { NavLink, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const { pathname } = useLocation();

  if (pathname === "/home") {
    return null;
  }

  return (
    <nav className="nhsuk-width-container nhsuk-u-margin-top-5">
      <NavLink data-cy="homeLink" to="/home">
        Home
      </NavLink>
    </nav>
  );
};

export default Breadcrumbs;
