import dayjs from "dayjs";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, WarningCallout } from "nhsuk-react-components";
import MultiChoiceInputField from "../MultiChoiceInputField";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { YES_NO_OPTIONS } from "../../../utilities/Constants";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import {
  filterProgrammesForLinker,
  sortProgrammesForLinker
} from "../../../utilities/FormRUtilities";

export type LinkedFormRDataType = {
  isArcp: null | boolean;
  programmeMembershipId: null | string;
  managingDeanery?: string;
};
type FormLinkerFormProps = {
  onSubmit: (data: LinkedFormRDataType) => void;
  warningText: null | string;
  linkedFormData: LinkedFormRDataType;
};

type SelectOption = {
  label: string;
  value: string;
};

export function FormLinkerForm({
  onSubmit,
  warningText,
  linkedFormData
}: Readonly<FormLinkerFormProps>) {
  const optTxt = "Please select an option";
  const progTxt = "Please select a programme.";
  const validationSchema = Yup.object().shape({
    isArcp: Yup.boolean().typeError(optTxt).required(optTxt),
    programmeMembershipId: Yup.string().typeError(progTxt).required(progTxt)
  });
  const programmesArr =
    useAppSelector(selectTraineeProfile).programmeMemberships;

  const presubForm = typeof linkedFormData.programmeMembershipId === "string";

  const makeLinkedProgOptions = (isArcp: boolean) => {
    const filteredProgrammes = filterProgrammesForLinker(programmesArr, isArcp);
    const sortedProgrammes = sortProgrammesForLinker(filteredProgrammes);
    const linkedProgrammeOptions = sortedProgrammes.map(programme => ({
      label: `${programme.programmeName} (start: ${dayjs(
        programme.startDate
      ).format("DD/MM/YYYY")})`,
      value: programme.tisId
    }));
    return (linkedProgrammeOptions as SelectOption[]) ?? [];
  };

  const makeDefaultOption = (options: SelectOption[]) => {
    return options.find(
      (opt: SelectOption) => opt.value === linkedFormData.programmeMembershipId
    );
  };

  const prepopDefaultOption = (isArcp: boolean) => {
    const updatedOptions = makeLinkedProgOptions(isArcp);
    return makeDefaultOption(updatedOptions);
  };

  const selectOptionsForInitialFromData = presubForm
    ? makeLinkedProgOptions(linkedFormData.isArcp as boolean)
    : [];

  const initialFormData = {
    ...linkedFormData,
    selectOptions: selectOptionsForInitialFromData
  };

  return (
    <div className="form-linker_form">
      {warningText && (
        <WarningCallout data-cy="formWarning">
          <WarningCallout.Label>Important</WarningCallout.Label>
          <p>{warningText}</p>
        </WarningCallout>
      )}
      <Formik
        initialValues={initialFormData}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {({ values, errors, setFieldValue, isValid }) => {
          return (
            <Form>
              <MultiChoiceInputField
                name="isArcp"
                id="isArcp"
                type="radios"
                items={YES_NO_OPTIONS}
                label="Are you submitting this form for your ARCP?"
                data-cy="is-arcp-radio"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const updatedOptions = makeLinkedProgOptions(
                    e.target.value === "true"
                  );
                  setFieldValue("selectOptions", updatedOptions);
                  setFieldValue(
                    "programmeMembershipId",
                    { label: null, value: null },
                    true
                  );
                }}
              />
              {values.isArcp !== null && (
                <AutocompleteSelect
                  value={values.programmeMembershipId}
                  onChange={setFieldValue}
                  error={errors.programmeMembershipId}
                  options={values.selectOptions}
                  name="programmeMembershipId"
                  label="What programme will this form link to?"
                  isMulti={false}
                  closeMenuOnSelect={true}
                  isCreatable={false}
                  defaultOption={
                    presubForm
                      ? prepopDefaultOption(values.isArcp)
                      : makeDefaultOption(values.selectOptions)
                  }
                  data-cy="linked-programme-uuid"
                />
              )}
              <Button
                data-cy="form-linker-submit-btn"
                type="submit"
                disabled={!isValid}
              >
                Confirm & Continue
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
