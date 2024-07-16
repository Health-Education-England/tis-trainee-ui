import dayjs from "dayjs";
import { Form, Formik } from "formik";
import { Button, WarningCallout } from "nhsuk-react-components";
import MultiChoiceInputField from "../MultiChoiceInputField";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { YES_NO_OPTIONS } from "../../../utilities/Constants";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";

export type LinkedFormRDataType = {
  isArcp: null | boolean;
  linkedProgrammeUuid: null | string;
  managingDeanery?: string;
};
type FormLinkerFormProps = {
  onSubmit: (data: LinkedFormRDataType) => void;
  warningText: null | string;
  linkedFormData: LinkedFormRDataType;
};

export function FormLinkerForm({
  onSubmit,
  warningText,
  linkedFormData
}: Readonly<FormLinkerFormProps>) {
  const initialFormData = linkedFormData ?? {
    isArcp: null,
    linkedProgrammeUuid: null
  };
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;
  const linkedProgOptions = programmesArr.map(programme => ({
    label: `${programme.programmeName} (start: ${dayjs(
      programme.startDate
    ).format("DD/MM/YYYY")})`,
    value: programme.tisId
  }));

  return (
    <div>
      {warningText && (
        <WarningCallout>
          <WarningCallout.Label>Important</WarningCallout.Label>
          <p>{warningText}</p>
        </WarningCallout>
      )}
      <Formik initialValues={initialFormData} onSubmit={onSubmit}>
        {({ values, errors, setFieldValue, dirty, isValid }) => (
          <Form>
            <MultiChoiceInputField
              name="isArcp"
              id="isArcp"
              type="radios"
              items={YES_NO_OPTIONS}
              label="Are you submitting this form for your ARCP?"
            />
            <AutocompleteSelect
              value={values.linkedProgrammeUuid}
              onChange={setFieldValue}
              error={errors.linkedProgrammeUuid}
              options={linkedProgOptions}
              name="linkedProgrammeUuid"
              label="What programme will this form link to?"
              isMulti={false}
              closeMenuOnSelect={true}
              isCreatable={false}
            />
            <Button type="submit" disabled={!isValid}>
              Confirm & Continue
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
