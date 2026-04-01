import ApiService, { ApiError, onRejected } from "../apiService";
import { errorResponse } from "../../mock-data/service-api-err-res";
import * as Sentry from "@sentry/browser";
import { fetchAuthSession } from "aws-amplify/auth";

jest.mock("aws-amplify/auth", () => ({
  fetchAuthSession: jest.fn()
}));

describe("ApiService", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    jest.restoreAllMocks();

    if (originalFetch === undefined) {
      Reflect.deleteProperty(globalThis, "fetch");
      return;
    }

    Object.defineProperty(globalThis, "fetch", {
      value: originalFetch,
      writable: true,
      configurable: true
    });
  });

  it("Error should be captured by Sentry on rejection", async () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");

    await expect(onRejected(errorResponse)).rejects.toEqual(errorResponse);

    expect(sentrySpy).toHaveBeenCalledWith(errorResponse);
  });

  it("should omit authorization header when id token is unavailable", async () => {
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: jest.fn().mockResolvedValue("{}"),
      blob: jest.fn()
    } as unknown as Response;

    const fetchMock = jest.fn().mockResolvedValue(mockResponse);
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    await service.get("/trainees");

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const requestHeaders = requestInit.headers as Record<string, string>;

    expect(requestHeaders).not.toHaveProperty("authorization");
    expect(requestHeaders["Content-Type"]).toBe("application/json");
    expect(requestHeaders.Accept).toBe("application/json");
  });

  it("should include authorization header and serialize POST body", async () => {
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({
      tokens: {
        idToken: {
          toString: () => "token-123"
        }
      }
    } as never);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: jest.fn().mockResolvedValue("{}"),
      blob: jest.fn()
    } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");
    const requestBody = { traineeId: "abc" };

    await service.post("/trainees", requestBody);

    const requestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const requestHeaders = requestInit.headers as Record<string, string>;

    expect(requestInit.method).toBe("POST");
    expect(requestInit.body).toBe(JSON.stringify(requestBody));
    expect(requestHeaders.authorization).toBe("Bearer token-123");
  });

  it("should call PUT and DELETE with expected HTTP methods", async () => {
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: jest.fn().mockResolvedValue("{}"),
      blob: jest.fn()
    } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    await service.put("/trainees/1", { field: "value" });
    await service.delete("/trainees/1");

    const putRequestInit = fetchMock.mock.calls[0][1] as RequestInit;
    const deleteRequestInit = fetchMock.mock.calls[1][1] as RequestInit;

    expect(putRequestInit.method).toBe("PUT");
    expect(putRequestInit.body).toBe(JSON.stringify({ field: "value" }));
    expect(deleteRequestInit.method).toBe("DELETE");
    expect(deleteRequestInit.body).toBeUndefined();
  });

  it("should parse successful text and blob responses", async () => {
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const expectedBlob = new Blob(["blob-data"], { type: "text/plain" });
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        text: jest.fn().mockResolvedValue("hello"),
        blob: jest.fn()
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        text: jest.fn(),
        blob: jest.fn().mockResolvedValue(expectedBlob)
      } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    const textResponse = await service.get<string>("/text", {
      responseType: "text"
    });
    const blobResponse = await service.get<Blob>("/blob", {
      responseType: "blob"
    });

    expect(textResponse.data).toBe("hello");
    expect(blobResponse.data).toBe(expectedBlob);
  });

  it("should return undefined data for successful 204 and empty JSON body", async () => {
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 204,
        statusText: "No Content",
        headers: new Headers(),
        text: jest.fn(),
        blob: jest.fn()
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers(),
        text: jest.fn().mockResolvedValue(""),
        blob: jest.fn()
      } as unknown as Response);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    const noContentResponse = await service.get("/no-content");
    const emptyJsonResponse = await service.get("/empty-json");

    expect(noContentResponse.data).toBeUndefined();
    expect(emptyJsonResponse.data).toBeUndefined();
  });

  it("should reject when fetch throws and capture the error", async () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const networkError = new Error("Network error");
    const fetchMock = jest.fn().mockRejectedValue(networkError);

    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    await expect(service.get("/trainees")).rejects.toBe(networkError);
    expect(sentrySpy).toHaveBeenCalledWith(networkError);
  });

  it("should use fallback ApiError message when statusText is empty", () => {
    const apiError = new ApiError({
      data: undefined,
      status: 500,
      statusText: "",
      headers: {},
      config: {}
    });

    expect(apiError.message).toBe("Request failed with status 500");
  });

  it("should reject when 2xx JSON body is malformed and capture parse error", async () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({} as never);

    const mockResponse = {
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: jest.fn().mockResolvedValue("malformed-json-response"),
      blob: jest.fn()
    } as unknown as Response;

    const fetchMock = jest.fn().mockResolvedValue(mockResponse);
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    await expect(service.get("/trainees")).rejects.toBeInstanceOf(SyntaxError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentrySpy).toHaveBeenCalledTimes(1);
    expect(sentrySpy.mock.calls[0][0]).toBeInstanceOf(SyntaxError);
  });

  it("should reject with ApiError when non-2xx JSON body is malformed", async () => {
    const sentrySpy = jest.spyOn(Sentry, "captureException");
    const mockedFetchAuthSession = fetchAuthSession as jest.MockedFunction<
      typeof fetchAuthSession
    >;
    mockedFetchAuthSession.mockResolvedValue({
      tokens: {
        idToken: {
          toString: () => "mock-id-token"
        }
      }
    } as never);

    const mockResponse = {
      ok: false,
      status: 400,
      statusText: "Bad Request",
      headers: new Headers({ "x-request-id": "abc-123" }),
      text: jest.fn().mockResolvedValue("malformed-json-response"),
      blob: jest.fn()
    } as unknown as Response;

    const fetchMock = jest.fn().mockResolvedValue(mockResponse);
    Object.defineProperty(globalThis, "fetch", {
      value: fetchMock,
      writable: true,
      configurable: true
    });

    const service = new ApiService("https://example.test");

    let thrownError: unknown;

    try {
      await service.get("/trainees");
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(ApiError);

    const apiError = thrownError as ApiError<string>;

    expect(apiError.status).toBe(400);
    expect(apiError.statusText).toBe("Bad Request");
    expect(apiError.data).toBe("malformed-json-response");
    expect(apiError.headers["x-request-id"]).toBe("abc-123");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(sentrySpy).toHaveBeenCalledWith(apiError);
  });
});
