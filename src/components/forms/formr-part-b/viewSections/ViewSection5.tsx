import { Card, SummaryList } from "nhsuk-react-components";
import { FormRPartB } from "../../../../models/FormRPartB";
import { BooleanUtilities } from "../../../../utilities/BooleanUtilities";
import { DateUtilities } from "../../../../utilities/DateUtilities";

interface IViewSection5 {
  makeSectionEditButton: (section: number) => boolean | JSX.Element;
  formData: FormRPartB;
}

const ViewSection5 = ({ makeSectionEditButton, formData }: IViewSection5) => {
  return (
    <div>
      <div className="nhsuk-grid-row page-break">
        <div className="nhsuk-grid-column-two-thirds">
          <h2 data-cy="sectionHeader5">
            Section 5: New declarations since your previous Form R Part B
          </h2>
        </div>
        <div className="nhsuk-grid-column-one-third">
          {makeSectionEditButton(5)}
        </div>
      </div>
      <Card feature>
        <Card.Content>
          <Card.Heading>New resolved declarations</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Do you have any new Significant Events, Complaints, Other
                investigations to declare since your previous
                ARCP/RITA/Appraisal that have since been RESOLVED?
              </SummaryList.Key>
              <SummaryList.Value
                data-jest="haveCurrentDeclarations"
                data-cy="haveCurrentDeclarations"
              >
                {BooleanUtilities.ToYesNo(formData.haveCurrentDeclarations)}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {formData?.currentDeclarations.length > 0 &&
            formData.currentDeclarations.map((event, index) => (
              <Card key={index}>
                <Card.Content>
                  <h3 data-cy={`currentDeclaration${index + 1}`}>
                    Declaration {index + 1}
                  </h3>
                  <SummaryList>
                    <SummaryList.Row>
                      <SummaryList.Key>Declaration type</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`declarationType${index + 1}`}
                        data-jest="currentDeclarationType"
                      >
                        {event.declarationType}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Date of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`dateOfEntry${index + 1}`}
                        data-jest="currentDateOfEntry"
                      >
                        {DateUtilities.ToLocalDate(event.dateOfEntry || null)}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Title</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`title${index + 1}`}
                        data-jest="currentDeclarationTitle"
                      >
                        {event.title}
                      </SummaryList.Value>
                    </SummaryList.Row>
                    <SummaryList.Row>
                      <SummaryList.Key>Location of entry</SummaryList.Key>
                      <SummaryList.Value
                        data-cy={`locationOfEntry${index + 1}`}
                        data-jest="currentLocationOfEntry"
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
          <Card.Heading>Summary of new unresolved declarations</Card.Heading>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>
                Do you have NEW declared Significant Events, Complaints, or
                other investigations still UNRESOLVED?
              </SummaryList.Key>
              <SummaryList.Value data-cy="haveCurrentUnresolvedDeclarations">
                {BooleanUtilities.ToYesNo(
                  formData.haveCurrentUnresolvedDeclarations
                )}
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          {formData.haveCurrentUnresolvedDeclarations?.toString() ===
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
                <SummaryList.Value data-cy="currentDeclarationSummary">
                  {formData.currentDeclarationSummary}
                </SummaryList.Value>
              </SummaryList.Row>
            </SummaryList>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default ViewSection5;
