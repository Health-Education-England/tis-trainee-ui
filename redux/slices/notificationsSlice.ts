import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { notificationsData } from "../../mock-data/notifications";

export type NotificationStatus = "read" | "unread";

// TODO - Finalise the NotificationType
export type NotificationType = {
  id: string;
  category: string;
  title: string;
  message: string;
  status: NotificationStatus;
  sendDate: Date;
  readDate: Date | null;
  archiveDate: Date | null;
};

export type NotificationsState = {
  data: NotificationType[];
  status: string;
  error: string;
  activeNotification: NotificationType | null;
};

export const initialState: NotificationsState = {
  // TODO - remove this temp mock data and replace with async thunk
  data: notificationsData,
  status: "idle",
  error: "",
  activeNotification: null
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updatedActiveNotification(state, action: PayloadAction<NotificationType>) {
      return { ...state, activeNotification: action.payload };
    }
  }
});

export default notificationsSlice.reducer;

export const { updatedActiveNotification } = notificationsSlice.actions;
