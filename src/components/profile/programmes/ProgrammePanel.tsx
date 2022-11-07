import {
  Curriculum,
  ProgrammeMembership
} from "../../../models/ProgrammeMembership";
import { SummaryList } from "nhsuk-react-components";
import { DateUtilities } from "../../../utilities/DateUtilities";
import { CurriculumPanel } from "./CurriculumPanel";
import { DspIssueBtn } from "../dsp/DspIssueBtn";
import { PanelName } from "../../../models/TraineeProfile";
import style from "../programmes/Programmes.module.scss";
import DspMsg from "../dsp/DspMsg";

interface IProgrammePanelProps {
  panelKey: number;
  programmeMembership: ProgrammeMembership;
}

export const ProgrammePanel = ({
  panelKey,
  programmeMembership
}: IProgrammePanelProps) => {
  const {
    programmeName,
    programmeNumber,
    startDate,
    endDate,
    managingDeanery,
    curricula,
    tisId
  } = programmeMembership;
  const isPastDate = DateUtilities.IsPastDate(programmeMembership.endDate);
  return (
    <div className={style.panelDiv}>
      <SummaryList>
        <SummaryList.Row>
          <SummaryList.Key data-cy="progNameKey">
            Programme Name
          </SummaryList.Key>
          <SummaryList.Value data-cy="progNameValue">
            {programmeName}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>Programme Number</SummaryList.Key>
          <SummaryList.Value>{programmeNumber}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>Programme Start date</SummaryList.Key>
          <SummaryList.Value>
            {DateUtilities.ToLocalDate(startDate)}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>Programme End date</SummaryList.Key>
          <SummaryList.Value>
            {DateUtilities.ToLocalDate(endDate)}
          </SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>Owner</SummaryList.Key>
          <SummaryList.Value>{managingDeanery}</SummaryList.Value>
        </SummaryList.Row>

        <SummaryList.Row>
          <SummaryList.Key>Curricula</SummaryList.Key>
          <SummaryList.Value>
            {curricula.length === 0 ? (
              <div>N/A</div>
            ) : (
              curricula.map((curriculum: Curriculum, index: number) => (
                <CurriculumPanel key={index} curriculum={curriculum} />
              ))
            )}
          </SummaryList.Value>
        </SummaryList.Row>
        <DspMsg panelName={PanelName.Programme} />
      </SummaryList>
      <DspIssueBtn
        panelName={PanelName.Programme}
        panelId={tisId}
        panelKey={panelKey}
        isPastDate={isPastDate}
      ></DspIssueBtn>
    </div>
  );
};

export default ProgrammePanel;
