import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";

interface IViewSection6 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection6 = ({ makeSectionEditButton, formData }: IViewSection6) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader6">Section 6: Compliments</h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(6)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Compliments</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Compliments</SummaryList.Key>
              <SummaryList.Value data-cy="compliments">
                {FormRUtilities.showMsgIfEmpty(
                  formData.compliments,
                  "No compliments recorded"
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection6;
