import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Table
} from "nhsuk-react-components";
import { LtftTracker } from "./LtftTracker";
import history from "../../navigation/history";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import useIsBetaTester from "../../../utilities/hooks/useIsBetaTester";
import { useEffect } from "react";
import { fetchLtftSummaryList } from "../../../redux/slices/ltftSummaryListSlice";
import LtftSummary from "./LtftSummary";

export function LtftHome() {
  const dispatch = useAppDispatch();
  const isBetaTester = useIsBetaTester();

  useEffect(() => {
    if (isBetaTester) dispatch(fetchLtftSummaryList());
  }, [dispatch, isBetaTester]);

  // const ltftSummaryList = useAppSelector(state => state.ltftSummaryList);
  const ltftSummaryList = useAppSelector(
    state => state.ltftSummaryList?.ltftList || []
  );

  return (
    <Card>
      <Card.Content>
        <Card.Heading data-cy="ltft-tracker-header">
          New Application
        </Card.Heading>
        <LtftTracker />
        <TrackerBtns />
      </Card.Content>
      <Card.Content>
        <Card.Heading data-cy="ltft-summary-header">
          Applications summary
        </Card.Heading>
        <LtftSummary ltftSummaryList={ltftSummaryList} />
        {/* <LtftSummary /> */}
      </Card.Content>
    </Card>
  );
}

function TrackerBtns() {
  return (
    <div style={{ marginTop: "2rem" }}>
      <Container>
        <Row>
          <Col width="full">
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
    </div>
  );
}
