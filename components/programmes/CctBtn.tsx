import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  openCctModal,
  setCurrentProgEndDate,
  setNewEndDates,
  setProgName
} from "../../redux/slices/cctCalcSlice";
import { Button, Card, Label } from "nhsuk-react-components";

type CctBtnProps = {
  progName: string;
  endDate: Date | string;
};

export function CctBtn({ progName, endDate }: Readonly<CctBtnProps>) {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(state => state.cctCalc.modalOpen);

  const handleClick = () => {
    dispatch(openCctModal());
    dispatch(setProgName(progName));
    dispatch(setCurrentProgEndDate(endDate));
    dispatch(setNewEndDates([]));
  };
  return (
    <Card className="cct-card">
      <Card.Content>
        <Label size="s">Thinking of changing your hours?</Label>
        <Button
          id="cct-btn"
          type="button"
          data-cy="cctBtn"
          onClick={handleClick}
          disabled={modalState}
          title="Completion Date estimate button"
        >
          <span>{"Get CCT estimate"}</span>
          <FontAwesomeIcon
            icon={faCalculator}
            size="lg"
            data-cy={`${CctBtn}-fa-calculator`}
          />
        </Button>
      </Card.Content>
    </Card>
  );
}
