import React from "react";
import { Details, Card, BodyText } from "nhsuk-react-components";
import { PlacementPanel } from "./PlacementPanel";
import { Placement } from "../../../models/Placement";
import style from "../placements/Placements.module.scss";
interface IPlacementProps {
  placements: Placement[];
}

const Placements: React.FC<IPlacementProps> = ({ placements }) => {
  const sortedPlacements = [...placements].sort((a: Placement, b: Placement) =>
    a.startDate > b.startDate ? -1 : b.startDate > a.startDate ? 1 : 0
  );

  return (
    placements && (
      <Details expander data-cy="placementsExpander">
        <Details.Summary>Placements</Details.Summary>
        <Details.Text>
          <Card.Group>
            {placements.length > 0 ? (
              sortedPlacements.map((placement: Placement, index: number) => (
                <Card.GroupItem key={index} width="one-half">
                  <Card className={style.cardContainer}>
                    <PlacementPanel panelKey={index} placement={placement} />
                  </Card>
                </Card.GroupItem>
              ))
            ) : (
              <BodyText>You are not assigned to a placement.</BodyText>
            )}
          </Card.Group>
        </Details.Text>
      </Details>
    )
  );
};

export default Placements;
