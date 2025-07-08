import { Redirect, Route, Switch } from "react-router-dom";
import ScrollTo from "../../../ScrollTo";
import PageTitle from "../../../../common/PageTitle";
import { Fieldset, Label } from "nhsuk-react-components";
import CreateList from "../../../CreateList";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import PageNotFound from "../../../../common/PageNotFound";
import formBJson from "./formB.json";
import FormBuilder, { Form } from "../../FormBuilder";
import { getFormBValidationSchema } from "./formBValidationSchema";
import { useSelectFormData } from "../../../../../utilities/hooks/useSelectFormData";
import { selectAllReference } from "../../../../../redux/slices/referenceSlice";
import { DesignatedBodyKeyValue } from "../../../../../models/DesignatedBodyKeyValue";
import { transformReferenceData } from "../../../../../utilities/FormBuilderUtilities";
import { FormView } from "../../FormView";
import { FormRPartB } from "../../../../../models/FormRPartB";
import { COVID_RESULT_DECLARATIONS } from "../../../../../utilities/Constants";
import { ProfileUtilities } from "../../../../../utilities/ProfileUtilities";
import { FormProvider } from "../../FormContext";

export default function FormB() {
  const canEditStatus = useAppSelector(state => state.formB.canEdit);

  const redirectPath = "/formr-b";
  const formJson = formBJson as Form;
  const formData = useSelectFormData(formJson.name) as FormRPartB;
  const initialPageFields = formJson.pages[0].sections.flatMap(
    section => section.fields
  );

  const formDataWithSortedWork = {
    ...formData,
    work: ProfileUtilities.sortWorkDesc(formData.work)
  };

  // 1. Determine Covid status (logic is in the slice reducer)
  const activeCovid = useAppSelector(state => state.formB.displayCovid);
  // 2. Set the validation schema based on the Covid status
  const formValidationSchema = getFormBValidationSchema(activeCovid);
  // 3. Set the json form fields based on the Covid status
  const finalFormJson = activeCovid
    ? formJson
    : {
        ...formJson,
        pages: formJson.pages.filter(
          page => page.pageName !== "COVID 19 self-assessment & declarations"
        )
      };

  const referenceData = useAppSelector(selectAllReference);
  const dbcInternal = [
    ...referenceData.dbc.filter((db: DesignatedBodyKeyValue) => db.internal),
    { label: "other", value: "other" }
  ];
  const dbcExternal = referenceData.dbc.filter(
    (db: DesignatedBodyKeyValue) => !db.internal
  );
  const yesNo = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ];

  const covidProgressSelfRate = COVID_RESULT_DECLARATIONS;

  const formOptions = transformReferenceData({
    ...referenceData,
    dbcInternal,
    dbcExternal,
    yesNo,
    covidProgressSelfRate
  });

  return (
    <>
      <PageTitle title="Form R Part-B" />
      <ScrollTo />
      <Fieldset>
        <Fieldset.Legend
          isPageHeading
          className="fieldset-legend__header"
          data-cy="formRBHeading"
        >
          Form R (Part B)
        </Fieldset.Legend>
        <Label data-cy="formrbLabel" size="s">
          Trainee registration for Postgraduate Speciality Training
        </Label>
        <Label data-cy="formrbInfo" size="s">
          The Form R is a vital aspect of Revalidation (this applies to those
          holding GMC registration) and you are expected to complete one at the
          start of a new training programme and ahead of each ARCP.
        </Label>
      </Fieldset>
      <Switch>
        <Route
          exact
          path="/formr-b/create"
          render={() => {
            return formData.traineeTisId ? (
              <FormProvider
                initialData={formDataWithSortedWork}
                initialPageFields={initialPageFields}
                jsonForm={finalFormJson}
              >
                <FormBuilder
                  options={formOptions}
                  validationSchema={formValidationSchema}
                />
              </FormProvider>
            ) : (
              <Redirect to={redirectPath} />
            );
          }}
        />
        <Route
          exact
          path="/formr-b/confirm"
          render={() => (
            <FormView
              formData={formDataWithSortedWork}
              canEditStatus={canEditStatus}
              formJson={finalFormJson}
              redirectPath={redirectPath}
              validationSchemaForView={formValidationSchema}
            />
          )}
        />
        <Route
          exact
          path="/formr-b/:id"
          render={() => (
            <FormView
              formData={formDataWithSortedWork}
              canEditStatus={canEditStatus}
              formJson={finalFormJson}
              redirectPath={redirectPath}
            />
          )}
        />
        <Route exact path="/formr-b" component={CreateList} />
        <Route path="/formr-b/*" component={PageNotFound} />
      </Switch>
    </>
  );
}
