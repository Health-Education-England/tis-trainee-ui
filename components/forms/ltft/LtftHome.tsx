import { ActionLink, Card, Col, Container, Row } from "nhsuk-react-components";
import LtftSummary from "./LtftSummary";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
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

  const draftOrUnsubmittedLtftSummary = ltftSummary.filter(
    item => item.status === "DRAFT" || item.status === "UNSUBMITTED"
  );

  if (ltftFormsListStatus === "loading") return <Loading />;

  if (ltftFormsListStatus === "failed")
    return <ErrorPage message="There was a problem loading this page." />;

  return (
    <>
      <Card>
        <Card.Content>
          <>
            <Card.Heading data-cy="ltft-current-summary-header">
              In progress application
            </Card.Heading>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus={ltftFormsListStatus}
              ltftSummaryList={draftOrUnsubmittedLtftSummary}
            />
            <Container>
              <Row>
                <Col width="full">
                  <ActionLink>
                    <Link to="/cct" data-cy="cct-link">
                      Choose a CCT Calculation to begin a new Changing hours
                      (LTFT) application
                    </Link>
                  </ActionLink>
                </Col>
              </Row>
            </Container>
          </>
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <Card.Heading data-cy="ltft-previous-summary-header">
            Previous applications summary
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
