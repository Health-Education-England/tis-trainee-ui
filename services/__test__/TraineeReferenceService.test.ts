import { TraineeReferenceService } from "../TraineeReferenceService";
import { AxiosResponse } from "axios";
import { errorResponse } from "../../mock-data/service-api-err-res";
import { CombinedReferenceData } from "../../models/CombinedReferenceData";
import { mockedCombinedReference } from "../../mock-data/combinedReferenceData";

const mockService = new TraineeReferenceService();
describe("TraineeReferenceService", () => {
  it("getCombinedReferenceData method returns success response on promise resolve", () => {
    const successResponse: Promise<AxiosResponse<CombinedReferenceData>> =
      Promise.resolve({
        data: mockedCombinedReference,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });

    jest.spyOn(mockService, "get").mockReturnValue(successResponse);

    expect(mockService.getCombinedReferenceData()).toEqual(successResponse);
  });

  it("getCombinedReferenceData method returns error response on promise rejection", () => {
    jest.spyOn(mockService, "get").mockRejectedValue(errorResponse);

    mockService.getCombinedReferenceData().catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });
});
