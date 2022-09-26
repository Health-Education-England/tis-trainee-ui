import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { FormRUtilities } from "../../../../utilities/FormRUtilities";

interface IViewSection3 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection3 = ({ makeSectionEditButton, formData }: IViewSection3) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader3">
            Section 3: Declarations relating to Good Medical Practice
          </h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(3)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Declarations</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                I declare that I accept the professional obligations placed on
                me in Good Medical Practice in relation to honesty and integrity
              </SummaryList.Key>
              <SummaryList.Value data-cy="isHonest">
                {BooleanUtilities.ToYesNo(formData.isHonest)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                I declare that I accept the professional obligations placed on
                me in Good Medical Practice about my personal health
              </SummaryList.Key>
              <SummaryList.Value data-cy="isHealthy">
                {BooleanUtilities.ToYesNo(formData.isHealthy)}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>
                Do you have any GMC conditions, warnings or undertakings placed
                on you by the GMC, employing Trust or other organisation?
              </SummaryList.Key>
              <SummaryList.Value data-cy="isWarned">
                {BooleanUtilities.ToYesNo(formData.isWarned)}
              </SummaryList.Value>
            </SummaryList.Row>
            {BooleanUtilities.ToBoolean(formData.isWarned) && (
              <SummaryList.Row>
                <SummaryList.Key>
                  If yes, are you complying with these conditions /
                  undertakings?
                </SummaryList.Key>
                <SummaryList.Value data-cy="isComplying">
                  {BooleanUtilities.ToYesNo(formData.isComplying)}
                </SummaryList.Value>
              </SummaryList.Row>
            )}
            <SummaryList.Row>
              <SummaryList.Key>Health Statement</SummaryList.Key>
              <SummaryList.Value data-cy="healthStatement">
                {FormRUtilities.showMsgIfEmpty(
                  formData.healthStatement,
                  "No health statement recorded"
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection3;
