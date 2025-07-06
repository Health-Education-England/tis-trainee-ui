import { NavLink, useLocation } from "react-router-dom";
import { HomeHeaderSection } from "../home/HomeHeaderSection";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  let content = null;

  if (pathname === "/home") {
    return <HomeHeaderSection />;
  }

  content = (
    <nav className="nhsuk-width-container nhsuk-u-margin-top-5">
      <NavLink data-cy="homeLink" to="/home">
        Home
      </NavLink>
    </nav>
  );

  return content;
};

export default Breadcrumbs;
