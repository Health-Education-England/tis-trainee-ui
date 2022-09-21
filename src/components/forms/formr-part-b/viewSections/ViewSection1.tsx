import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { DateUtilities } from "../../../../utilities/DateUtilities";

interface IViewSection1 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection1 = ({ makeSectionEditButton, formData }: IViewSection1) => {
  return (
    <div>
      <div className="nhsuk-grid-row nhsuk-u-margin-top-3">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader1">Section 1: Doctor's details</h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(1)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Personal details</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Forename</SummaryList.Key>
              <SummaryList.Value data-cy="forename">
                {formData.forename}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>GMC-Registered Surname</SummaryList.Key>
              <SummaryList.Value data-cy="surname">
                {formData.surname}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>GMC Number</SummaryList.Key>
              <SummaryList.Value data-cy="gmcNumber">
                {formData.gmcNumber}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Email Address</SummaryList.Key>
              <SummaryList.Value data-cy="email">
                {formData.email}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Deanery / HEE Local Team</SummaryList.Key>
              <SummaryList.Value data-cy="localOfficeName">
                {formData.localOfficeName}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Previous Designated Revalidation Body
              </SummaryList.Key>
              <SummaryList.Value data-cy="prevRevalBody">
                {formData.prevRevalBody}
              </SummaryList.Value>
            </SummaryList.Row>
            {formData.prevRevalBodyOther && (
              <SummaryList.Row>
                <SummaryList.Key>
                  Other Previous Revalidation Body
                </SummaryList.Key>
                <SummaryList.Value data-cy="prevRevalBodyOther">
                  {formData.prevRevalBodyOther}
                </SummaryList.Value>
              </SummaryList.Row>
            )}
            <SummaryList.Row>
              <SummaryList.Key>Current Revalidation Date</SummaryList.Key>
              <SummaryList.Value data-cy="currRevalDate">
                {DateUtilities.ToLocalDate(formData.currRevalDate || null)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Date of Previous Revalidation</SummaryList.Key>
              <SummaryList.Value data-cy="prevRevalDate">
                {DateUtilities.ToLocalDate(formData.prevRevalDate || null)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Programme / Training Specialty</SummaryList.Key>
              <SummaryList.Value data-cy="programmeSpecialty">
                {formData.programmeSpecialty}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Dual Specialty</SummaryList.Key>
              <SummaryList.Value data-cy="dualSpecialty">
                {formData.dualSpecialty}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection1;
