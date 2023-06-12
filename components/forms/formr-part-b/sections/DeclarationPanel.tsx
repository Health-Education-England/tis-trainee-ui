import { FunctionComponent } from "react";
import TextInputField from "../../TextInputField";
import { Button, Card, CloseIcon } from "nhsuk-react-components";
import classes from "../FormRPartB.module.scss";
import SelectInputField from "../../SelectInputField";
import { useAppSelector } from "../../../../redux/hooks/hooks";
import { selectAllReference } from "../../../../redux/slices/referenceSlice";
import { CombinedReferenceData } from "../../../../models/CombinedReferenceData";
import { useField } from "formik";
interface IDeclarationPanel {
  index: number;
  removePanel: any;
  section: number;
}

const DeclarationPanel: FunctionComponent<IDeclarationPanel> = ({
  index,
  removePanel,
  section
}: IDeclarationPanel) => {
  const combinedReferenceData: CombinedReferenceData =
    useAppSelector(selectAllReference);
  const declarationTypes = combinedReferenceData.declarationType.map(
    (d: { label: string }) => {
      return {
        label: d.label,
        value: d.label
      };
    }
  );
  const [_titleField, _titleMeta, titleHelpers] = useField(
    section === 4
      ? `previousDeclarations[${index}].title`
      : `currentDeclarations[${index}].title`
  );
  const [_LocOfEntryField, _LocOfEntryMeta, LocOfEntryHelpers] = useField(
    section === 4
      ? `previousDeclarations[${index}].locationOfEntry`
      : `currentDeclarations[${index}].locationOfEntry`
  );

  return (
    <Card id={`declarationPanel${index}`}>
      <Card.Content>
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-quarter">
            <h3>Declaration {index + 1}</h3>
          </div>
          <div className="nhsuk-grid-column-three-quarters">
            {index > 0 ? (
              <Button
                reverse
                type="button"
                data-jest="removePanel"
                data-cy={`closeIcon${index}`}
                onClick={() => removePanel(index)}
                className={classes.panelCloseButton}
                title="Delete"
              >
                <CloseIcon />
              </Button>
            ) : null}
          </div>
        </div>
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-third">
            <SelectInputField
              label="Declaration Type"
              name={
                section === 4
                  ? `previousDeclarations[${index}].declarationType`
                  : `currentDeclarations[${index}].declarationType`
              }
              options={declarationTypes}
            />
          </div>
          <div className="nhsuk-grid-column-one-third">
            <TextInputField
              label="Date of entry in portfolio"
              type="date"
              name={
                section === 4
                  ? `previousDeclarations[${index}].dateOfEntry`
                  : `currentDeclarations[${index}].dateOfEntry`
              }
              data-cy={`dateOfEntryInput${index}`}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-half">
            <TextInputField
              label="Title/ Topic of reflection/ event"
              name={
                section === 4
                  ? `previousDeclarations[${index}].title`
                  : `currentDeclarations[${index}].title`
              }
              data-cy={`titleInput${index}`}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                titleHelpers.setValue(trimmedValue);
              }}
            />
          </div>
          <div className="nhsuk-grid-column-one-half">
            <TextInputField
              label="Location of entry in portfolio"
              name={
                section === 4
                  ? `previousDeclarations[${index}].locationOfEntry`
                  : `currentDeclarations[${index}].locationOfEntry`
              }
              data-cy={`LocOfEntryInput${index}`}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                LocOfEntryHelpers.setValue(trimmedValue);
              }}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default DeclarationPanel;
