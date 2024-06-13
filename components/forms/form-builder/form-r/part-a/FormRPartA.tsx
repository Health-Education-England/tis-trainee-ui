import { Redirect, Route, Switch } from "react-router-dom";
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
import PageHeading from "../../../../common/PageHeading";

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
      <PageHeading
        title="Form R (Part A)"
        headingDataCy="formRAHeading"
        subHeadingDataCy="formraLabel"
        subHeadingText="Trainee registration for Postgraduate Speciality Training"
      />
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
