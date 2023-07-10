import { FunctionComponent, useEffect, useState } from "react";
import TextInputField from "../../../../components/forms/TextInputField";
import { Card } from "nhsuk-react-components";
import SelectInputField from "../../../../components/forms/SelectInputField";
import { useField } from "formik";
import { ReferenceDataUtilities } from "../../../../utilities/ReferenceDataUtilities";
import { Work } from "../../../../models/FormRPartB";
import MultiChoiceInputField from "../../MultiChoiceInputField";
interface Props {
  value: Work;
  index: number;
  onBlur?: any;
}

const WorkPanel: FunctionComponent<Props> = (props: Props) => {
  const { value, index } = props;
  const [_workTypeField, _workTypeMeta, workTypeHelpers] = useField(
    `work[${index}].typeOfWork`
  );
  const [_siteNameField, _siteNameMeta, siteNameHelpers] = useField(
    `work[${index}].site`
  );
  const [_siteLocationField, _siteLocationMeta, siteLocationHelpers] = useField(
    `work[${index}].siteLocation`
  );
  const [_isCurrentArcpField, _isCurrentArcpMeta, isCurrentArcpHelpers] =
    useField(`work[${index}].isCurrentArcp`);

  const isCurrentArcp =
    ReferenceDataUtilities.isWorkPlacementCurrentARCP(value);

  const [isChecked, setIsChecked] = useState(isCurrentArcp);

  useEffect(() => {
    setIsChecked(isCurrentArcp);
    isCurrentArcpHelpers.setValue(isCurrentArcp);
  }, [isCurrentArcp]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    isCurrentArcpHelpers.setValue(checked);
  };

  return (
    <Card data-cy="workPanel">
      <Card.Content>
        <div className="nhsuk-grid-row">
          {isCurrentArcp ? (
            <div className="nhsuk-grid-column-three-quarters">
              <div
                style={{
                  border: "solid 4px #78BE20",
                  padding: "8px",
                  marginBottom: "16px",
                  backgroundColor: "#78BE20"
                }}
              >
                <label>This Work placement is within the ARCP period.</label>
                <MultiChoiceInputField
                  data-cy="checkboxIsCurrentArcp"
                  type="checkbox"
                  name={`work[${index}].isCurrentArcp`}
                  items={[
                    {
                      label: "Uncheck if you DO NOT want to include it.",
                      value: true
                    }
                  ]}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
          ) : (
            <div className="nhsuk-grid-column-three-quarters">
              <div
                style={{
                  border: "solid 4px #FFB81C",
                  padding: "8px",
                  marginBottom: "16px",
                  backgroundColor: "#FFB81C"
                }}
              >
                <label>
                  This Work placement falls outside the ARCP period.
                </label>

                <MultiChoiceInputField
                  data-cy="checkboxNotCurrentArcp"
                  type="checkbox"
                  name={`work[${index}].isCurrentArcp`}
                  items={[
                    {
                      label: "Check the box if you want to include it.",
                      value: true
                    }
                  ]}
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
              </div>
            </div>
          )}
        </div>
        <div className="nhsuk-grid-row">
          <div className="nhsuk-grid-column-three-quarters"></div>
          <div className="nhsuk-grid-column-one-quarter">
            <h3>Type of work {index + 1}</h3>
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
        </div>
      </Card.Content>
    </Card>
  );
};

export default WorkPanel;
