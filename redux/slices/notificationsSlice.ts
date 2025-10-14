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

export type NotificationMsgType = "IN_APP" | "EMAIL";

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

export type NotificationType = {
  id: string;
  tisReference: string | null;
  type: NotificationMsgType;
  subject: string;
  subjectText: string | null;
  contact: string | null;
  status: NotificationStatus;
  sentAt: Date;
  statusDetail: string | null;
  readAt?: Date;
};

export type NotificationsState = {
  notificationsList: NotificationType[];
  notificationsStatusFilter: string | null;
  viewingType: NotificationMsgType | null;
  status: string;
  countStatus: string;
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
  notificationsStatusFilter: "",
  viewingType: "IN_APP",
  status: "idle",
  countStatus: "idle",
  notificationUpdateStatus: "idle",
  notificationMsg: "",
  msgStatus: "idle",
  error: "",
  activeNotification: null,
  unreadNotificationCount: 0,
  notificationUpdateInProgress: false
};

export const getNotificationCount = createAsyncThunk(
  "notifications/getNotificationCount",
  async () => {
    const notificationService = new TraineeNotificationsService();
    const response = await notificationService.getNotifications({
      page: "0",
      size: "0"
    });
    return response.data;
  }
);

export const getNotifications = createAsyncThunk(
  "notifications/getNotifications",
  async (params?: Record<string, any>) => {
    const notificationService = new TraineeNotificationsService();
    const response = await notificationService.getNotifications(params);
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
    },
    updateNotificationStatusFilter(state, action: PayloadAction<string>) {
      return { ...state, notificationsStatusFilter: action.payload };
    }
  },
  extraReducers(builder): void {
    builder      
      .addCase(getNotificationCount.pending, (state) => {
        state.countStatus = "loading";
      })
      .addCase(getNotificationCount.fulfilled, (state, action) => {
        state.countStatus = "succeeded";
        state.unreadNotificationCount = unreadNotificationsCount(
          action.payload.content ?? 0
        );
      })
      .addCase(getNotificationCount.rejected, (state, { error }) => {    
        state.countStatus = "failed";
        state.error = error.message;
        showToast(
          toastErrText.getNotificationsCount,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(getNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notificationsList = action.payload.content;
        if (state.viewingType === "IN_APP") {
          state.unreadNotificationCount = unreadNotificationsCount(
            action.payload.content ?? 0
          );
        }
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
  updatedNotificationUpdateInProgress,
  switchNotificationType,
  updateNotificationStatusFilter
} = notificationsSlice.actions;

export function unreadNotificationsCount(notificationsData: NotificationType[]) {
  if (!Array.isArray(notificationsData)) return 0;
  const unreadNotifications = notificationsData.filter(
    notification => notification.status === "UNREAD"
  );
  return unreadNotifications.length;
}
