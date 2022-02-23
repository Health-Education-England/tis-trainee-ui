import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "../../models/INotification";
import { nanoid } from "nanoid";
import { fetchTraineeProfileData } from "./traineeProfileSlice";
import { fetchReference } from "./referenceSlice";
import { fetchFeatureFlags } from "./featureFlagsSlice";
import { loadSavedFormA, saveFormA, updateFormA } from "./formASlice";
import { loadSavedFormB, saveFormB, updateFormB } from "./formBSlice";
import { fetchForms } from "./formsSlice";

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
  { thunk: updateFormB, text: "save your updated Form R (Part B)" }
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
          text: `- Couldn't ${asnycThunk.text}. If problem persists please contact your Local Office.`
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
