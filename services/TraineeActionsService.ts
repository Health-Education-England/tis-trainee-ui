import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { TraineeAction } from "../models/TraineeAction";

export class TraineeActionsService extends ApiService {
  constructor() {
    super("/api/actions");
  }

  async completeTraineeAction(actionId: string): Promise<AxiosResponse<TraineeAction>> {
    return this.post<TraineeAction>(`/${actionId}/complete`);
  }

  async getTraineeActions(): Promise<AxiosResponse<TraineeAction[]>> {
    return this.get<TraineeAction[]>("");
  }
}
