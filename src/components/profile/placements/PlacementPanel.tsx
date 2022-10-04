import { Placement } from "../../../models/Placement";
import { Button, SummaryList } from "nhsuk-react-components";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { StringUtilities } from "../../../utilities/StringUtilities";

interface IDSPSection {
  children: React.ReactNode;
}

const DSPBtnSection = ({ children }: IDSPSection) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>{children}</div>
  );
};

interface IDspBtn {
  placement: Placement;
  panelKey: number;
}

const DSPBtn = ({ placement, panelKey }: IDspBtn) => {
  const cyTag = `btnDSPIssue${panelKey}`;
  let btnTxt: string = "";
  let isBtnDisabled: boolean = false;
  if (DateUtilities.IsPastDate(placement.endDate)) {
    btnTxt = "Past placements can't be added to your Digital Staff Passport";
    isBtnDisabled = true;
  } else
    btnTxt = "Click here to add this credential to your Digital Staff Passport";

  return (
    <Button
      style={{ minWidth: "90%", maxWidth: "90%" }}
      secondary
      onClick={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        console.dir(placement);
      }}
      disabled={isBtnDisabled}
      data-cy={cyTag}
    >
      {btnTxt}
    </Button>
  );
};
interface IPlacementPanelProps {
  placement: Placement;
  panelKey: number;
}

export const PlacementPanel = ({
  placement,
  panelKey
}: IPlacementPanelProps) => {
  return (
    <>
      <SummaryList>
        <SummaryList.Row>
          <SummaryList.Key data-cy="siteKey">Site</SummaryList.Key>
          <SummaryList.Value data-cy="siteValue">
            {placement.site}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Site Location</SummaryList.Key>
          <SummaryList.Value>{placement.siteLocation}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap">Starts</span>
          </SummaryList.Key>
          <SummaryList.Value>
            {DateUtilities.ToLocalDate(placement.startDate)}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Ends</SummaryList.Key>
          <SummaryList.Value>
            {DateUtilities.ToLocalDate(placement.endDate)}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key>Whole Time Equivalent</SummaryList.Key>
          <SummaryList.Value data-cy="wteValue">
            {StringUtilities.TrimZeros(placement.wholeTimeEquivalent)}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap" data-cy="specialtyKey">
              Specialty
            </span>
          </SummaryList.Key>
          <SummaryList.Value>{placement.specialty}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap" data-cy="grade">
              Grade
            </span>
          </SummaryList.Key>
          <SummaryList.Value>{placement.grade}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap" data-cy="placementType">
              Placement Type
            </span>
          </SummaryList.Key>
          <SummaryList.Value>{placement.placementType}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key data-cy="empBodyKey">Employing Body</SummaryList.Key>
          <SummaryList.Value>{placement.employingBody}</SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key data-cy="traBodyKey">Training Body</SummaryList.Key>
          <SummaryList.Value>{placement.trainingBody}</SummaryList.Value>
        </SummaryList.Row>
      </SummaryList>
      <DSPBtnSection>
        <DSPBtn placement={placement} panelKey={panelKey} />
      </DSPBtnSection>
    </>
  );
};

export default PlacementPanel;
