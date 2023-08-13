import { FormRPartA } from "../../../../../models/FormRPartA";
import { useAppSelector } from "../../../../../redux/hooks/hooks";
import { selectSavedFormA } from "../../../../../redux/slices/formASlice";
import {
  selectAllReference,
  selectCurriculumOptions
} from "../../../../../redux/slices/referenceSlice";
import { FORMR_PARTA_DECLARATIONS } from "../../../../../utilities/Constants";
import FormBuilder from "../../FormBuilder";
import formAJson from "./formA.json";
import { formAValidationSchema } from "./formAValidationSchema";
import { Redirect } from "react-router-dom";
import history from "../../../../navigation/history";
import { KeyValue } from "../../../../../models/KeyValue";
import {
  filterCurriculumOptions,
  transformReferenceData
} from "../../../../../utilities/FormBuilderUtilities";

const FormA: React.FC = () => {
  const formAData: FormRPartA = useAppSelector(selectSavedFormA);
  const referenceData = transformReferenceData(
    useAppSelector(selectAllReference)
  );
  const filteredCurriculumOptions = filterCurriculumOptions(
    useAppSelector(selectCurriculumOptions),
    "MEDICAL_CURRICULUM"
  );
  const programmeDeclarationOptions: KeyValue[] = FORMR_PARTA_DECLARATIONS.map(
    (declaration: string) => ({ label: declaration, value: declaration })
  );

  const formAOptions = {
    ...referenceData,
    programmeDeclarationOptions,
    filteredCurriculumOptions
  };

  return formAData.traineeTisId ? (
    <FormBuilder
      jsonForm={formAJson}
      fetchedFormData={formAData}
      options={formAOptions}
      validationSchema={formAValidationSchema}
      history={history}
    />
  ) : (
    <Redirect to="/formr-a" />
  );
};

export default FormA;
