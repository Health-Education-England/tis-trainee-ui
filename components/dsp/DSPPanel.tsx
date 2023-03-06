import { Card, SummaryList } from "nhsuk-react-components";
import style from "../../components/Common.module.scss";
import { PANEL_KEYS } from "../../utilities/Constants";
import { displayListVal } from "../common/PanelsCreator";

type DSPPanelProps = {
  profName: string;
  profData: any;
  paramState?: string;
};

const plKeys = [
  "startDate",
  "endDate",
  "site",
  "grade",
  "specialty",
  "employingBody",
  "nationalPostNumber"
];
const prKeys = ["programmeName", "startDate", "endDate"];

export default function DSPPanel({ profName, profData }: DSPPanelProps) {
  const filteredProf = filterProfData(profName, profData);
  const panelHeader = profName === "programmes" ? "Programme" : "Placement";

  return filteredProf ? (
    <Card className={style.panelDiv}>
      <Card.Heading>{`${panelHeader} credential`}</Card.Heading>
      <SummaryList>
        {Object.keys(filteredProf).map((panelProp, index) => {
          const propKey =
            panelHeader === "Programme" ? prKeys[index] : plKeys[index];
          return (
            <SummaryList.Row key={index}>
              <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                {PANEL_KEYS[panelProp]}
              </SummaryList.Key>
              <SummaryList.Value data-cy={`${panelProp}${index}Val`}>
                {displayListVal(profData[propKey], propKey)}
              </SummaryList.Value>
            </SummaryList.Row>
          );
        })}
      </SummaryList>
    </Card>
  ) : null;
}

function filterProfData(pName: string, pData: any) {
  if (pName === "programmes") {
    const {
      curricula,
      managingDeanery,
      programmeCompletionDate,
      programmeMembershipType,
      programmeNumber,
      programmeTisId,
      signature,
      status,
      tisId,
      ...filteredProgData
    } = pData;
    return filteredProgData;
  } else {
    const {
      placementType,
      signature,
      siteLocation,
      status,
      tisId,
      trainingBody,
      wholeTimeEquivalent,
      ...filteredPlacData
    } = pData;
    return filteredPlacData;
  }
}
