import React from "react";
import { Fieldset } from "nhsuk-react-components";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { OnboardingTrackerActions } from "./OnboardingTrackerActions";
import history from "../../navigation/history";
import ScrollToTop from "../../common/ScrollToTop";
import ErrorPage from "../../common/ErrorPage";
import FormBackLink from "../../common/FormBackLink";

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
      <FormBackLink
        history={history}
        path="/programmes"
        dataCy="backLink-to-programmes"
        text="Back to Programmes list"
      />
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
