import React from "react";
import { BackLink, Fieldset } from "nhsuk-react-components";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { OnboardingTrackerActions } from "./OnboardingTrackerActions";
import history from "../../navigation/history";
import ScrollToTop from "../../common/ScrollToTop";
import ErrorPage from "../../common/ErrorPage";

export function OnboardingTracker() {
  const { id } = useParams<{ id: string }>();

  const panel = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      prog => prog.tisId === id
    )
  );

  return panel ? (
    <>
      <ScrollToTop errors={[]} page={0} isPageDirty={false} />
      <BackLink
        data-testid="backLink-to-programmes"
        className="back-link"
        data-cy="backLink"
        onClick={() => history.push("/programmes")}
      >
        Back to Programmes list
      </BackLink>
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          data-cy="onboardingTrackerHeading"
          tabIndex={0}
          style={{ color: "#005eb8" }}
        >
          {`Onboarding Tracker for ${panel?.programmeName}`}
        </Fieldset.Legend>
      </Fieldset>
      <OnboardingTrackerActions panel={panel} />
    </>
  ) : (
    <ErrorPage message="No Tracker data found for this programme. Please try again." />
  );
}
