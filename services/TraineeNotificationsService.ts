import { AxiosResponse } from "axios";
import ApiService from "./apiService";

export class TraineeNotificationsService extends ApiService {
  constructor() {
    super("/api");
  }

  async getAllNotifications(): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>(`/notifications`);
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
