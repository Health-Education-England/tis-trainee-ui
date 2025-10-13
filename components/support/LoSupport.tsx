import { Form, Formik } from "formik";
import * as Yup from "yup";
import { AutocompleteSelect } from "../common/AutocompleteSelect";
import { ActionLink, Label } from "nhsuk-react-components";
import {
  localOfficeContacts,
  supportCatOptions
} from "../../utilities/Constants";
import { CombinedReferenceData } from "../../models/CombinedReferenceData";
import { transformReferenceData } from "../../utilities/FormBuilderUtilities";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectAllReference } from "../../redux/slices/referenceSlice";
import { StringUtilities } from "../../utilities/StringUtilities";
import SelectInputField from "../forms/SelectInputField";

type LoSupportProps = {
  emailIds: string;
  userAgentData: string;
};

export function LoSupport({
  emailIds,
  userAgentData
}: Readonly<LoSupportProps>) {
  const combinedRefData: CombinedReferenceData =
    useAppSelector(selectAllReference);
  const localOfficeOptions =
    transformReferenceData(combinedRefData).localOffice;

  const labelsToFilter = new Set([
    "London LETBs",
    "Defence Postgraduate Medical Deanery"
  ]);
  const filteredLocalOfficeOptions = localOfficeOptions.filter(
    office => !labelsToFilter.has(office.label)
  );

  return (
    <Formik
      initialValues={{
        supportCats: [],
        localOffice: ""
      }}
      validationSchema={Yup.object({}).nullable()}
      onSubmit={() => {} /* No-op as we're not submitting the form */}
    >
      {({ values, errors, setFieldValue }) => (
        <Form>
          <Label size="s" data-cy="loSupportListPrompt">
            Please select your Local Office from the list below:
          </Label>
          <SelectInputField
            data-cy="loSupportList"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setFieldValue("localOffice", e.target.value, true);
              (e.target.value === "" ||
                localOfficeContacts[e.target.value] ===
                  "PGMDE support portal" ||
                localOfficeContacts[e.target.value] ===
                  "Freshdesk support portal") &&
                setFieldValue("supportCats", "", true);
            }}
            options={filteredLocalOfficeOptions}
            name="localOffice"
            label=""
          />
          {localOfficeContacts[values.localOffice] ===
            "PGMDE support portal" && (
            <ActionLink
              data-cy="pgdmeLink"
              href="https://lasepgmdesupport.hee.nhs.uk/support/tickets/new?form_7=true"
            >
              Click here to email your support request via the PGMDE Support
              Portal
            </ActionLink>
          )}
          {localOfficeContacts[values.localOffice] ===
            "Freshdesk support portal" && (
            <ActionLink
              data-cy="freshdeskLink"
              href="https://nhs-help.freshdesk.com/support/home"
            >
              Click here to submit your support request via the Fresh Desk
              Support Portal
            </ActionLink>
          )}

          {localOfficeContacts[values.localOffice] !== "PGMDE support portal" &&
            localOfficeContacts[values.localOffice] !==
              "Freshdesk support portal" &&
            localOfficeContacts[values.localOffice]?.length > 0 && (
              <>
                <Label size="s" data-cy="loSupportCatPrompt">
                  Please select the category (or categories) that best describes
                  your support issue:
                </Label>
                <AutocompleteSelect
                  value={values.supportCats}
                  onChange={setFieldValue}
                  error={errors.supportCats}
                  options={supportCatOptions}
                  name="supportCats"
                  label=""
                  isMulti={true}
                  closeMenuOnSelect={false}
                />
                {values.supportCats.length > 0 && (
                  <ActionLink
                    data-cy="loSupportLink"
                    href={`mailto:${
                      localOfficeContacts[values.localOffice]
                    }?subject=TSS LO support query (${emailIds}, Support categories: ${StringUtilities.alphabetSortedArrAsString(
                      values.supportCats
                    )})&body=Browser and OS info:%0A${userAgentData}%0A%0APlease describe your issue(s) below. Include any screenshots you think might help: %0A%0A%0A`}
                  >
                    {`Please click here to email ${values.localOffice}`}
                  </ActionLink>
                )}
              </>
            )}
        </Form>
      )}
    </Formik>
  );
}
