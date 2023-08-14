import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { AutosaveMessage } from "../AutosaveMessage";
import { autosaveFormR } from "../../../utilities/FormBuilderUtilities";
import { FormRPartB } from "../../../models/FormRPartB";

export const AutosaveForFormB = () => {
  const { values, dirty } = useFormikContext();
  useEffect(() => {
    if (dirty) {
      const timer = setTimeout(() => {
        autosaveFormR("formB", values as FormRPartB);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [values, dirty]);

  return <AutosaveMessage formName="formB" />;
};
