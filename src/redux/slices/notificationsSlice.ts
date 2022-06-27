import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../../models/INotification";
import { nanoid } from "nanoid";
import { fetchTraineeProfileData } from "./traineeProfileSlice";
import { fetchReference } from "./referenceSlice";
import { fetchFeatureFlags } from "./featureFlagsSlice";
import { loadSavedFormA, saveFormA, updateFormA } from "./formASlice";
import { loadSavedFormB, saveFormB, updateFormB } from "./formBSlice";
import { fetchForms } from "./formsSlice";
import {
  updateUserAttributes,
  verifyPhone,
  verifyUserAttributeSubmit,
  setPreferredMfa,
  updateTotpCode,
  verifyTotp
} from "./userSlice";

const thunkArrRejected = [
  { thunk: fetchFeatureFlags, text: " - load some of your new form data" },
  { thunk: fetchForms, text: " - load your list of saved forms" },
  { thunk: fetchTraineeProfileData, text: "load your personal details" },
  { thunk: fetchReference, text: "load data to pre-populate your forms" },
  { thunk: loadSavedFormA, text: "load your saved Form R (Part A)" },
  { thunk: saveFormA, text: "save your Form R (Part A)" },
  { thunk: updateFormA, text: "save your updated Form R (Part A)" },
  { thunk: loadSavedFormB, text: "load your saved Form R (Part B)" },
  { thunk: saveFormB, text: "save your Form R (Part B)" },
  { thunk: updateFormB, text: "save your updated Form R (Part B)" },
  { thunk: updateUserAttributes, text: "update your MFA information" },
  {
    thunk: verifyPhone,
    text: "send you an SMS code to sign in. Please try again"
  },
  {
    thunk: verifyUserAttributeSubmit,
    text: "verify your identification with that code. Please try again"
  },
  {
    thunk: setPreferredMfa,
    text: "set your preferred MFA and log in. Please try again"
  },
  {
    thunk: updateTotpCode,
    text: "configure your Authentication Code. Please try again"
  },
  {
    thunk: verifyTotp,
    text: "verify your identification with that Authentication code. Please try again"
  }
];

const thunkArrFulfilled = [
  { thunk: saveFormA, text: "Form R (Part A) has been saved" },
  {
    thunk: updateFormA,
    text: "updated Form R (Part A) has been saved"
  },
  { thunk: saveFormB, text: "Form R (Part B) has been saved" },
  {
    thunk: updateFormB,
    text: "updated Form R (Part B) has been saved"
  },
  {
    thunk: verifyPhone,
    text: "phone has been verified. An SMS code from HEE should arrive soon"
  },
  {
    thunk: setPreferredMfa,
    text: "MFA choice is set. You will be prompted for a new 6-digit code each time you log in"
  }
];

interface INotifications {
  notifications: INotification[];
}

const initialState: INotifications = {
  notifications: []
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (
      state,
      { payload }: PayloadAction<Omit<INotification, "id">>
    ): void => {
      const notification: INotification = {
        id: nanoid(),
        ...payload
      };
      state.notifications.push(notification);
    },
    removeNotification: (
      state,
      { payload }: PayloadAction<INotification["id"]>
    ): void => {
      const index = state.notifications.findIndex(
        notification => notification.id === payload
      );
      if (index >= 0) state.notifications.splice(index, 1);
    }
  },
  extraReducers: (builder): void => {
    for (const asnycThunk of thunkArrRejected) {
      builder.addCase(asnycThunk.thunk.rejected, state => {
        state.notifications.push({
          id: nanoid(),
          type: "Error",
          text: `- Couldn't ${asnycThunk.text}. If problem persists please take a screenshot and email Support`
        });
      });
    }
    for (const asyncThunk of thunkArrFulfilled) {
      builder.addCase(asyncThunk.thunk.fulfilled, state => {
        state.notifications.push({
          id: nanoid(),
          type: "Success",
          text: `- Your ${asyncThunk.text}`
        });
      });
    }
  }
});

const { actions, reducer } = notificationsSlice;

export default reducer;

export const { addNotification, removeNotification } = actions;
