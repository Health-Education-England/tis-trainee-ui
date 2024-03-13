import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { TraineeNotificationsService } from "../../services/TraineeNotificationsService";
export type NotificationStatus = "READ" | "UNREAD" | "FAILED" | "SENT";
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
  error: any;
  activeNotification: NotificationType | null;
  unreadNotificationCount: number;
};

export const initialState: NotificationsState = {
  // TODO - remove this temp mock data and replace with async thunk
  data: [],
  status: "idle",
  error: "",
  activeNotification: null,
  unreadNotificationCount: 0
};

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async () => {
    const notificationService = new TraineeNotificationsService();
    const response = await notificationService.getAllNotifications();
    console.log(response.data);
    return response.data;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updatedActiveNotification(state, action: PayloadAction<NotificationType>) {
      return { ...state, activeNotification: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(getNotifications.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.unreadNotificationCount = unreadNotificationsCount(
          action.payload
        );
      })
      .addCase(getNotifications.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchAllNotifications,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default notificationsSlice.reducer;

export const { updatedActiveNotification } = notificationsSlice.actions;

function unreadNotificationsCount(notificationsData: any[]) {
  const unreadNotifications = notificationsData.filter(
    notification => notification.status === "UNREAD"
  );
  return unreadNotifications.length;
}
