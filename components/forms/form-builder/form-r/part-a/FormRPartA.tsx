import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../../../ScrollTo";
import PageTitle from "../../../../common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../../../CreateList";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import PageNotFound from "../../../../common/PageNotFound";
import formAJson from "./formA.json";
import FormBuilder, { Form, FormName } from "../../FormBuilder";
import { formAValidationSchema } from "./formAValidationSchema";
import { FormView } from "../../FormView";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import {
  filterCurriculumOptions,
  transformReferenceData
} from "../../../../../utilities/FormBuilderUtilities";
import {
  selectAllReference,
  selectCurriculumOptions
} from "../../../../../redux/slices/referenceSlice";
import { FORMR_PARTA_DECLARATIONS } from "../../../../../utilities/Constants";
import { FormRPartA } from "../../../../../models/FormRPartA";
import { FormProvider } from "../../FormContext";

export default function FormA() {
  const formData = useSelectFormData(formAJson.name as FormName) as FormRPartA;
  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
  );
  const filteredCurriculumOptions = filterCurriculumOptions(
    useAppSelector(selectCurriculumOptions),
    "MEDICAL_CURRICULUM"
  );
  const programmeDeclarationOptions = FORMR_PARTA_DECLARATIONS.map(
    (declaration: string) => ({ label: declaration, value: declaration })
  );
  const formOptions = {
    ...referenceData,
    programmeDeclarationOptions,
    filteredCurriculumOptions
  };

  const preferredMfa = useAppSelector(state => state.user.preferredMfa);
  const canEditStatus = useAppSelector(state => state.formA.canEdit);
  const formJson = formAJson as Form;
  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );
  const redirectPath = "/formr-a";

  if (preferredMfa === "NOMFA") {
    return <Redirect to="/mfa" />;
  }
  return (
    <>
      <PageTitle title="Form R Part-A" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy="formRAHeading"
        >
          Form R (Part A)
        </Fieldset.Legend>
        <Label data-cy="formraLabel" size="s">
          Trainee registration for Postgraduate Speciality Training
        </Label>
        <Label data-cy="formraInfo" size="s">
          The Form R is a vital aspect of Revalidation (this applies to those
          holding GMC registration) and you are expected to complete one at the
          start of a new training programme and ahead of each ARCP.
        </Label>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/formr-a/create"
          render={() => {
            return formData.traineeTisId ? (
              <FormProvider
                initialData={formData}
                initialPageFields={initialPageFields}
                formName={formJson.name}
              >
                <FormBuilder
                  jsonForm={formJson}
                  options={formOptions}
                  validationSchema={formAValidationSchema}
                />
              </FormProvider>
            ) : (
              <Redirect to={redirectPath} />
            );
          }}
        />
        <Route
          exact
          path="/formr-a/confirm"
          render={() => (
            <FormView
              formData={formData}
              canEditStatus={canEditStatus}
              formJson={formJson}
              redirectPath={redirectPath}
              validationSchemaForView={formAValidationSchema}
            />
          )}
        />
        <Route
          exact
          path="/formr-a/:id"
          render={() => (
            <FormView
              formData={formData}
              canEditStatus={canEditStatus}
              formJson={formJson}
              redirectPath={redirectPath}
            />
          )}
        />
        <Route exact path="/formr-a" component={CreateList} />
        <Route path="/formr-a/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
