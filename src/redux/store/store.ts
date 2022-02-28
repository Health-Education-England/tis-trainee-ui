import { configureStore, Action } from "@reduxjs/toolkit";
import { ThunkAction } from "redux-thunk";
import rootReducer from "../slices";

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "formA/fetchFormA/fulfilled",
          "formA/fetchFormA/pending",
          "formA/fetchFormA/rejected",
          "formA/saveFormA/fulfilled",
          "formA/saveFormA/pending",
          "formA/saveFormA/rejected",
          "formA/updatedFormA",
          "formA/updateFormA/fulfilled",
          "formA/updateFormA/pending",
          "formA/updateFormA/rejected",
          "formA/fetchFormB/fulfilled",
          "formA/fetchFormB/pending",
          "formA/fetchFormB/rejected",
          "formB/saveFormB/fulfilled",
          "formB/saveFormB/pending",
          "formB/saveFormB/rejected",
          "formB/updatedFormB",
          "formB/updateFormB/fulfilled",
          "formB/updateFormB/pending",
          "formB/updateFormB/rejected",
          "forms/fetchFeatureFlags/fulfilled",
          "forms/fetchFeatureFlags/pending",
          "forms/fetchFeatureFlags/rejected",
          "forms/fetchForms/fulfilled",
          "forms/fetchForms/pending",
          "forms/fetchForms/rejected",
          "notifications/addNotification",
          "notifications/removeNotification"
        ]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
