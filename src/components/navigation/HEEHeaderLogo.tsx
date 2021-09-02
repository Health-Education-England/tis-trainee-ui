import React from "react";
import logo from "../../static/images/nhs-hee-logo-rev.svg";
const HEEHeaderLogo = () => {
  return (
    <div className="nhsuk-header__logo">
      <a
        style={{ display: "block" }}
        href="/"
        aria-label="Trainee Self-Service homepage"
      >
        <img
          width="230"
          height="48"
          src={logo}
          alt="Trainee Self-Service homepage"
        />
      </a>
    </div>
  );
};
export default HEEHeaderLogo;
