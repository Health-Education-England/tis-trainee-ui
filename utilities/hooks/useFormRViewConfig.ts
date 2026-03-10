import { Form } from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useSelectFormData } from "./useSelectFormData";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import { formAValidationSchema } from "../../components/forms/form-builder/form-r/part-a/formAValidationSchema";
import formBJson from "../../components/forms/form-builder/form-r/part-b/formB.json";
import { getFormBValidationSchema } from "../../components/forms/form-builder/form-r/part-b/formBValidationSchema";
import formAJsonPH from "../../components/forms/form-builder/form-r/part-a-ph/formA.json";
import { formAValidationSchema as formAValidationSchemaPH } from "../../components/forms/form-builder/form-r/part-a-ph/formAValidationSchema";
import formBJsonPH from "../../components/forms/form-builder/form-r/part-b-ph/formB.json";
import { getFormBValidationSchema as getFormBValidationSchemaPH } from "../../components/forms/form-builder/form-r/part-b-ph/formBValidationSchema";
import { useIsPhNonMedic } from "./useIsPhNonMedic";

export const useFormRViewConfig = (formType: "A" | "B") => {
  const activeCovid = useAppSelector(state => state.formB.displayCovid);
  const traineeProfileData = useAppSelector(
    state => state.traineeProfile.traineeProfileData
  );
  const personalDetails = traineeProfileData?.personalDetails || {};
  const isPHnonMed = useIsPhNonMedic();

  let formJson: Form;
  let validationSchemaForView: any;

  if (formType === "A") {
    formJson = isPHnonMed ? (formAJsonPH as Form) : (formAJson as Form);
    validationSchemaForView = isPHnonMed
      ? formAValidationSchemaPH
      : formAValidationSchema;
  } else {
    const baseFormJson = isPHnonMed
      ? (formBJsonPH as Form)
      : (formBJson as Form);
    validationSchemaForView = isPHnonMed
      ? getFormBValidationSchemaPH(activeCovid)
      : getFormBValidationSchema(activeCovid);

    formJson = activeCovid
      ? baseFormJson
      : {
          ...baseFormJson,
          pages: baseFormJson.pages.filter(
            page => page.pageName !== "COVID 19 self-assessment & declarations"
          )
        };
  }

  const formData = useSelectFormData(formJson.name) as FormRPartA | FormRPartB;

  return {
    formData,
    formJson,
    validationSchemaForView
  };
};
