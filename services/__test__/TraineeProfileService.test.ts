import { AxiosResponse } from "axios";
import { TraineeProfileService } from "../TraineeProfileService";
import {
  mockProgrammeMemberships,
  mockTraineeProfile
} from "../../mock-data/trainee-profile";
import { errorResponse } from "../../mock-data/service-api-err-res";
import { TraineeProfile } from "../../models/TraineeProfile";
import { ProgrammeMembership } from "../../models/ProgrammeMembership";
import { FileUtilities } from "../../utilities/FileUtilities";

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

  it("signCoj method should return failure response", () => {
    jest.spyOn(mockService, "post").mockRejectedValue(errorResponse);

    mockService.signCoj("1").catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });

  it("getPmConfirmation method should download PM confirmation PDF", () => {
    const successResponse: Promise<AxiosResponse<Blob>> = Promise.resolve({
      data: new Blob(),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    });

    jest
      .spyOn(mockService.axiosInstance, "get")
      .mockReturnValue(successResponse);

    const result = mockService.getPmConfirmation("1");

    expect(mockService.axiosInstance.get).toHaveBeenCalledWith(
      "/programme-membership/1/confirmation",
      {
        headers: {
          Accept: "application/pdf"
        },
        responseType: "blob"
      }
    );
    expect(result).toEqual(successResponse);
  });

  it("getPmConfirmation method should return failure response", () => {
    jest.spyOn(mockService, "get").mockRejectedValue(errorResponse);

    mockService.getPmConfirmation("1").catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });

  it("getPmConfirmation method should return failure response", () => {
    jest.spyOn(mockService, "post").mockRejectedValue(errorResponse);

    mockService.getPmConfirmation("1").catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });

  it("updateGmc method should return success response", () => {
    const successResponse: Promise<AxiosResponse<ProgrammeMembership>> =
      Promise.resolve({
        data: mockProgrammeMemberships[0],
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });

    jest.spyOn(mockService, "put").mockReturnValue(successResponse);

    expect(mockService.updateGmc("1234567")).toEqual(successResponse);
  });

  it("updateGmc method should return failure response", () => {
    jest.spyOn(mockService, "put").mockRejectedValue(errorResponse);

    mockService.updateGmc("1234567").catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });
});
