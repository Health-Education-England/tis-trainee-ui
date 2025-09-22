import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toastErrText } from "../../utilities/Constants";
import { ToastType, showToast } from "../../components/common/ToastMessage";
import { TraineeNotificationsService } from "../../services/TraineeNotificationsService";
import { switchNotificationType } from "../../utilities/NotificationsUtilities";

export type NotificationStatus =
  | "READ"
  | "UNREAD"
  | "FAILED"
  | "SENT"
  | "ARCHIVED";

export type NotificationMsgType = "IN_APP" | "EMAIL";

export type NotificationType = {
  id: string;
  tisReference: string | null;
  type: NotificationMsgType;
  subject: string;
  subjectText: string | null;
  contact: string | null;
  emailNotificationStatus: NotificationStatus | null;
  status: NotificationStatus;
  sentAt: Date | null;
  statusDetail: string | null;
  readAt?: Date | null;
};

export type NotificationsState = {
  notificationsList: NotificationType[];
  inAppNotificationsList: NotificationType[];
  emailNotificationsList: NotificationType[];
  emailNotificationStatus: string;
  viewingType: NotificationType | null;
  status: string;
  notificationUpdateStatus: string;
  notificationMsg: string;
  msgStatus: string;
  error: any;
  emailNotificationsError: any;
  activeNotification: NotificationType | null;
  failedEmailCount: number;
  unreadNotificationCount: number;
  notificationUpdateInProgress: boolean; // to prevent multiple row/button clicks
};

export const initialState: NotificationsState = {
  notificationsList: [],
  inAppNotificationsList: [],
  emailNotificationsList: [],
  emailNotificationStatus: "idle",
  viewingType: null,
  status: "idle",
  notificationUpdateStatus: "idle",
  notificationMsg: "",
  msgStatus: "idle",
  error: "",
  emailNotificationsError: "",
  activeNotification: null,
  failedEmailCount: 0,
  unreadNotificationCount: 0,
  notificationUpdateInProgress: false
};

export const getAllNotifications = createAsyncThunk(
  "notifications/getAllNotifications",
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
    },
    switchNotificationType(state, action: PayloadAction<NotificationMsgType>) {
      return { ...state, viewingType: action.payload };
    }
  },
  extraReducers(builder): void {
    builder      
      .addCase(getAllNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notificationsList = action.payload;
        state.emailNotificationsList = action.payload.filter(n => n.type === "EMAIL");
        state.inAppNotificationsList = action.payload.filter(n => n.type === "IN_APP");
        state.failedEmailCount = failedEmailsCount(
          action.payload ?? 0
        );
        state.unreadNotificationCount = unreadNotificationsCount(
          action.payload ?? 0
        );
      })
      .addCase(getAllNotifications.rejected, (state, { error }) => {
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

export function failedEmailsCount(notificationsData: any[]) {
  if (!Array.isArray(notificationsData)) return 0;
  const failedEmails = notificationsData.filter(
    notification => notification.status === "FAILED"
  );
  return failedEmails.length;
}

export function unreadNotificationsCount(notificationsData: any[]) {
  if (!Array.isArray(notificationsData)) return 0;
  const unreadNotifications = notificationsData.filter(
    notification => notification.status === "UNREAD"
  );
  return unreadNotifications.length;
}
