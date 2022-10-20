import React from "react";
import { Details, Card } from "nhsuk-react-components";
import { PlacementPanel } from "./PlacementPanel";
import { Placement } from "../../../models/Placement";
import dayjs from "dayjs";

interface IPlacementProps {
  placements: Placement[];
}

const Placements: React.FC<IPlacementProps> = ({ placements }) => {
  const sortedPlacements = [...placements].sort((a: Placement, b: Placement) =>
    a.startDate > b.startDate ? -1 : b.startDate > a.startDate ? 1 : 0
  );

  const filteredPlacementsArr = [
    {
      key: "Current Placements",
      value: sortedPlacements.filter(
        pl => dayjs(pl.endDate) >= dayjs() && dayjs(pl.startDate) <= dayjs()
      )
    },
    {
      key: "Future Placements",
      value: sortedPlacements.filter(pl => dayjs(pl.startDate) > dayjs())
    },
    {
      key: "Past Placements",
      value: sortedPlacements.filter(pl => dayjs(pl.endDate) < dayjs())
    }
  ];

  return (
    <Details.ExpanderGroup>
      {filteredPlacementsArr.map(({ key, value }, index) => (
        <Details key={index} expander data-cy="">
          <Details.Summary>{key}</Details.Summary>
          <Details.Text>
            <Card.Group>
              {value.length > 0 ? (
                value.map((placement: Placement, index: number) => (
                  <Card.GroupItem key={index} width="one-half">
                    <Card>
                      <Card.Content>
                        <PlacementPanel
                          panelKey={index}
                          placement={placement}
                        />
                      </Card.Content>
                    </Card>
                  </Card.GroupItem>
                ))
              ) : (
                <NoPl />
              )}
            </Card.Group>
          </Details.Text>
        </Details>
      ))}
    </Details.ExpanderGroup>
  );
};

function NoPl() {
  return <Details.Text>You have no Placements.</Details.Text>;
}

export default Placements;
