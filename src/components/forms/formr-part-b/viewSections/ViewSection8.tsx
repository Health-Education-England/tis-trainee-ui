import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import {
  FORMR_PARTB_ACCEPTANCE,
  FORMR_PARTB_CONSENT
} from "../../../../utilities/Constants";

interface IViewSection8 {
  formData: FormRPartB;
}

const ViewSection8 = ({ formData }: IViewSection8) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader8">Declarations</h2>
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Declarations</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>I confirm that</SummaryList.Key>
              <SummaryList.Value data-cy="declarationAccept">
                {FORMR_PARTB_ACCEPTANCE}
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>I confirm that</SummaryList.Key>
              <SummaryList.Value data-cy="consentAccept">
                {FORMR_PARTB_CONSENT}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection8;
