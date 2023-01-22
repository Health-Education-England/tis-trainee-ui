import { NHSHEELogoRev } from "../../public/NHSHEELogoRev";
import { NavLink } from "react-router-dom";
import styles from "./HEEHeader.module.scss";

const HEEHeaderLogo = () => {
  return (
    <div data-cy="headerLogo" className="nhsuk-header__logo">
      <NavLink to="/" aria-label="TIS Self-Service homepage">
        <NHSHEELogoRev title="TIS Self-Service homepage" />
      </NavLink>
      <p className={styles.headerLogoText}>TIS Self-Service</p>
    </div>
  );
};
export default HEEHeaderLogo;
