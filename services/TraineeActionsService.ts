import { AxiosResponse } from "axios";
import ApiService from "./apiService";
import { TraineeAction } from "../models/TraineeAction";

export class TraineeActionsService extends ApiService {
  constructor() {
    super("/api");
  }

  async getIncompleteTraineeActions(): Promise<AxiosResponse<TraineeAction[]>> {
    return this.get<TraineeAction[]>(`/actions`);
  }

  async completeTraineeAction(
    actionId: string
  ): Promise<AxiosResponse<TraineeAction>> {
    return this.post<TraineeAction>(`/actions/${actionId}/complete`);
  }
}
