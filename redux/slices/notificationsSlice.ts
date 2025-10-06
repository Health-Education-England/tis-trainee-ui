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

export type NotificationPage = {
  content: NotificationType[];
  page: PageDetails;
};

export type PageDetails = {
  size: number;
  number: number;
  totalElements: number;
  totalPages:number;
};

export type NotificationMsgType = "IN_APP";

export type NotificationType = {
  id: string;
  tisReference: string | null;
  type: NotificationMsgType;
  subject: string;
  subjectText: string;
  contact: string | null;
  status: NotificationStatus;
  sentAt: Date;
  statusDetail: string | null;
  readAt?: Date;
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
  notificationUpdateInProgress: boolean; // to prevent multiple row/button clicks
};

export const initialState: NotificationsState = {
  notificationsList: [],
  status: "idle",
  notificationUpdateStatus: "idle",
  notificationMsg: "",
  msgStatus: "idle",
  error: "",
  activeNotification: null,
  unreadNotificationCount: 0,
  notificationUpdateInProgress: false
};

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (params?: Record<string, string>) => {
    const notificationService = new TraineeNotificationsService();
    const response = await notificationService.getAllNotifications(params);
    return response.data;
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId: string) => {
    const notificationService = new TraineeNotificationsService();
    return (await notificationService.markNotificationAsRead(notificationId))
      .data;
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

export const getNotificationMessage = createAsyncThunk(
  "notifications/getNotificationMessage",
  async (notificationId: string) => {
    const notificationService = new TraineeNotificationsService();
    return (await notificationService.getNotificationMessage(notificationId))
      .data;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    updatedActiveNotification(state, action: PayloadAction<NotificationType>) {
      return { ...state, activeNotification: action.payload };
    },
    updatedNotificationsList(state, action: PayloadAction<NotificationType>) {
      const updatedNotification = action.payload;
      const updatedNotificationsList = state.notificationsList.map(
        notification =>
          notification.id === updatedNotification.id
            ? updatedNotification
            : notification
      );
      return { ...state, notificationsList: updatedNotificationsList };
    },
    resetNotificationsStatus(state) {
      return { ...state, status: "idle" };
    },
    loadedNotificationsList(state, action: PayloadAction<NotificationType[]>) {
      return { ...state, notificationsList: action.payload };
    },
    updatedNotificationUpdateInProgress(state, action: PayloadAction<boolean>) {
      return { ...state, notificationUpdateInProgress: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(getNotifications.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notificationsList = action.payload.content;
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
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.notificationUpdateStatus = "succeeded";
        state.activeNotification = action.payload;
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
      })
      .addCase(getNotificationMessage.pending, (state, _action) => {
        state.msgStatus = "loading";
      })
      .addCase(getNotificationMessage.fulfilled, (state, action) => {
        state.msgStatus = "succeeded";
        state.notificationMsg = action.payload;
      })
      .addCase(getNotificationMessage.rejected, (state, { error }) => {
        state.msgStatus = "failed";
        state.error = error.message;
        showToast(
          toastErrText.fetchNotificationMessage,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      });
  }
});

export default notificationsSlice.reducer;

export const {
  updatedActiveNotification,
  updatedNotificationsList,
  resetNotificationsStatus,
  loadedNotificationsList,
  updatedNotificationUpdateInProgress
} = notificationsSlice.actions;

export function unreadNotificationsCount(notificationsData: NotificationPage) {
  let notifications = notificationsData.content;
  if (!Array.isArray(notifications)) return 0;
  const unreadNotifications = notifications.filter(
    notification => notification.status === "UNREAD"
  );
  return unreadNotifications.length;
}
