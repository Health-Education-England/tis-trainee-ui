import { Form, Formik } from "formik";
import { ActionLink, Label } from "nhsuk-react-components";
import * as Yup from "yup";
import { AutocompleteSelect } from "../common/AutocompleteSelect";
import { supportCatOptions } from "../../utilities/Constants";
import { StringUtilities } from "../../utilities/StringUtilities";

type TechSupportProps = {
  emailIds: string;
  userAgentData: string;
};

export function TechSupport({
  emailIds,
  userAgentData
}: Readonly<TechSupportProps>) {
  return (
    <Formik
      initialValues={{
        supportCatsTech: []
      }}
      validationSchema={Yup.object({}).nullable()}
      onSubmit={() => {} /* No-op as we're not submitting the form */}
    >
      {({ values, errors, setFieldValue, isValid }) => (
        <Form>
          <Label data-cy="supportCatsTechLabel" size="s">
            Please select the category (or categories) that best describes your
            technical issue:
          </Label>
          <AutocompleteSelect
            value={values.supportCatsTech}
            onChange={setFieldValue}
            error={errors.supportCatsTech}
            options={supportCatOptions}
            name="supportCatsTech"
            label=""
            isMulti={true}
            closeMenuOnSelect={false}
          />
          {values.supportCatsTech.length > 0 && isValid && (
            <ActionLink
              data-cy="techSupportLink"
              href={`mailto:england.tis.support@nhs.net?subject=TSS Technical support query (${emailIds}, Support categories: ${StringUtilities.alphabetSortedArrAsString(
                values.supportCatsTech
              )})&body=Browser and OS info:%0A${userAgentData}%0A%0APlease describe your issue(s) below. Include any screenshots you think might help: %0A%0A%0A`}
            >
              Please click here to email Technical Support
            </ActionLink>
          )}
        </Form>
      )}
    </Formik>
  );
}
