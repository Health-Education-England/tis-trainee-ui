import { useAppSelector } from "../../../redux/hooks/hooks";
import { Redirect } from "react-router-dom";
import { LtftObj } from "../../../redux/slices/ltftSlice";
import { useSelectFormData } from "../../../utilities/hooks/useSelectFormData";
import { Form, FormName } from "../form-builder/FormBuilder";
import ltftJson from "./ltft.json";
import FormViewBuilder from "../form-builder/FormViewBuilder";
import { useState } from "react";
import { WarningCallout } from "nhsuk-react-components";
import Declarations from "../form-builder/Declarations";

export const LtftFormView = () => {
  const formData = useSelectFormData(ltftJson.name as FormName) as LtftObj;
  const canEditStatus = useAppSelector(state => state.ltft.canEdit);
  const formJson = ltftJson as Form;
  const redirectPath = "/ltft";
  const [canSubmit, setCanSubmit] = useState(false);
  // TODO when traineeTisId is available (after DTO tickets 7017, 7018 merged), use it in return statement i.e. return formData?.traineeTisId ? ( ... )
  return formData ? (
    <>
      <p>Cct snapshot view comp goes here.</p>
      <FormViewBuilder
        jsonForm={formJson}
        formData={formData}
        canEdit={canEditStatus}
        formErrors={{}}
      />
      <WarningCallout>
        <WarningCallout.Label>Declarations</WarningCallout.Label>
        <form>
          <Declarations
            setCanSubmit={setCanSubmit}
            canEdit={canEditStatus}
            formJson={formJson}
          />
        </form>
      </WarningCallout>
      <p>Btns to go here: submit (to open modal), save & exit, start over </p>
      <p>Modal to name the form etc. to go here</p>
    </>
  ) : (
    <Redirect to={redirectPath} />
  );
};
