import {
  ActionLink,
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
  LtftSummaryObj,
  updatedLtftFormsRefreshNeeded
} from "../../../redux/slices/ltftSummaryListSlice";
import LtftSummary from "./LtftSummary";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import Loading from "../../common/Loading";
import { StartOverButton } from "../StartOverButton";
import { loadTheSavedForm } from "../../../utilities/FormBuilderUtilities";
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
            <Card.Heading data-cy="ltft-tracker-header">
              {draftOrUnsubmittedLtftSummary
                ? "In progress application"
                : "New application"}
            </Card.Heading>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus={ltftFormsListStatus}
              ltftSummaryList={draftOrUnsubmittedLtftSummary}
            />
            <Container>
              <Row>
                <Col width="full">
                  <Link to="/cct" data-cy="cct-link">
                    Click here to choose a CCT Calculation to begin a new
                    Changing hours (LTFT) application
                  </Link>
                </Col>
              </Row>
            </Container>
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
            ltftSummaryType="PREVIOUS"
            ltftSummaryStatus={ltftFormsListStatus}
            ltftSummaryList={previousLtftSummaries}
          />
        </Card.Content>
      </Card>
    </>
  );
}
