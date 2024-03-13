import { AxiosResponse } from "axios";
import ApiService from "./apiService";

export class TraineeNotificationsService extends ApiService {
  constructor() {
    super("/api/notifications/history");
  }

  async getAllNotifications(): Promise<AxiosResponse<any[]>> {
    return this.get<any[]>(`/trainee`);
  }
}
