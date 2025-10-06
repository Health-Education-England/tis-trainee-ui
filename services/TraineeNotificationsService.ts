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
    const page = params?.page ? params?.page : "";
    const size = params?.size ? params?.size : "";
    const sort = params?.sort ? params?.sort : "";
    const type = params?.type ? params?.type : "";
    const status = params?.status ? params?.status : "";
    const keyword = params?.keyword ? params?.keyword : "";
    return this.get<NotificationPage>(`/notifications?page=${page}&size=${size}&sort=${sort}&type=${type}&status=${status}&keyword=${keyword}`);
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
