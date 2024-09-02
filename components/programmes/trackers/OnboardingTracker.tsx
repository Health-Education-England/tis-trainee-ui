import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BackLink, Fieldset } from "nhsuk-react-components";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { OnboardingTrackerType } from "../../../models/Tracker";
import ErrorPage from "../../common/ErrorPage";
import { mockOnboardingTrackerStatus1 } from "../../../mock-data/mockOnboardingTrackerStatus";
import { OnboardingTrackerActions } from "./OnboardingTrackerActions";
import Loading from "../../common/Loading";
import dayjs from "dayjs";
import history from "../../navigation/history";
import ScrollToTop from "../../common/ScrollToTop";

export function OnboardingTracker() {
  const [trackerData, setTrackerData] = useState<OnboardingTrackerType>(
    mockOnboardingTrackerStatus1
  );
  const [loading, setLoading] = useState<boolean>(false); // set to true when API is ready
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const panel = useAppSelector(state =>
    state.traineeProfile.traineeProfileData.programmeMemberships.find(
      prog => prog.tisId === id
    )
  );

  // TODO: Have a useEffect to fetch the tracker data when status/API work is done, then uncomment the rest of the code.

  // if (loading) {
  //   return <Loading />;
  // }

  // if (errorMsg) {
  //   return (
  //     <ErrorPage
  //       header="Oops! There was a problem fetching your Tracker data."
  //       message={`Please check your internet connection and click the NHS logo to reload the page. If the problem persists, please contact Support with a screenshot of this error if possible. (Error: ${errorMsg})`}
  //     />
  //   );
  // }

  return (
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
          The 'New Programme' onboarding journey
        </Fieldset.Legend>
        {/* TODO Show the linkage when status/API work is done */}
        {/* <h2 tabIndex={0} style={{ marginBottom: 0 }}>
          {panel?.programmeName}
        </h2>
        <p tabIndex={0}>
          <b>{`Starting ${dayjs(panel?.startDate).format("DD/MM/YYYY")}`}</b>
        </p> */}
      </Fieldset>
      <OnboardingTrackerActions
        trackerStatusData={trackerData.trackerStatus}
        progStartDate={panel?.startDate}
      />
    </>
  );
}
