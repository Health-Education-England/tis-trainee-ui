import {
  Form,
  FormName
} from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectAllReference } from "../../redux/slices/referenceSlice";
import { useSelectFormData } from "./useSelectFormData";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import formBJson from "../../components/forms/form-builder/form-r/part-b/formB.json";
import { formAValidationSchema } from "../../components/forms/form-builder/form-r/part-a/formAValidationSchema";
import { getFormBValidationSchema } from "../../components/forms/form-builder/form-r/part-b/formBValidationSchema";
import { transformReferenceData } from "../FormBuilderUtilities";
import { DesignatedBodyKeyValue } from "../../models/DesignatedBodyKeyValue";
import {
  COVID_RESULT_DECLARATIONS,
  FORMR_PARTA_DECLARATIONS
} from "../Constants";
import { ProfileUtilities } from "../ProfileUtilities";

export const useFormRConfig = (formType: "A" | "B") => {
  const formName: FormName = formType === "A" ? "formA" : "formB";
  const formData = useSelectFormData(formName) as FormRPartA | FormRPartB;
  const activeCovid = useAppSelector(state => state.formB.displayCovid);
  const rawReferenceData = useAppSelector(selectAllReference);

  let formJson: Form;
  let validationSchema: any;
  let formOptions: any;
  let initialData: FormRPartA | FormRPartB;

  if (formType === "A") {
    formJson = formAJson as Form;
    validationSchema = formAValidationSchema;
    const referenceData = transformReferenceData(rawReferenceData);
    const programmeDeclarationOptions = FORMR_PARTA_DECLARATIONS.map(
      (declaration: string) => ({ label: declaration, value: declaration })
    );
    formOptions = {
      ...referenceData,
      programmeDeclarationOptions
    };
    initialData = formData;
  } else {
    const baseFormJson = formBJson as Form;
    validationSchema = getFormBValidationSchema(activeCovid);

    formJson = activeCovid
      ? baseFormJson
      : {
          ...baseFormJson,
          pages: baseFormJson.pages.filter(
            page => page.pageName !== "COVID 19 self-assessment & declarations"
          )
        };

    const dbcInternal = [
      ...rawReferenceData.dbc.filter(
        (db: DesignatedBodyKeyValue) => db.internal
      ),
      { label: "other", value: "other" }
    ];
    const dbcExternal = rawReferenceData.dbc.filter(
      (db: DesignatedBodyKeyValue) => !db.internal
    );
    const yesNo = [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" }
    ];
    const covidProgressSelfRate = COVID_RESULT_DECLARATIONS;

    formOptions = transformReferenceData({
      ...rawReferenceData,
      dbcInternal,
      dbcExternal,
      yesNo,
      covidProgressSelfRate
    });

    initialData = {
      ...formData,
      work: ProfileUtilities.sortWorkDesc((formData as FormRPartB)?.work)
    };
  }

  return {
    formJson,
    validationSchema,
    formOptions,
    initialData
  };
};
