import { useFormikContext } from "formik";
import React, { useEffect } from "react";
import { AutosaveMessage } from "../AutosaveMessage";
import { autosaveFormR } from "../../../utilities/FormBuilderUtilities";
import { FormRPartB } from "../../../models/FormRPartB";
import store from "../../../redux/store/store";
import { updatedIsDirty } from "../../../redux/slices/formBSlice";

export const AutosaveForFormB = () => {
  const { values, dirty } = useFormikContext();

  useEffect(() => {
    if (dirty) {
      store.dispatch(updatedIsDirty(true));
    }
  }, [dirty]);

  useEffect(() => {
    const isFormDirty = store.getState().formB.isDirty;
    if (dirty || isFormDirty) {
      const timer = setTimeout(() => {
        (async () => {
          await autosaveFormR("formB", values as FormRPartB);
          const autosaveStatus = store.getState().formB.status;
          if (autosaveStatus === "succeeded") {
            store.dispatch(updatedIsDirty(false));
          }
        })();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [values, dirty]);

  return <AutosaveMessage formName="formB" />;
};
