import { Field, Form, FormData } from "./FormBuilder";
import { Button, Card, SummaryList } from "nhsuk-react-components";
import { handleEditSection } from "../../../utilities/FormBuilderUtilities";
import { DateUtilities } from "../../../utilities/DateUtilities";
import history from "../../navigation/history";
interface FormViewBuilderProps {
  jsonForm: Form;
  formData: FormData;
  canEdit: boolean;
  formErrors: { [key: string]: string };
}

const showVisibleField = (
  field: Field,
  formData: FormData,
  formErrors: { [key: string]: string }
) => {
  if (
    field.visible ||
    (field.visibleIf && field.visibleIf.includes(formData[field.parent!!]))
  ) {
    return (
      <SummaryList.Row key={field.name}>
        <SummaryList.Key
          data-cy={`${field.name}-label`}
          className={formErrors[field.name] ? "nhsuk-error-message" : ""}
        >
          {field.label}
        </SummaryList.Key>
        <SummaryList.Value data-cy={`${field.name}-value`}>
          {displayListValue(formData[field.name], field.type)}
        </SummaryList.Value>
      </SummaryList.Row>
    );
  }
};

const FormViewBuilder: React.FC<FormViewBuilderProps> = ({
  jsonForm,
  formData,
  canEdit,
  formErrors
}: FormViewBuilderProps) => {
  return (
    <div>
      {jsonForm.pages.map((page, pageIndex) => (
        <div key={page.pageName}>
          <Card feature>
            <Card.Content>
              <Card.Heading>{page.pageName}</Card.Heading>
              {page.sections.map((section, _sectionIndex) => (
                <div key={section.sectionHeader}>
                  {canEdit && (
                    <Button
                      data-cy={`edit-${section.sectionHeader}`}
                      secondary
                      onClick={() =>
                        handleEditSection(pageIndex, jsonForm.name, history)
                      }
                    >
                      Edit Section
                    </Button>
                  )}
                  <SummaryList>
                    {section.fields.map(field =>
                      showVisibleField(field, formData, formErrors)
                    )}
                  </SummaryList>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default FormViewBuilder;

function displayListValue(fieldVal: string, fieldType: string) {
  if (!fieldVal) return "Not provided";
  if (fieldType === "date" && fieldVal) {
    return DateUtilities.ToLocalDate(fieldVal);
  }
  return fieldVal;
}
