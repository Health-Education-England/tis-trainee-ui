import { AxiosResponse } from "axios";
import { TraineeProfileService } from "../TraineeProfileService";
import { mockTraineeProfile } from "../../mock-data/trainee-profile";

const mockService = new TraineeProfileService();
describe("TraineeProfileService", () => {
  it("getTraineeProfile method should return success response", () => {
    const successResponse: Promise<AxiosResponse<any>> = Promise.resolve({
      data: mockTraineeProfile,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    });

    jest.spyOn(mockService, "get").mockReturnValue(successResponse);

    expect(mockService.getTraineeProfile()).toEqual(successResponse);
  });

  it("getTraineeProfile method should return failure response", () => {
    const errorResponse = {
      data: null,
      status: 500,
      statusText: "Internal server error",
      headers: {},
      config: {}
    };

    jest
      .spyOn(mockService, "get")
      .mockReturnValue(Promise.reject(errorResponse));

    mockService
      .getTraineeProfile()
      .then()
      .catch(response => {
        expect(response).toEqual(errorResponse);
      });
  });
});
