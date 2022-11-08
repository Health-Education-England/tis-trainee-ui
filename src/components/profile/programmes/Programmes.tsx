import React from "react";
import { Card, Details } from "nhsuk-react-components";
import { ProgrammePanel } from "./ProgrammePanel";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import dayjs from "dayjs";
import COJ from "../../forms/coj/COJ";
import style from "../programmes/Programmes.module.scss";

interface IProgramProps {
  programmeMemberships: ProgrammeMembership[];
}

const Programmes: React.FC<IProgramProps> = ({ programmeMemberships }) => {
  const sortedProgrammes = [...programmeMemberships].sort(
    (a: ProgrammeMembership, b: ProgrammeMembership) =>
      a.startDate > b.startDate ? -1 : b.startDate > a.startDate ? 1 : 0
  );

  const filteredProgrammesArr = [
    {
      key: "Current Programmes",
      value: sortedProgrammes.filter(
        pr => dayjs(pr.endDate) >= dayjs() && dayjs(pr.startDate) <= dayjs()
      )
    },
    {
      key: "Future Programmes",
      value: sortedProgrammes.filter(pr => dayjs(pr.startDate) > dayjs())
    },
    {
      key: "Past Programmes",
      value: sortedProgrammes.filter(pr => dayjs(pr.endDate) < dayjs())
    }
  ];

  return (
    <>
      <COJ sortedProgrammes={sortedProgrammes} />
      <Card feature>
        <Card.Content>
          <Card.Heading>Programmes</Card.Heading>
          <Details.ExpanderGroup>
            {filteredProgrammesArr.map(({ key, value }, index) => (
              <Details key={index} expander data-cy="">
                <Details.Summary>{key}</Details.Summary>
                <Details.Text>
                  <Card.Group>
                    {value.length > 0 ? (
                      value.map(
                        (
                          programmeMembership: ProgrammeMembership,
                          index: number
                        ) => (
                          <Card.GroupItem key={index} width="one-half">
                            <Card className={style.cardContainer}>
                              <ProgrammePanel
                                key={index}
                                programmeMembership={programmeMembership}
                              />{" "}
                            </Card>
                          </Card.GroupItem>
                        )
                      )
                    ) : (
                      <NoPl />
                    )}
                  </Card.Group>
                </Details.Text>
              </Details>
            ))}
          </Details.ExpanderGroup>
        </Card.Content>
      </Card>
    </>
  );
};

function NoPl() {
  return <Details.Text>You have no Programmes.</Details.Text>;
}

export default Programmes;
