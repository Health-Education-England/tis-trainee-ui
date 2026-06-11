import { Button, Card, Col, Container, Row } from "nhsuk-react-components";
import { ExpanderMsg } from "../../common/ExpanderMsg";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import history from "../../navigation/history";
import { populateDeferralDraftNew } from "../../../utilities/deferralUtilities";
import { updatedDeferral } from "../../../redux/slices/deferralSlice";

type DeferralHomeProps = {
  pmOptions: { value: string; label: string }[];
};

export function DeferralHome({ pmOptions }: Readonly<DeferralHomeProps>) {
  const dispatch = useAppDispatch();
  const tpData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );

  const handleMakeNew = () => {
    const draftDeferral = populateDeferralDraftNew(
      tpData.personalDetails,
      tpData.traineeTisId
    );
    dispatch(updatedDeferral(draftDeferral));
    history.push("/deferral/create");
  };

  return (
    <>
      <ExpanderMsg expanderName="whatIsDeferral" />
      <Card>
        <Card.Content>
          <Card.Heading data-cy="deferral-home-header">
            In progress applications
          </Card.Heading>
          <p>You have no in progress applications.</p>
          <Container>
            <Row style={{ fontSize: "19px" }}>
              <Col width="full">
                {pmOptions.length ? (
                  <Button
                    data-cy="make-new-deferral-btn"
                    onClick={handleMakeNew}
                  >
                    Make a new application
                  </Button>
                ) : (
                  <p data-cy="no-eligable-pms-message">
                    You are not eligible to make a Deferral application at this
                    time as you have no active current or upcoming Programmes.
                  </p>
                )}
              </Col>
            </Row>
          </Container>
        </Card.Content>
      </Card>
    </>
  );
}
