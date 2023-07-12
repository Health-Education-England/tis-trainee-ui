import { FunctionComponent } from "react";
import TextInputField from "../../../../components/forms/TextInputField";
import { Button, Card, CloseIcon } from "nhsuk-react-components";
import classes from "../FormRPartB.module.scss";
import SelectInputField from "../../../../components/forms/SelectInputField";
import { useField } from "formik";
interface Props {
  index: number;
  removeWork: any;
  onBlur?: any;
}

const WorkPanel: FunctionComponent<Props> = (props: Props) => {
  const { index, removeWork: removePlacement } = props;
  const [_workTypeField, _workTypeMeta, workTypeHelpers] = useField(
    `work[${index}].typeOfWork`
  );
  const [_siteNameField, _siteNameMeta, siteNameHelpers] = useField(
    `work[${index}].site`
  );
  const [_siteLocationField, _siteLocationMeta, siteLocationHelpers] = useField(
    `work[${index}].siteLocation`
  );
  const [_siteKnownAsField, _siteKnownAsMeta, siteKnownAsHelpers] = useField(
    `work[${index}].siteKnownAs`
  );

  return (
    <Card data-cy="workPanel">
      <Card.Content>
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-quarter">
            <h3>Type of work {index + 1}</h3>
          </div>
          <div className="nhsuk-grid-column-three-quarters">
            {index > 0 ? (
              <Button
                reverse
                type="button"
                data-jest="removePanel"
                data-cy={`closeIcon${index}`}
                onClick={() => removePlacement(index)}
                className={classes.panelCloseButton}
                title="Delete"
              >
                <CloseIcon />
              </Button>
            ) : null}
          </div>
        </div>
        <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-three-quarters">
            <TextInputField
              label="Type of Work"
              name={`work[${index}].typeOfWork`}
              data-cy={`workTypeInput${index}`}
              width="50"
              hint="e.g. name and grade of specialty rotation, OOP, parental leave, etc."
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                workTypeHelpers.setValue(trimmedValue);
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-third">
            <SelectInputField
              label="Training Post"
              name={`work[${index}].trainingPost`}
              options={[
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" }
              ]}
            />
          </div>
          <div className="nhsuk-grid-column-one-third">
            <TextInputField
              label="Start Date"
              type="date"
              name={`work[${index}].startDate`}
              data-cy={`startInput${index}`}
            />
          </div>
          <div className="nhsuk-grid-column-one-third">
            <TextInputField
              label="End Date"
              type="date"
              name={`work[${index}].endDate`}
              data-cy={`endInput${index}`}
            />
          </div>
        </div>
        <div style={{ marginTop: 10 }} className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-one-half">
            <TextInputField
              label="Site Name"
              name={`work[${index}].site`}
              data-cy={`siteNameInput${index}`}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                siteNameHelpers.setValue(trimmedValue);
              }}
            />
          </div>
          <div className="nhsuk-grid-column-one-half">
            <TextInputField
              label="Site Location"
              name={`work[${index}].siteLocation`}
              data-cy={`siteLocInput${index}`}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                siteLocationHelpers.setValue(trimmedValue);
              }}
            />
          </div>
          <div className="nhsuk-grid-column-one-half">
            <TextInputField
              label="Site Known As"
              name={`work[${index}].siteKnownAs`}
              data-cy={`siteKnownAsInput${index}`}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                const trimmedValue = e.target.value.trim();
                siteKnownAsHelpers.setValue(trimmedValue);
              }}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default WorkPanel;
