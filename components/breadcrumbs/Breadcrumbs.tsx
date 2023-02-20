import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hooks";
import HomeHeaderSection from "../home/HomeHeaderSection";

const Breadcrumbs = () => {
  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const { pathname } = useLocation();
  let content = null;

  if (pathname === "/home") {
    return <HomeHeaderSection />;
  }

  if (preferredMfa !== "NOMFA") {
    content = (
      <nav className="nhsuk-width-container nhsuk-u-margin-top-5">
        <NavLink to="/home">Home</NavLink>
      </nav>
    );
  }

  return content;
};

export default Breadcrumbs;
