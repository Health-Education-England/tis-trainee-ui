import { NHSHEELogoRev } from "../../static/images/NHSHEELogoRev";

const HEEHeaderLogo = () => {
  return (
    <div data-cy="headerLogo" className="nhsuk-header__logo">
      <a
        style={{ display: "block" }}
        href="/"
        aria-label="TIS Self-Service homepage"
      >
        <NHSHEELogoRev title="TIS Self-Service homepage" />
      </a>
      <p
        style={{
          width: "240px",
          color: "white",
          margin: "0",
          fontSize: "24px"
        }}
      >
        TIS Self-Service
      </p>
    </div>
  );
};
export default HEEHeaderLogo;
