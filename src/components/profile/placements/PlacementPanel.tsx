import { Placement } from "../../../models/Placement";
import { SummaryList } from "nhsuk-react-components";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { StringUtilities } from "../../../utilities/StringUtilities";
import { DspIssueBtn } from "../dsp/DspIssueBtn";
import { PanelName } from "../../../models/TraineeProfile";
import style from "../placements/Placements.module.scss";
import DspMsg from "../dsp/DspMsg";
interface IPlacementPanelProps {
  placement: Placement;
  panelKey: number;
}

export const PlacementPanel = ({
  placement,
  panelKey
}: IPlacementPanelProps) => {
  const isPastDate = DateUtilities.IsPastDate(placement.endDate);

  return (
    <div className={style.panelDiv}>
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
          <SummaryList.Value data-cy="specialtyValue">
            {placement.specialty}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap" data-cy="grade">
              Grade
            </span>
          </SummaryList.Key>
          <SummaryList.Value data-cy="gradeValue">
            {placement.grade}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>
            <span className="noWrap" data-cy="placementType">
              Placement Type
            </span>
          </SummaryList.Key>
          <SummaryList.Value data-cy="placementTypeValue">
            {placement.placementType}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key data-cy="empBodyKey">Employing Body</SummaryList.Key>
          <SummaryList.Value data-cy="empBodyValue">
            {placement.employingBody}
          </SummaryList.Value>
        </SummaryList.Row>
        <SummaryList.Row>
          <SummaryList.Key data-cy="traBodyKey">Training Body</SummaryList.Key>
          <SummaryList.Value data-cy="traBodyValue">
            {placement.trainingBody}
          </SummaryList.Value>
        </SummaryList.Row>
        <DspMsg panelName={PanelName.Placement} />
      </SummaryList>
      <DspIssueBtn
        panelName={PanelName.Placement}
        panelId={placement.tisId}
        panelKey={panelKey}
        isPastDate={isPastDate}
      ></DspIssueBtn>
    </div>
  );
};

export default PlacementPanel;
