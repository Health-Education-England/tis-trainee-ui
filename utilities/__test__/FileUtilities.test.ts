import { AxiosResponse } from "axios";
import { FileUtilities } from "../FileUtilities";
import { showToast, ToastType } from "../../components/common/ToastMessage";
jest.mock("../../components/common/ToastMessage");

describe("FileUtilities.downloadPdf", () => {
  let createObjectURLMock: jest.SpyInstance;
  let createElementMock: jest.SpyInstance;

  beforeEach(() => {
    window.URL.createObjectURL = jest.fn();
    window.URL.revokeObjectURL = jest.fn();
    createObjectURLMock = jest
      .spyOn(window.URL, "createObjectURL")
      .mockReturnValue("blob:url");
    createElementMock = jest
      .spyOn(document, "createElement")
      .mockImplementation(() => {
        return document.createElement("a");
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should download PDF successfully", async () => {
    const mockResponse: AxiosResponse<Blob> = {
      data: new Blob(["PDF content"], { type: "application/pdf" }),
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as any
      }
    };
    const getPdfMock = jest.fn().mockResolvedValue(mockResponse);

    await FileUtilities.downloadPdf("test.pdf", getPdfMock);

    expect(getPdfMock).toHaveBeenCalled();
    expect(createObjectURLMock).toHaveBeenCalledWith(mockResponse.data);
    expect(createElementMock).toHaveBeenCalledWith("a");
  });

  it("should handle errors gracefully", async () => {
    const getPdfMock = jest.fn().mockRejectedValue(new Error("Network error"));

    await FileUtilities.downloadPdf("test.pdf", getPdfMock);

    expect(getPdfMock).toHaveBeenCalled();
    expect(createObjectURLMock).not.toHaveBeenCalled();
    expect(createElementMock).not.toHaveBeenCalled();
  });

  it("should call showToast on download failure", async () => {
    const getPdfMock = jest.fn().mockRejectedValue(new Error("Network error"));

    await FileUtilities.downloadPdf("test.pdf", getPdfMock);

    expect(showToast as jest.Mock).toHaveBeenCalledWith(
      "Failed to download test.pdf PDF. Please try again. (error msg: Error: Network error ). ",
      ToastType.ERROR
    );
  });

  it("should handle response with Axios error object", async () => {
    const errorResponse = { response: "Server error" };
    const getPdfMock = jest.fn().mockRejectedValue(errorResponse);

    await FileUtilities.downloadPdf("test.pdf", getPdfMock);

    expect(getPdfMock).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith(
      "Failed to download test.pdf PDF. Please try again. (error msg: Server error ). ",
      ToastType.ERROR
    );
  });
});
