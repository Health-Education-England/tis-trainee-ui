import { BodyText, Table } from "nhsuk-react-components";
import React from "react";
import { NavLink } from "react-router-dom";
import { ProgrammeMembership } from "../../../models/ProgrammeMembership";
import { updatedViewedCojProg } from "../../../redux/slices/traineeProfileSlice";
import store from "../../../redux/store/store";
import { DateUtilities } from "../../../utilities/DateUtilities";

interface ICOJList {
  sortedProgrammes: ProgrammeMembership[];
}

const COJList: React.FC<ICOJList> = ({ sortedProgrammes }) => {
  if (sortedProgrammes.length > 0) {
    return (
      <Table responsive={true}>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Programme </Table.Cell>
            <Table.Cell>Dates</Table.Cell>
            <Table.Cell>Date CoJ signed</Table.Cell>
            <Table.Cell>Version</Table.Cell>
            <td> </td>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {sortedProgrammes.map((prog, index) => (
            <Table.Row key={`${index}${prog.programmeTisId}`}>
              <Table.Cell>{`${prog.programmeName} (${prog.programmeNumber})`}</Table.Cell>
              <Table.Cell>{`${DateUtilities.ToLocalDate(
                prog.startDate
              )} to ${DateUtilities.ToLocalDate(prog.endDate)}`}</Table.Cell>
              <Table.Cell>
                {prog.signedCojDate ? prog.signedCojDate : "Not signed"}
              </Table.Cell>
              <Table.Cell>
                {prog.signedCojVersion ? prog.signedCojVersion : "N/A"}
              </Table.Cell>
              <td>
                <NavLink
                  data-cy="pdLink"
                  to={`/profile/programmes/${prog.programmeTisId}`}
                  onClick={() => store.dispatch(updatedViewedCojProg(prog))}
                >
                  <BodyText>
                    {prog.hasSignedCoj
                      ? "click here to view"
                      : "click here to sign"}
                  </BodyText>
                </NavLink>
              </td>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  } else
    return (
      <BodyText>
        You have no Programmes to sign a Conditions of Joining agreement!
      </BodyText>
    );
};

export default COJList;
