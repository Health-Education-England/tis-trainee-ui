import React from "react";
import { Details, Row, Col } from "nhsuk-react-components";
import { PlacementPanel } from "./PlacementPanel";
import { Placement } from "../../../models/Placement";
import styles from "./Placements.module.scss";

interface IPlacementProps {
  placements: Placement[];
}

const Placements: React.FC<IPlacementProps> = ({ placements }) => {
  const columnWidths: any[] = ["full", "full", "one-half"];
  let columnWidth = columnWidths[placements?.length]
    ? columnWidths[placements?.length]
    : "one-half";

  return (
    placements && (
      <Details expander data-cy="placementsExpander">
        <Details.Summary>Placements</Details.Summary>
        <Details.Text>
          <Row className={styles.flexRow}>
            {placements.length === 0 ? (
              <div>You are not assigned to any placement</div>
            ) : (
              [...placements]
                .sort((a: Placement, b: Placement) =>
                  a.startDate > b.startDate
                    ? -1
                    : b.startDate > a.startDate
                    ? 1
                    : 0
                )
                .map(
                  (
                    placement: Placement,
                    index: number | string | undefined
                  ) => (
                    <Col key={index} width={columnWidth}>
                      <PlacementPanel key={index} placement={placement} />
                    </Col>
                  )
                )
            )}
          </Row>
        </Details.Text>
      </Details>
    )
  );
};

export default Placements;
