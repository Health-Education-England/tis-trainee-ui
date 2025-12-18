import {
  Form,
  FormName
} from "../../components/forms/form-builder/FormBuilder";
import { FormRPartA } from "../../models/FormRPartA";
import { FormRPartB } from "../../models/FormRPartB";
import { useAppSelector } from "../../redux/hooks/hooks";
import { useSelectFormData } from "./useSelectFormData";
import formAJson from "../../components/forms/form-builder/form-r/part-a/formA.json";
import formBJson from "../../components/forms/form-builder/form-r/part-b/formB.json";
import { formAValidationSchema } from "../../components/forms/form-builder/form-r/part-a/formAValidationSchema";
import { getFormBValidationSchema } from "../../components/forms/form-builder/form-r/part-b/formBValidationSchema";

export const useFormRViewConfig = (formType: "A" | "B") => {
  const activeCovid = useAppSelector(state => state.formB.displayCovid);

  let formJson: Form;
  let validationSchemaForView: any;

  if (formType === "A") {
    formJson = formAJson as Form;
    validationSchemaForView = formAValidationSchema;
  } else {
    const baseFormJson = formBJson as Form;
    validationSchemaForView = getFormBValidationSchema(activeCovid);

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
