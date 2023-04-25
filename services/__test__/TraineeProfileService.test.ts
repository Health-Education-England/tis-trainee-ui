import { AxiosResponse } from "axios";
import { TraineeProfileService } from "../TraineeProfileService";
import {
  mockProgrammeMemberships,
  mockTraineeProfile
} from "../../mock-data/trainee-profile";
import { errorResponse } from "../../mock-data/service-api-err-res";
import { TraineeProfile } from "../../models/TraineeProfile";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";

const mockService = new TraineeProfileService();
describe("TraineeProfileService", () => {
  it("getTraineeProfile method should return success response", () => {
    const successResponse: Promise<AxiosResponse<TraineeProfile>> =
      Promise.resolve({
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
    jest.spyOn(mockService, "get").mockRejectedValue(errorResponse);

    mockService.getTraineeProfile().catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });

  it("signCoj method should return success response", () => {
    const successResponse: Promise<AxiosResponse<ProgrammeMembership>> =
      Promise.resolve({
        data: mockProgrammeMemberships[0],
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });

    jest.spyOn(mockService, "post").mockReturnValue(successResponse);

    expect(mockService.signCoj("1")).toEqual(successResponse);
  });

  it("signCoj method should return failure response", () => {
    jest.spyOn(mockService, "post").mockRejectedValue(errorResponse);

    mockService.signCoj("1").catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });
});
