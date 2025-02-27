import {
  Button,
  Card,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";
import history from "../../navigation/history";
import {
  fetchLtftSummaryList,
  LtftSummaryObj,
  updatedLtftFormsRefreshNeeded
} from "../../../redux/slices/ltftSummaryListSlice";
import LtftSummary from "./LtftSummary";
import { mockLtftsList1 } from "../../../mock-data/mock-ltft-data";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import { useEffect } from "react";
import Loading from "../../common/Loading";
import { StartOverButton } from "../StartOverButton";

export function LtftHome() {
  const ltftSummary = useAppSelector(
    state => state.ltftSummaryList?.ltftList || []
  );
  const ltftFormsListStatus = useAppSelector(
    state => state.ltftSummaryList?.status
  );
  const needLtftFormsRefresh = useAppSelector(
    state => state.ltftSummaryList?.ltftFormsRefreshNeeded
  );
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();
  useEffect(() => {
    if (isBetaTester) {
      dispatch(fetchLtftSummaryList());
      updatedLtftFormsRefreshNeeded(false);
    }
  }, [dispatch, isBetaTester, needLtftFormsRefresh]);

  // TODO - use real data for Summary Table when submission logic added
  const mockLtftSummary = mockLtftsList1;
  const sortedLtftSummary = DateUtilities.genericSort(
    mockLtftSummary.slice(),
    "lastModified",
    true
  );
  const previousLtftSummaries = sortedLtftSummary.filter(
    item => item.status !== "DRAFT" && item.status !== "UNSUBMITTED"
  );

  const draftOrUnsubmittedLtftSummary = ltftSummary.find(
    item => item.status === "DRAFT" || item.status === "UNSUBMITTED"
  );

  if (ltftFormsListStatus === "loading") return <Loading />;

  return (
    ltftFormsListStatus === "succeeded" && (
      <>
        <Card>
          <Card.Content>
            <>
              <Card.Heading data-cy="ltft-tracker-header">
                {draftOrUnsubmittedLtftSummary
                  ? "In progress application"
                  : "New application"}
              </Card.Heading>
              <LtftTracker
                draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
              />
              <TrackerSectionBtns
                draftOrUnsubmittedLtftSummary={draftOrUnsubmittedLtftSummary}
              />
            </>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <WarningCallout data-cy="ltftWarning">
              <WarningCallout.Label visuallyHiddenText={false}>
                For Demonstration Only
              </WarningCallout.Label>
              <p>
                The table below has <strong>dummy data</strong> and is read only
                for demonstrating the future layout of the LTFT Applications
                Summary.
              </p>
            </WarningCallout>
            <Card.Heading data-cy="ltft-summary-header">
              Previous applications summary
            </Card.Heading>
            <LtftSummary
              ltftSummaryStatus={ltftFormsListStatus}
              ltftSummaryList={previousLtftSummaries}
            />
          </Card.Content>
        </Card>
      </>
    )
  );
}

type TrackerSectionBtnsProps = {
  draftOrUnsubmittedLtftSummary: LtftSummaryObj | undefined;
};

function TrackerSectionBtns({
  draftOrUnsubmittedLtftSummary
}: Readonly<TrackerSectionBtnsProps>) {
  const dispatch = useAppDispatch();
  return (
    <div style={{ marginTop: "2rem" }}>
      {draftOrUnsubmittedLtftSummary ? (
        <Container>
          <Row>
            <Col width="two-thirds">
              <Button data-cy="continue-application-button">
                {`Continue ${
                  draftOrUnsubmittedLtftSummary?.status === "DRAFT"
                    ? "draft"
                    : "unsubmitted"
                } application`}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col width="one-third">
              <StartOverButton
                formName="ltft"
                isFormButton={false}
                formsListDraftId={draftOrUnsubmittedLtftSummary.id}
              />
            </Col>
          </Row>
        </Container>
      ) : (
        <Container>
          <Row>
            <Col width="two-thirds">
              <Button
                data-cy="choose-cct-btn"
                onClick={() => {
                  dispatch(updatedLtftFormsRefreshNeeded(false));
                  history.push("/cct");
                }}
              >
                Choose a CCT Calculation to begin your Changing hours (LTFT)
                application
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}
