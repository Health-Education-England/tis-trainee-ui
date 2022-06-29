import React from "react";
import { Col, Details, Row } from "nhsuk-react-components";
import { ProgrammePanel } from "./ProgrammePanel";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import styles from "../placements/Placements.module.scss";

interface IProgramProps {
  programmeMemberships: ProgrammeMembership[];
}

const Programmes: React.FC<IProgramProps> = ({ programmeMemberships }) => {
  const columnWidths: any[] = ["full", "full", "one-half"];
  let columnWidth = columnWidths[programmeMemberships?.length]
    ? columnWidths[programmeMemberships?.length]
    : "one-half";

  return (
    programmeMemberships && (
      <Details expander data-cy="programmesExpander">
        <Details.Summary>Programmes</Details.Summary>
        <Details.Text>
          <Row className={styles.flexRow}>
            {programmeMemberships.length === 0 ? (
              <div>You are not assigned to any programme</div>
            ) : (
              programmeMemberships.map(
                (
                  programmeMembership: ProgrammeMembership,
                  index: string | number | undefined
                ) => (
                  <Col key={index} width={columnWidth}>
                    <ProgrammePanel
                      key={index}
                      programmeMembership={programmeMembership}
                    />
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

export default Programmes;
