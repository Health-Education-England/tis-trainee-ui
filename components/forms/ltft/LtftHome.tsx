import {
  Card,
  Col,
  Container,
  Row,
  WarningCallout
} from "nhsuk-react-components";
import LtftSummary from "./LtftSummary";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppSelector } from "../../../redux/hooks/hooks";
import Loading from "../../common/Loading";
import ErrorPage from "../../common/ErrorPage";
import { useLtftHomeStartover } from "../../../utilities/hooks/useLtftHomeStartover";
import { Link } from "react-router-dom";

export function LtftHome() {
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
      <WarningCallout data-cy="cct-home-warning">
        <WarningCallout.Label visuallyHiddenText={false}>
          Important
        </WarningCallout.Label>
        <p>
          To meet national guidance, all Changing hours (LTFT) applications must
          be submitted <b>a minimum of 16 weeks before your LTFT start date</b>.
        </p>
        <p>
          This allows Trusts the required <b>12 weeks' notice</b> under the Code
          of Practice, giving them time to make rota changes, update work
          schedules, and ensure your placement is appropriately planned.
        </p>
      </WarningCallout>
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
                  To begin a new application{" "}
                  <Link to="/cct" data-cy="cct-link">
                    please go to your list of saved CCT calculations
                  </Link>{" "}
                  and click the button to apply for Changing hours (LTFT).
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
    </>
  );
}
