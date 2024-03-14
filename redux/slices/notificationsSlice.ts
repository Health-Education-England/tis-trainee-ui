import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { TraineeNotificationsService } from "../../services/TraineeNotificationsService";

export type NotificationStatus =
  | "READ"
  | "UNREAD"
  | "FAILED"
  | "SENT"
  | "ARCHIVED";

// just placeholders for now
export type NotificationMsgType = "WELCOME" | "UPDATES" | "NEW_STARTER";

// TODO - Finalise the NotificationType
export type NotificationType = {
  id: string;
  type: NotificationMsgType;
  subject: string;
  status: NotificationStatus;
  sentAt: Date;
};

export type NotificationsState = {
  notificationsList: NotificationType[];
  status: string;
  notificationUpdateStatus: string;
  notificationMsg: string;
  msgStatus: string;
  error: any;
  activeNotification: NotificationType | null;
  unreadNotificationCount: number;
};

// TODO - Replace with actual data from the backend
export const initialState: NotificationsState = {
  notificationsList: [],
  status: "idle",
  notificationUpdateStatus: "idle",
  notificationMsg: "",
  msgStatus: "idle",
  error: "",
  activeNotification: null,
  unreadNotificationCount: 0
};

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async () => {
    const notificationService = new TraineeNotificationsService();
    const response = await notificationService.getAllNotifications();
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId: string) => {
    const notificationService = new TraineeNotificationsService();
    return await notificationService.markNotificationAsRead(notificationId);
  }
);

export const markNotificationAsUnread = createAsyncThunk(
  "notifications/markNotificationAsUnread",
  async (notificationId: string) => {
    const notificationService = new TraineeNotificationsService();
    return await notificationService.markNotificationAsUnread(notificationId);
  }
);

export const archiveNotification = createAsyncThunk(
  "notifications/archiveNotification",
  async (notificationId: string) => {
    const notificationService = new TraineeNotificationsService();
    return await notificationService.archiveNotification(notificationId);
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
        state.notificationsList = action.payload;
        state.unreadNotificationCount = unreadNotificationsCount(
          action.payload ?? 0
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
      })
      .addCase(markNotificationAsRead.pending, (state, _action) => {
        state.notificationUpdateStatus = "loading";
      })
      .addCase(markNotificationAsRead.fulfilled, (state, _action) => {
        state.notificationUpdateStatus = "succeeded";
      })
      .addCase(markNotificationAsRead.rejected, (state, { error }) => {
        state.notificationUpdateStatus = "failed";
        state.error = error.message;
        showToast(
          toastErrText.markNotificationAsRead,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(markNotificationAsUnread.pending, (state, _action) => {
        state.notificationUpdateStatus = "loading";
      })
      .addCase(markNotificationAsUnread.fulfilled, (state, _action) => {
        state.notificationUpdateStatus = "succeeded";
      })
      .addCase(markNotificationAsUnread.rejected, (state, { error }) => {
        state.notificationUpdateStatus = "failed";
        state.error = error.message;
        showToast(
          toastErrText.markNotificationAsUnread,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(archiveNotification.pending, (state, _action) => {
        state.notificationUpdateStatus = "loading";
      })
      .addCase(archiveNotification.fulfilled, (state, _action) => {
        state.notificationUpdateStatus = "succeeded";
      })
      .addCase(archiveNotification.rejected, (state, { error }) => {
        state.notificationUpdateStatus = "failed";
        state.error = error.message;
        showToast(
          toastErrText.archiveNotification,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default notificationsSlice.reducer;

export const { updatedActiveNotification } = notificationsSlice.actions;

function unreadNotificationsCount(notificationsData: any[]) {
  if (!Array.isArray(notificationsData)) return 0;
  const unreadNotifications = notificationsData.filter(
    notification => notification.status === "UNREAD"
  );
  return unreadNotifications.length;
}
