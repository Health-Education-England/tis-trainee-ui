import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { TraineeProfile } from "../models/TraineeProfile";
import { Placement } from "../models/Placement";
export class TraineeProfileService extends ApiService {
  constructor() {
    super("/api/trainee");
  }

  async getTraineeProfile(): Promise<AxiosResponse<TraineeProfile>> {
    return this.get<TraineeProfile>("/profile");
  }

  async makeDspPlacementParRequest(
    plParData: Placement
  ): Promise<AxiosResponse<Placement>> {
    return this.post<Placement>(
      `/placementcredential/par/${plParData.tisId}`,
      plParData
    );
  }
}
