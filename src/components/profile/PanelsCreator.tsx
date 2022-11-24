import { BodyText, Card, Details, SummaryList } from "nhsuk-react-components";
import { Curriculum } from "../../models/ProgrammeMembership";
import { PanelKeys } from "../../utilities/Constants";
import { DateUtilities } from "../../utilities/DateUtilities";
import { StringUtilities } from "../../utilities/StringUtilities";
import style from "../Common.module.scss";
import { Curricula } from "./Curricula";

type PanelsCreatorProps<P> = {
  panelsArr: P[];
  panelsName: string;
  panelsTitle: string;
  panelKeys: PanelKeys;
};

export function PanelsCreator<P extends {}>({
  panelsArr,
  panelsName,
  panelsTitle,
  panelKeys
}: PanelsCreatorProps<P>) {
  return (
    <Details expander data-cy={`${panelsName}Expander`}>
      <Details.Summary>{panelsTitle}</Details.Summary>
      <Details.Text>
        <Card.Group>
          {panelsArr.length > 0 ? (
            panelsArr.map((panel: P, index: number) => (
              <Card.GroupItem key={index} width="one-half">
                <Card className={style.cardContainer}>
                  <div className={style.panelDiv}>
                    <SummaryList>
                      {Object.keys(panel).map((panelProp, index) => (
                        <SummaryList.Row key={index}>
                          <SummaryList.Key data-cy={`${panelProp}${index}Key`}>
                            {panelKeys[panelProp as keyof PanelKeys]}
                          </SummaryList.Key>
                          <SummaryList.Value
                            data-cy={`${panelProp}${index}Val`}
                          >
                            {panelProp === "curricula" ? (
                              <Curricula
                                curricula={
                                  panel[
                                    panelProp as keyof P
                                  ] as unknown as Curriculum[]
                                }
                              />
                            ) : (
                              displayListVal(
                                panel[panelProp as keyof P],
                                panelProp
                              )
                            )}
                          </SummaryList.Value>
                        </SummaryList.Row>
                      ))}
                    </SummaryList>
                  </div>
                </Card>
              </Card.GroupItem>
            ))
          ) : (
            <BodyText
              data-cy={`notAssigned${panelsName}`}
            >{`You are not assigned to any ${panelsTitle}.`}</BodyText>
          )}
        </Card.Group>
      </Details.Text>
    </Details>
  );
}

function displayListVal<T>(
  val: T extends Date | string ? any : any,
  k: string
) {
  switch (k) {
    case "endDate":
      return DateUtilities.ToLocalDate(val);
    case "startDate":
      return DateUtilities.ToLocalDate(val);
    case "wholeTimeEquivalent":
      return StringUtilities.TrimZeros(val);
    default:
      return val ? val : "None provided";
  }
}
