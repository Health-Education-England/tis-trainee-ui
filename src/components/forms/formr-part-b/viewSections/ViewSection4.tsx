import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { DateUtilities } from "../../../../utilities/DateUtilities";

interface IViewSection4 {
  makeSectionEditButton: (section: number) => false | JSX.Element;
  formData: FormRPartB;
}

const ViewSection4 = ({ makeSectionEditButton, formData }: IViewSection4) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader4">
            Section 4: Update to your previous Form R Part B
          </h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(4)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>Previous resolved declarations</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Did you declare any Significant Events, Complaints, Other
                investigations on your PREVIOUS Form R Part B that have since
                been RESOLVED?
              </SummaryList.Key>
              <SummaryList.Value data-jest="havePreviousDeclarations">
                {BooleanUtilities.ToYesNo(formData.havePreviousDeclarations)}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {formData?.previousDeclarations.length > 0 &&
            formData.previousDeclarations.map((event, index) => (
              <Card key={index}>
                <Card.Content>
                  <h3 data-cy={`previousDeclaration${index + 1}`}>
                    Declaration {index + 1}
                  </h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Declaration type</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDeclarationType${index + 1}`}
                        data-jest="previousDeclarationType"
                      >
                        {event.declarationType}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Date of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDateOfEntry${index + 1}`}
                        data-jest="previousDateOfEntry"
                      >
                        {DateUtilities.ToLocalDate(event.dateOfEntry || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Title</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousDeclarationTitle${index + 1}`}
                        data-jest="previousDeclarationTitle"
                      >
                        {event.title}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Location of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`previousLocationOfEntry${index + 1}`}
                        data-jest="previousLocationOfEntry"
                      >
                        {event.locationOfEntry}
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
          <Card.Heading>
            Summary of previous unresolved declarations
          </Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Do you have any PREVIOUSLY DECLARED Significant Events,
                Complaints, or other investigations still UNRESOLVED?
              </SummaryList.Key>
              <SummaryList.Value data-jest="havePreviousDeclarations">
                {BooleanUtilities.ToYesNo(
                  formData.havePreviousUnresolvedDeclarations
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {formData.havePreviousUnresolvedDeclarations?.toString() ===
            "true" && (
            <SummaryList>
              <SummaryList.Row>
                <SummaryList.Key>
                  Please provide a brief summary below, including where you were
                  working, the date of the event, and your reflection where
                  appropriate. If known, please identify what investigations are
                  pending relating to the event and which organisation is
                  undertaking this investigation.
                </SummaryList.Key>
                <SummaryList.Value data-cy="previousDeclarationSummary">
                  {formData.previousDeclarationSummary}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection4;
