import { AxiosResponse } from "axios";
import { FormsService } from "../FormsService";
import { submittedFormRPartAs } from "../../mock-data/submitted-formr-parta";
import { submittedFormRPartBs } from "../../mock-data/submitted-formr-partb";
import { errorResponse } from "../../mock-data/service-api-err-res";
import { FormRPartB } from "../../models/FormRPartB";
import { FormRPartA } from "../../models/FormRPartA";
import { mockProgrammeMemberships } from "../../mock-data/trainee-profile";

const mockService = new FormsService();
describe("FormsService", () => {
  it("downloadTraineeCojPdf method should download PDF from server", async () => {
    const programmeMembership = mockProgrammeMemberships[0];
    const successResponse: AxiosResponse<Blob> = {
      data: new Blob(),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {}
    };

    jest
      .spyOn(mockService.axiosInstance, "put")
      .mockResolvedValue(successResponse);

    const result = await mockService.downloadTraineeCojPdf(programmeMembership);

    expect(mockService.axiosInstance.put).toHaveBeenCalledWith(
      "/coj",
      programmeMembership,
      {
        headers: {
          Accept: "application/pdf"
        },
        responseType: "blob"
      }
    );
    expect(result).toEqual(successResponse);
  });

  it("getTraineeFormRPartA method should return success response", () => {
    const successResponse: Promise<AxiosResponse<FormRPartA[]>> =
      Promise.resolve({
        data: submittedFormRPartAs,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });

    jest.spyOn(mockService, "get").mockReturnValue(successResponse);

    expect(mockService.getTraineeFormRPartAList()).toEqual(successResponse);
  });

  it("saveTraineeFormRPartA method should return success response", () => {
    const successResponse: Promise<AxiosResponse<FormRPartA>> = Promise.resolve(
      {
        data: submittedFormRPartAs[0],
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      }
    );

    jest.spyOn(mockService, "post").mockReturnValue(successResponse);

    expect(mockService.saveTraineeFormRPartA(submittedFormRPartAs[0])).toEqual(
      successResponse
    );
  });

  it("getTraineeFormRPartB method should return success response", () => {
    const successResponse: Promise<AxiosResponse<FormRPartB[]>> =
      Promise.resolve({
        data: submittedFormRPartBs,
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      });

    jest.spyOn(mockService, "get").mockReturnValue(successResponse);

    expect(mockService.getTraineeFormRPartAList()).toEqual(successResponse);
  });

  it("saveTraineeFormRPartB method should return success response", () => {
    const successResponse: Promise<AxiosResponse<FormRPartB>> = Promise.resolve(
      {
        data: submittedFormRPartBs[0],
        status: 200,
        statusText: "OK",
        headers: {},
        config: {}
      }
    );

    jest.spyOn(mockService, "post").mockReturnValue(successResponse);

    expect(mockService.saveTraineeFormRPartB(submittedFormRPartBs[0])).toEqual(
      successResponse
    );
  });

  it("saveTraineeFormRPartB method should return error response on promise rejection", () => {
    jest.spyOn(mockService, "get").mockRejectedValue(errorResponse);

    mockService.saveTraineeFormRPartB(submittedFormRPartBs[0]).catch(res => {
      expect(res).toEqual(errorResponse);
    });
  });
  it("deleteTraineeFormRPartA method should return success response", () => {
    const successResponse: Promise<AxiosResponse> = Promise.resolve({
      data: {},
      status: 204,
      statusText: "OK",
      headers: {},
      config: {}
    });

    jest.spyOn(mockService, "delete").mockReturnValue(successResponse);

    expect(mockService.deleteTraineeFormRPartA("123")).toEqual(successResponse);
  });
  it("deleteTraineeFormRPartB method should return success response", () => {
    const successResponse: Promise<AxiosResponse> = Promise.resolve({
      data: {},
      status: 204,
      statusText: "OK",
      headers: {},
      config: {}
    });

    jest.spyOn(mockService, "delete").mockReturnValue(successResponse);

    expect(mockService.deleteTraineeFormRPartB("123")).toEqual(successResponse);
  });
});
