import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { NotificationPage } from "../redux/slices/notificationsSlice";

export class TraineeNotificationsService extends ApiService {
  constructor() {
    super("/api");
  }
  
  async getAllNotifications(
    params?: Record<string, string | number>
  ): Promise<AxiosResponse<NotificationPage>> {
    const searchParams = new URLSearchParams();
  
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      }
    }
  
    if (searchParams.toString()) {
      return this.get<NotificationPage>(`/notifications?${searchParams.toString()}`);
    } else {
      return this.get<NotificationPage>(`/notifications`);
    }
  }

  async markNotificationAsRead(
    notificationId: string
  ): Promise<AxiosResponse<any>> {
    return this.put<any>(`/notifications/${notificationId}/mark-read`);
  }

  async markNotificationAsUnread(
    notificationId: string
  ): Promise<AxiosResponse<any>> {
    return this.put<any>(`/notifications/${notificationId}/mark-unread`);
  }

  async archiveNotification(
    notificationId: string
  ): Promise<AxiosResponse<any>> {
    return this.put<any>(`/notifications/${notificationId}/archive`);
  }

  async getNotificationMessage(
    notificationId: string
  ): Promise<AxiosResponse<any>> {
    return this.get<any>(`/notifications/${notificationId}/message`);
  }
}
