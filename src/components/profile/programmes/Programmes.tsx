import React from "react";
import { BodyText, Card, Details } from "nhsuk-react-components";
import { ProgrammePanel } from "./ProgrammePanel";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import style from "../programmes/Programmes.module.scss";
interface IProgramProps {
  programmeMemberships: ProgrammeMembership[];
}

const Programmes: React.FC<IProgramProps> = ({ programmeMemberships }) => {
  return (
    programmeMemberships && (
      <Details expander data-cy="programmesExpander">
        <Details.Summary>Programmes</Details.Summary>
        <Details.Text>
          <Card.Group>
            {programmeMemberships.length > 0 ? (
              programmeMemberships.map(
                (programme: ProgrammeMembership, index: number) => (
                  <Card.GroupItem key={index} width="one-half">
                    <Card className={style.cardContainer}>
                      <ProgrammePanel
                        panelKey={index}
                        programmeMembership={programme}
                      />
                    </Card>
                  </Card.GroupItem>
                )
              )
            ) : (
              <BodyText>You are not assigned to any programme</BodyText>
            )}
          </Card.Group>
        </Details.Text>
      </Details>
    )
  );
};

export default Programmes;
