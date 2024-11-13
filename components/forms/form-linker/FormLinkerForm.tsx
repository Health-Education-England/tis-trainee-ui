import dayjs from "dayjs";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, WarningCallout } from "nhsuk-react-components";
import MultiChoiceInputField from "../MultiChoiceInputField";
import { useAppSelector } from "../../../redux/hooks/hooks";
import { ARCP_OPTIONS } from "../../../utilities/Constants";
import { AutocompleteSelect } from "../../common/AutocompleteSelect";
import { selectTraineeProfile } from "../../../redux/slices/traineeProfileSlice";
import {
  filterProgrammesForLinker,
  sortProgrammesForLinker
} from "../../../utilities/FormRUtilities";
import ErrorPage from "../../common/ErrorPage";

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

  return programmesArr.length > 0 ? (
    <div>
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
        {({ values, errors, setFieldValue, isValid, dirty }) => {
          return (
            <Form>
              <MultiChoiceInputField
                name="isArcp"
                id="isArcp"
                type="radios"
                items={ARCP_OPTIONS}
                label="Please select why you are submitting your Form R:"
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
              {values.isArcp !== null && values.selectOptions?.length > 0 && (
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
              {dirty && values.selectOptions?.length === 0 && (
                <div className="form-linker_form">
                  <ErrorPage
                    message="You have no active programmes to link this form to. Please
                  contact Support (Local Office) for assistance."
                  />
                </div>
              )}
              <Button
                data-cy="form-linker-submit-btn"
                type="submit"
                disabled={
                  !isValid || (dirty && values.selectOptions?.length === 0)
                }
              >
                Confirm & Continue
              </Button>
            </Form>
          );
        }}
      </Formik>
    </div>
  ) : (
    <div className="form-linker_form">
      <ErrorPage message="You have no Programmes on TIS Self-Service that can be linked to this Form R submission. Please contact Support (Local Office) for assistance." />
    </div>
  );
}
