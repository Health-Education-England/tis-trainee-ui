import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { PanelName, TraineeProfile } from "../models/TraineeProfile";
export class TraineeProfileService extends ApiService {
  constructor() {
    super("/api/trainee");
  }

  async getTraineeProfile(): Promise<AxiosResponse<TraineeProfile>> {
    return this.get<TraineeProfile>("/profile");
  }

  async issueDspCred(
    panelId: string,
    panelName: string
  ): Promise<AxiosResponse<any>> {
    const panelN =
      panelName === PanelName.Programme ? "programmemembership" : panelName;
    return await this.get<any>(`/credential/par/${panelN}/${panelId}`);
  }
}
