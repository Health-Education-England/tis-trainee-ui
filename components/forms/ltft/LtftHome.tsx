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
import { LtftSummaryObj } from "../../../redux/slices/ltftSummaryListSlice";
import LtftSummary from "./LtftSummary";
import { mockLtftsList1 } from "../../../mock-data/mock-ltft-data";
import { DateUtilities } from "../../../utilities/DateUtilities";

export function LtftHome() {
  // TODO: remove the mock data mockLtftsList1 and resume the data from useAppSelector when ready
  const ltftSummary = mockLtftsList1 || [];
  const ltftSummaryStatus = "succeeded";
  // const dispatch = useAppDispatch();
  // const isBetaTester = useIsBetaTester();
  // useEffect(() => {
  //   if (isBetaTester) dispatch(fetchLtftSummaryList());
  // }, [dispatch, isBetaTester]);

  // const ltftSummary = useAppSelector(
  //   state => state.ltftSummaryList?.ltftList || []
  // );
  // const ltftSummaryStatus = useAppSelector(
  //   state => state.ltftSummaryList?.status
  // );

  const sortedLtftSummary = DateUtilities.genericSort(
    ltftSummary.slice(),
    "lastModified",
    true
  );

  const draftOrUnsubmittedLtftSummary = sortedLtftSummary.find(
    item => item.status === "DRAFT" || item.status === "UNSUBMITTED"
  );
  const previousLtftSummaries = sortedLtftSummary.filter(
    item => item.status !== "DRAFT" && item.status !== "UNSUBMITTED"
  );

  return (
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
            ltftSummaryStatus={ltftSummaryStatus}
            ltftSummaryList={previousLtftSummaries}
          />
        </Card.Content>
      </Card>
    </>
  );
}

type TrackerSectionBtnsProps = {
  draftOrUnsubmittedLtftSummary: LtftSummaryObj | undefined;
};

function TrackerSectionBtns({
  draftOrUnsubmittedLtftSummary
}: Readonly<TrackerSectionBtnsProps>) {
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
              <Button secondary data-cy="ltft-startover-btn">
                Start over
              </Button>
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
