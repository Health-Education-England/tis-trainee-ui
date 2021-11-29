import logo from "../../static/images/nhs-hee-logo-rev.svg";

const HEEHeaderLogo = () => {
  return (
    <div data-cy="headerLogo" className="nhsuk-header__logo">
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
      <p
        style={{
          width: "240px",
          color: "white",
          margin: "0",
          fontSize: "24px"
        }}
      >
        Trainee Self-Service
      </p>
    </div>
  );
};
export default HEEHeaderLogo;
