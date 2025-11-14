import { useEffect } from "react";
import { TssUpdates, WhatsNewHeader } from "./TssUpdates";
import { useAppDispatch } from "../../redux/hooks/hooks";
import { fetchWhatsNew } from "../../redux/slices/tssUpdatesSlice";
import { useIsMobile } from "../../utilities/hooks/useIsMobile";
import { useIsShowNews } from "../../utilities/hooks/useIsShowNews";

export const HomeHeaderSection = () => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const isShowNews = useIsShowNews();

  useEffect(() => {
    if (!isMobile && isShowNews) dispatch(fetchWhatsNew());
  }, [dispatch, isMobile]);

  return (
    <section className="nhsuk-hero">
      <div className="nhsuk-width-container nhsuk-hero--border app-width-container">
        <div className="nhsuk-grid-row">
          <div
            className={
              isMobile
                ? "nhsuk-grid-column-full"
                : "nhsuk-grid-column-two-thirds"
            }
          >
            <div
              className={
                isMobile
                  ? "header-wrapper"
                  : "nhsuk-hero__wrapper app-hero__wrapper"
              }
            >
              <HomeWelcomeHeaderText />
              <HomeWelcomeSubHeaderText />
              {isMobile ? (
                <>
                  <br />
                  {isShowNews && <WhatsNewHeader />}
                </>
              ) : (
                <HomeWelcomeBodyText />
              )}
            </div>
          </div>
          {!isMobile && (
            <div className="nhsuk-grid-column-one-third tss-update-column">
              {isShowNews && <TssUpdates />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

function HomeWelcomeHeaderText() {
  return (
    <h1 data-cy="homeWelcomeHeaderText" className="nhsuk-u-margin-bottom-2">
      Welcome to
      <br />
      TIS Self-Service
    </h1>
  );
}

function HomeWelcomeSubHeaderText() {
  return (
    <p
      data-cy="homeWelcomeSubHeaderText"
      className="nhsuk-body-l nhsuk-u-margin-bottom-1"
    >
      Your post-graduate training programme resource
    </p>
  );
}

function HomeWelcomeBodyText() {
  return (
    <p
      data-cy="homeWelcomeBodyText"
      className="nhsuk-body-m nhsuk-u-margin-bottom-1"
    >
      Our goal is to improve your training experience by making TIS Self-Service
      a one-stop-shop for your training-related admin tasks. We are in the
      Private Beta phase of delivery so expect more features soon.
    </p>
  );
}
