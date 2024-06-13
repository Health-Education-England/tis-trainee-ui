import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  openCctModal,
  setCurrentProgEndDate,
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
  };
  return (
    <Card className="cct-card">
      <Card.Content>
        <Label size="s" data-cy="cct-prompt-label">
          Thinking of changing your hours?
        </Label>
        <Button
          id="cct-btn"
          type="button"
          data-cy={`cctBtn-${progName}`}
          onClick={handleClick}
          disabled={modalState}
          title="Get CCT estimate"
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
