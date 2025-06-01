import { useAppSelector } from "../../redux/hooks/hooks";
import { FormName } from "../../components/forms/form-builder/FormBuilder";

export function useCanEditStatus(formName: FormName): boolean {
  return useAppSelector(state => state[formName].canEdit);
}
