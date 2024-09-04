import { useAppDispatch, useAppSelector } from "../../redux/hooks/hooks";
import {
  openCctModal,
  setCurrentProgEndDate,
  setDialogYPosition,
  setProgName,
  setPropStartDate
} from "../../redux/slices/cctCalcSlice";
import { Button, Label, SummaryList } from "nhsuk-react-components";
import { calcDefaultPropStartDate } from "../../utilities/CctUtilities";
import { Link } from "react-router-dom";

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
    <>
      <SummaryList.Row>
        <SummaryList.Key>
          <Label size="s">Thinking of changing your hours?</Label>
        </SummaryList.Key>
        <SummaryList.Value>
          <Link to="/notifications">
            See your LTFT notification for more details on how to apply
          </Link>
        </SummaryList.Value>
      </SummaryList.Row>
      <SummaryList.Row>
        <SummaryList.Key>
          <Label size="s">
            Need a rough idea how changing your hours could affect your end
            date?
          </Label>
        </SummaryList.Key>
        <SummaryList.Value>
          <Button
            secondary
            id="cct-btn"
            type="button"
            data-cy={`cctBtn-${progName}`}
            onClick={handleClick}
            disabled={modalState}
            title="Open CCT Calculator"
          >
            <span>{"Open CCT Calculator"}</span>
          </Button>
        </SummaryList.Value>
      </SummaryList.Row>
    </>
  );
}
