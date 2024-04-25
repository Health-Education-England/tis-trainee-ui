import { FormName } from "../../components/forms/form-builder/FormBuilder";
import { useAppSelector } from "../../redux/hooks/hooks";
import { RootState } from "../../redux/store/store";

type FormState = Pick<RootState, "formA" | "formB">;
const selectData = (state: FormState, formName: FormName) =>
  state[formName]?.formData;

export const useSelectFormData = (formName: FormName) =>
  useAppSelector(state => selectData(state, formName));
