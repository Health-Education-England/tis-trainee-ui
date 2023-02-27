const HomeHeaderSection = () => {
  return (
    <section className="nhsuk-hero">
      <div className="nhsuk-width-container nhsuk-hero--border app-width-container">
        <div className="nhsuk-hero__wrapper app-hero__wrapper">
          <h1
            data-cy="homeWelcomeHeaderText"
            className="nhsuk-u-margin-bottom-4"
          >
            Welcome to TIS Self-Service
          </h1>
          <p className="nhsuk-body-l nhsuk-u-margin-bottom-1">
            Your post-graduate training programme resource
          </p>
          <p className="nhsuk-body-m nhsuk-u-margin-bottom-1">
            Our goal is to improve your training experience by making TIS
            Self-Service a one-stop-shop to support you through your training
            programme. We are in the Private Beta delivery phase and plan to add
            more features in future releases.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HomeHeaderSection;
