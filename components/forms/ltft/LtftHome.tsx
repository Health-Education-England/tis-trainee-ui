import { useState } from "react";
import { Button, Card, Col, Container, Row } from "nhsuk-react-components";
import LtftSummary from "./LtftSummary";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import Loading from "../../common/Loading";
import ErrorPage from "../../common/ErrorPage";
import { useLtftHomeStartover } from "../../../utilities/hooks/useLtftHomeStartover";
import history from "../../navigation/history";
import { LtftDeclarationsModal } from "./LtftDeclarationsModal";
import { populateLtftDraftNew } from "../../../utilities/ltftUtilities";
import { updatedLtft } from "../../../redux/slices/ltftSlice";

import { ExpanderMsg } from "../../common/ExpanderMsg";

type LtftHomeProps = {
  pmOptions: { value: string; label: string }[];
};

export function LtftHome({ pmOptions }: LtftHomeProps) {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const tpData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const ltftSummary = useAppSelector(
    state => state.ltftSummaryList?.ltftList || []
  );
  const ltftFormsListStatus = useAppSelector(
    state => state.ltftSummaryList?.status
  );
  useLtftHomeStartover();

  const sortedLtftSummary = DateUtilities.genericSort(
    ltftSummary.slice(),
    "lastModified",
    true
  );
  const previousLtftSummaries = sortedLtftSummary.filter(
    item => item.status !== "DRAFT" && item.status !== "UNSUBMITTED"
  );

  // Code to trigger hotjar survey via gtag (GA event)
  if (previousLtftSummaries.length > 0) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "at_least_one_submitted_ltft");
    }
  }

  const draftOrUnsubmittedLtftSummary = ltftSummary.filter(
    item => item.status === "DRAFT" || item.status === "UNSUBMITTED"
  );

  if (ltftFormsListStatus === "loading") return <Loading />;

  if (ltftFormsListStatus === "failed")
    return <ErrorPage message="There was a problem loading this page." />;

  return (
    <>
      <ExpanderMsg expanderName="whatIsLtft" />
      <ExpanderMsg expanderName="skilledVisaWorker" />
      <Card>
        <Card.Content>
          <>
            <Card.Heading data-cy="ltft-in-progress-header">
              In progress applications
            </Card.Heading>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus={ltftFormsListStatus}
              ltftSummaryList={draftOrUnsubmittedLtftSummary}
            />
            <Container>
              <Row style={{ fontSize: "19px" }}>
                <Col width="full">
                  {pmOptions.length ? (
                    <Button onClick={() => setIsModalOpen(true)}>
                      Make a new application
                    </Button>
                  ) : (
                    <p>
                      You are not eligible to make a Less Than Full Time
                      application at this time as you have no active current or
                      upcoming Programmes.
                    </p>
                  )}
                </Col>
              </Row>
            </Container>
          </>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Heading data-cy="ltft-previous-header">
            Previous applications
          </Card.Heading>
          <LtftSummary
            ltftSummaryType="PREVIOUS"
            ltftSummaryStatus={ltftFormsListStatus}
            ltftSummaryList={previousLtftSummaries}
          />
        </Card.Content>
      </Card>
      <LtftDeclarationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          const draftLtft = populateLtftDraftNew(
            tpData.personalDetails,
            tpData.traineeTisId
          );
          dispatch(updatedLtft(draftLtft));
          setIsModalOpen(false);
          history.push("/ltft/create");
        }}
      />
    </>
  );
}
