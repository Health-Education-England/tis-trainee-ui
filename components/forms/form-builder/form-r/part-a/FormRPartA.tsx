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
import history from "../../../../navigation/history";
import { FormRPartA } from "../../../../../models/FormRPartA";

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
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/formr-a/create"
          render={() => {
            return formData.traineeTisId ? (
              <FormBuilder
                jsonForm={formJson}
                fetchedFormData={formData}
                options={formOptions}
                validationSchema={formAValidationSchema}
                history={history}
              />
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
