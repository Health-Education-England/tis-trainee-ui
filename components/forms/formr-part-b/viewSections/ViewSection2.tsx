import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { DateUtilities } from "../../../../utilities/DateUtilities";

interface IViewSection2 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection2 = ({ makeSectionEditButton, formData }: IViewSection2) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader2">Section 2: Whole Scope of Practice</h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(2)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Type of work</Card.Heading>
          {formData.work.length > 0 &&
            formData.work.map((w, i) => (
              <Card key={i}>
                <Card.Content>
                  <h3 data-cy={`typeOfWork${i + 1}`}>Type of work {i + 1}</h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Type of Work</SummaryList.Key>
                      <SummaryList.Value data-cy={`typeOfWork${i + 1}`}>
                        {w.typeOfWork}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Training post</SummaryList.Key>
                      <SummaryList.Value data-cy={`trainingPost${i + 1}`}>
                        {w.trainingPost}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Start Date</SummaryList.Key>
                      <SummaryList.Value data-cy={`startDate${i + 1}`}>
                        {DateUtilities.ToLocalDate(w.startDate)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>End Date</SummaryList.Key>
                      <SummaryList.Value data-cy={`endDate${i + 1}`}>
                        {DateUtilities.ToLocalDate(w.endDate)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Site Name</SummaryList.Key>
                      <SummaryList.Value data-cy={`site${i + 1}`}>
                        {w.site}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Site Location</SummaryList.Key>
                      <SummaryList.Value data-cy={`siteLocation${i + 1}`}>
                        {w.siteLocation}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Site Known As</SummaryList.Key>
                      <SummaryList.Value data-cy={`siteKnownAs${i + 1}`}>
                        {w.siteKnownAs}
                      </SummaryList.Value>
                    </SummaryList.Row>
                  </SummaryList>
                </Card.Content>
              </Card>
            ))}
        </Card.Content>
      </Card>
      <Card feature>
        <Card.Content>
          <Card.Heading>Reasons for TIME OUT OF TRAINING (TOOT)</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Short and Long-term sickness absence
              </SummaryList.Key>
              <SummaryList.Value data-cy="sicknessAbsence">
                {formData.sicknessAbsence}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Parental leave (incl Maternity / Paternity leave)
              </SummaryList.Key>
              <SummaryList.Value data-cy="parentalLeave">
                {formData.parentalLeave}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Career breaks within a Programme (OOPC) and non-training
                placements for experience (OOPE)
              </SummaryList.Key>
              <SummaryList.Value data-cy="careerBreaks">
                {formData.careerBreaks}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Paid / unpaid leave (e.g. compassionate, jury service)
              </SummaryList.Key>
              <SummaryList.Value data-cy="paidLeave">
                {formData.paidLeave}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Unpaid/unauthorised leave including industrial action
              </SummaryList.Key>
              <SummaryList.Value data-cy="unauthorisedLeave">
                {formData.unauthorisedLeave}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Other</SummaryList.Key>
              <SummaryList.Value data-cy="otherLeave">
                {formData.otherLeave}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                <b>Total</b>
              </SummaryList.Key>
              <SummaryList.Key>
                <b data-cy="totalLeave">{formData.totalLeave}</b>
              </SummaryList.Key>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection2;
