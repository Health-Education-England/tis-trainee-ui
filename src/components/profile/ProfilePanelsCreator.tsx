import React from "react";
import { Details, Card } from "nhsuk-react-components";
import { PlacementPanel } from "../profile/placements/PlacementPanel";
import { ProgrammePanel } from "../profile/programmes/ProgrammePanel";
import { Placement } from "../../models/Placement";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import dayjs from "dayjs";
import style from "./Profile.module.scss";
import COJ from "../forms/coj/COJ";

type ProfileType = Placement | ProgrammeMembership;

type ProfilePanelsCreatorProps = {
  profileArr: ProfileType[];
  profileArrName: string;
};

export const ProfilePanelsCreator: React.FC<ProfilePanelsCreatorProps> = ({
  profileArr,
  profileArrName
}) => {
  const sortedArr = [...profileArr].sort((a: ProfileType, b: ProfileType) =>
    a.startDate > b.startDate ? -1 : b.startDate > a.startDate ? 1 : 0
  );

  const ProfileArrFiltered = [
    {
      key: `Current ${profileArrName}`,
      value: sortedArr.filter(
        pr => dayjs(pr.endDate) >= dayjs() && dayjs(pr.startDate) <= dayjs()
      )
    },
    {
      key: `Future ${profileArrName}`,
      value: sortedArr.filter(pr => dayjs(pr.startDate) > dayjs())
    },
    {
      key: `Past ${profileArrName}`,
      value: sortedArr.filter(pr => dayjs(pr.endDate) < dayjs())
    }
  ];
  return (
    <>
      {profileArrName === "Programmes" && (
        <COJ sortedProgrammes={sortedArr as ProgrammeMembership[]} />
      )}
      <Card feature>
        <Card.Content>
          <Card.Heading>{profileArrName}</Card.Heading>
          <Details.ExpanderGroup>
            {ProfileArrFiltered.map(({ key, value }, index) => (
              <Details key={index} expander data-cy="">
                <Details.Summary>{key}</Details.Summary>
                <Details.Text>
                  <Card.Group>
                    {value.length > 0 ? (
                      value.map((profileItem: ProfileType, index: number) => (
                        <Card.GroupItem key={index} width="one-half">
                          <Card className={style.cardContainer}>
                            {profileArrName === "Placements" ? (
                              <PlacementPanel
                                key={index}
                                placement={profileItem as Placement}
                              />
                            ) : (
                              <ProgrammePanel
                                key={index}
                                programmeMembership={
                                  profileItem as ProgrammeMembership
                                }
                              />
                            )}
                          </Card>
                        </Card.GroupItem>
                      ))
                    ) : (
                      <Details.Text>{`You have no ${profileArrName}.`}</Details.Text>
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
