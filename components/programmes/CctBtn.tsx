import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalculator } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  openCctModal,
  setCurrentProgEndDate,
  setDialogYPosition,
  setProgName,
  setPropStartDate
} from "../../redux/slices/cctCalcSlice";
import { Button, Card, Label } from "nhsuk-react-components";
import { calcDefaultPropStartDate } from "../../utilities/CctUtilities";

type CctBtnProps = {
  progName: string;
  endDate: string;
  startDate: string;
};

export function CctBtn({
  progName,
  endDate,
  startDate
}: Readonly<CctBtnProps>) {
  const dispatch = useAppDispatch();
  const modalState = useAppSelector(state => state.cctCalc.modalOpen);
  const defaultPropStartDate = calcDefaultPropStartDate(startDate, endDate);

  const handleClick = () => {
    dispatch(setDialogYPosition(window.scrollY));
    dispatch(openCctModal());
    dispatch(setProgName(progName));
    dispatch(setCurrentProgEndDate(endDate));
    defaultPropStartDate.length > 0 &&
      dispatch(setPropStartDate(defaultPropStartDate));
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
          title="Open CCT Calculator"
        >
          <span>{"Open CCT Calculator"}</span>
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
