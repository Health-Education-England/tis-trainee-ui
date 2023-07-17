import GlobalAlert from "../main/GlobalAlert";

const HomeHeaderSection = () => {
  return (
    <>
      <section className="nhsuk-hero">
        <div className="nhsuk-width-container nhsuk-hero--border app-width-container">
          <div className="nhsuk-grid-row">
            <div className="nhsuk-grid-column-two-thirds">
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
                  Self-Service a one-stop-shop for your training-related admin
                  tasks. We are in the Private Beta phase of delivery so expect
                  more features soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <GlobalAlert />
    </>
  );
};

export default HomeHeaderSection;
