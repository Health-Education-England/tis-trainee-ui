import { useState } from "react";
import { Card, SummaryList, Button, Row, Col } from "nhsuk-react-components";
import history from "../../navigation/history";
import dayjs from "dayjs";
import { CctNameModal } from "./CctNameModal";
import style from "../../Common.module.scss";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { handleCctSubmit } from "../../../utilities/CctUtilities";

export function CctCalcSummary() {
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const [showCctNameModal, setShowCctNameModal] = useState(false);
  const handleProgModalClose = () => {
    setShowCctNameModal(false);
  };
  const newCalcMade = useAppSelector(state => state.cct.newCalcMade);
  const viewedCalc = useAppSelector(state => state.cct.cctCalc);
  const { programmeMembership, cctDate, changes, name, id } = viewedCalc;

  const handleSave = () => {
    if (id) {
      handleCctSubmit(startSubmitting, stopSubmitting, viewedCalc);
    } else {
      setShowCctNameModal(true);
    }
  };

  return (
    <>
      <Card>
        <Card.Content>
          <Card.Heading data-cy="cct-calc-summary-header">
            CCT Calculation Summary
          </Card.Heading>
          {name && (
            <p style={{ margin: 0 }}>
              <b>Saved calculation name: </b>
              {name}
            </p>
          )}
          <h3 className={style.panelSubHeader}>Linked Programme</h3>
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Key>Programme name</SummaryList.Key>
              <SummaryList.Value>{programmeMembership.name}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Start date</SummaryList.Key>
              <SummaryList.Value>
                {dayjs(programmeMembership.startDate).format("DD/MM/YYYY")}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Completion date</SummaryList.Key>
              <SummaryList.Value>
                {dayjs(programmeMembership.endDate).format("DD/MM/YYYY")}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          <h3 className={style.panelSubHeader}>Current WTE percentage</h3>
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Key>WTE</SummaryList.Key>
              <SummaryList.Value>
                {programmeMembership.wte && programmeMembership.wte * 100}%
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          <h3 className={style.panelSubHeader}>Proposed changes</h3>
          {changes.map((change, index) => (
            <div key={index}>
              <SummaryList noBorder>
                <SummaryList.Row>
                  <SummaryList.Key>Change type</SummaryList.Key>
                  <SummaryList.Value>
                    {change.type === "LTFT" && "Changing hours (LTFT)"}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Change date</SummaryList.Key>
                  <SummaryList.Value>
                    {dayjs(change.startDate).format("DD/MM/YYYY")}
                  </SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Proposed WTE</SummaryList.Key>
                  <SummaryList.Value>
                    {change.wte && change.wte * 100}%
                  </SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </div>
          ))}
          <SummaryList noBorder>
            <SummaryList.Row>
              <SummaryList.Key>New completion date</SummaryList.Key>
              <SummaryList.Value style={{ color: "green", fontWeight: "bold" }}>
                {cctDate && dayjs(cctDate).format("DD/MM/YYYY")}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
      <Row>
        {newCalcMade && (
          <Col width="one-third">
            <Button
              type="button"
              onClick={handleSave}
              data-cy="Btn-name-this-calc"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </Col>
        )}
        <Col width="one-third">
          <Button
            secondary
            type="button"
            onClick={() => {
              history.push("/cct/create");
            }}
            data-cy="Btn-back-to-cct-create"
          >
            Edit calculation
          </Button>
        </Col>
      </Row>
      <CctNameModal
        isOpen={showCctNameModal}
        onClose={handleProgModalClose}
        viewedCalc={viewedCalc}
      />
    </>
  );
}
