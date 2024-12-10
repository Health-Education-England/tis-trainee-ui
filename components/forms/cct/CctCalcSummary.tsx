import { useState } from "react";
import { Card, SummaryList, Button, Row, Col } from "nhsuk-react-components";
import history from "../../navigation/history";
import dayjs from "dayjs";
import { CctNameModal } from "./CctNameModal";
import style from "../../Common.module.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hooks";
import { useSubmitting } from "../../../utilities/hooks/useSubmitting";
import { handleCctSubmit } from "../../../utilities/CctUtilities";
import { FormRUtilities } from "../../../utilities/FormRUtilities";
import { CalcDetails } from "./CctCalcCreate";
import ErrorPage from "../../common/ErrorPage";
import { updatedFormSaveStatus } from "../../../redux/slices/cctSlice";

export function CctCalcSummary() {
  const dispatch = useAppDispatch();
  const { isSubmitting, startSubmitting, stopSubmitting } = useSubmitting();
  const [showCctNameModal, setShowCctNameModal] = useState(false);
  const handleProgModalClose = () => {
    setShowCctNameModal(false);
  };
  const cctFormSaveStatus = useAppSelector(state => state.cct.formSaveStatus);
  const newCalcMade = useAppSelector(state => state.cct.newCalcMade);
  const viewedCalc = useAppSelector(state => state.cct.cctCalc);
  const {
    programmeMembership,
    cctDate,
    changes,
    name,
    id,
    created,
    lastModified
  } = viewedCalc;

  const handleSave = () => {
    dispatch(updatedFormSaveStatus("idle"));
    if (id) {
      handleCctSubmit(startSubmitting, stopSubmitting, viewedCalc);
    } else {
      setShowCctNameModal(true);
    }
  };

  return (
    <>
      <Card className="pdf-visible">
        <Card.Content>
          <Card.Heading data-cy="cct-calc-summary-header">
            CCT Calculation Summary
          </Card.Heading>
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
              <SummaryList.Value
                style={{ color: "green", fontWeight: "bold" }}
                data-cy="saved-cct-date"
              >
                {cctDate && dayjs(cctDate).format("DD/MM/YYYY")}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {name && created && lastModified && (
            <CalcDetails
              created={created}
              lastModified={lastModified}
              name={name}
            />
          )}
        </Card.Content>
      </Card>
      <Row>
        <Col width="full">
          {cctFormSaveStatus === "failed" && (
            <ErrorPage message="There was a problem saving your calculation. Please try again." />
          )}
        </Col>
      </Row>
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
              dispatch(updatedFormSaveStatus("idle"));
              history.push("/cct/create");
            }}
            data-cy="Btn-back-to-cct-create"
          >
            Edit calculation
          </Button>
        </Col>
        <Col width="one-third">
          <Button
            reverse
            type="button"
            onClick={() => {
              FormRUtilities.windowPrint();
            }}
            data-cy="Btn-cct-save-pdf"
          >
            Save PDF
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
