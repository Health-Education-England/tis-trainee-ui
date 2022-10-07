import { TraineeReferenceService } from "../TraineeReferenceService";
import { AxiosResponse } from "axios";

const mockService = new TraineeReferenceService();
describe("TraineeReferenceService", () => {
  it("getCombinedReferenceData method returns success response on promise resolve", () => {
    const successResponse: Promise<AxiosResponse<any>> = Promise.resolve({
      data: [],
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    });

    jest.spyOn(mockService, "get").mockReturnValue(successResponse);

    expect(mockService.getCombinedReferenceData()).toEqual(successResponse);
  });

  it("getCombinedReferenceData method returns error response on promise rejection", () => {
    const errorResponse = {
      data: null,
      status: 500,
      statusText: "Internal server error",
      headers: {},
      config: {}
    };

    const spy = jest.spyOn(mockService, "get");
    spy.mockRejectedValue(errorResponse);

    mockService.getCombinedReferenceData().catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });
});
