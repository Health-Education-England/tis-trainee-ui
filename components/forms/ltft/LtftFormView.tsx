import { useAppSelector } from "../../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";

export const LtftFormView = () => {
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);
  const formJson = ltftJson as Form;
  const redirectPath = "/ltft";
  // TODO when traineeTisId is available (after DTO tickets 7017, 7018 merged), use it in return statement i.e. return formData?.traineeTisId ? ( ... )
  return formData ? (
    <>
      <p>Cct snapshot view comp goes here</p>
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEditStatus}
        formErrors={{}}
      />
      <p>Btns to go here: submit (to open modal), save & exit, start over </p>
      <p>Modal to name the form etc. to go here</p>
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
