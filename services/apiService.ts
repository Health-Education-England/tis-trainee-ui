import * as Sentry from "@sentry/browser";
import { fetchAuthSession } from "aws-amplify/auth";

export type ApiResponseType = "blob" | "json" | "text";

export type ApiHeaders = Record<string, string>;

export interface ApiRequestConfig {
  headers?: ApiHeaders;
  responseType?: ApiResponseType;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: ApiHeaders;
  config: ApiRequestConfig;
}

export class ApiError<T = unknown> extends Error {
  data: T;
  status: number;
  statusText: string;
  headers: ApiHeaders;
  config: ApiRequestConfig;
  response: ApiResponse<T>;

  constructor(response: ApiResponse<T>) {
    super(
      response.statusText || `Request failed with status ${response.status}`
    );
    Object.setPrototypeOf(this, ApiError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
    this.name = "ApiError";
    this.data = response.data;
    this.status = response.status;
    this.statusText = response.statusText;
    this.headers = response.headers;
    this.config = response.config;
    this.response = response;
  }
}

const DEFAULT_HEADERS: ApiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json"
};

const normalizeHeaders = (headers: Headers): ApiHeaders => {
  const normalizedHeaders: ApiHeaders = {};

  headers.forEach((value, key) => {
    normalizedHeaders[key] = value;
  });

  return normalizedHeaders;
};

interface ParseBodyDataOptions {
  fallbackToTextOnJsonError?: boolean;
}

const parseBodyData = async <T>(
  response: Response,
  responseType: ApiResponseType,
  options: ParseBodyDataOptions = {}
): Promise<T> => {
  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  if (responseType === "blob") {
    return (await response.blob()) as T;
  }

  if (responseType === "text") {
    return (await response.text()) as T;
  }

  const responseText = await response.text();

  if (!responseText) {
    return undefined as T;
  }

  try {
    return JSON.parse(responseText) as T;
  } catch (error) {
    if (options.fallbackToTextOnJsonError) {
      return responseText as T;
    }

    throw error;
  }
};

const parseResponseData = async <T>(
  response: Response,
  responseType: ApiResponseType
): Promise<T> => {
  return parseBodyData<T>(response, responseType);
};

const parseErrorResponseData = async <T>(
  response: Response,
  responseType: ApiResponseType
): Promise<T> => {
  return parseBodyData<T>(response, responseType, {
    fallbackToTextOnJsonError: true // thought this might be helpful for debugging?
  });
};

export const onRejected = async function (error: unknown) {
  // Any status codes that falls outside the range of 2xx.
  Sentry.captureException(error);
  return Promise.reject(error);
};

export class ApiService {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getRequestHeaders(
    configHeaders: ApiHeaders = {}
  ): Promise<ApiHeaders> {
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    return {
      ...DEFAULT_HEADERS,
      ...configHeaders,
      ...(idToken ? { authorization: `Bearer ${idToken}` } : {})
    };
  }

  private async request<TResponse = unknown, TRequest = unknown>(
    method: string,
    endpoint: string,
    formData?: TRequest,
    config: ApiRequestConfig = {}
  ): Promise<ApiResponse<TResponse>> {
    const responseType = config.responseType ?? "json";

    try {
      const headers = await this.getRequestHeaders(config.headers);
      const requestConfig: RequestInit = {
        method,
        headers
      };

      if (formData !== undefined) {
        requestConfig.body = JSON.stringify(formData);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, requestConfig);
      const responseHeaders = normalizeHeaders(response.headers);

      if (!response.ok) {
        const apiErrorResponse: ApiResponse<TResponse> = {
          data: await parseErrorResponseData<TResponse>(response, responseType),
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          config
        };

        return onRejected(new ApiError(apiErrorResponse));
      }

      const apiResponse: ApiResponse<TResponse> = {
        data: await parseResponseData<TResponse>(response, responseType),
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        config
      };

      return apiResponse;
    } catch (error) {
      return onRejected(error);
    }
  }

  get<TResponse = unknown>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("GET", endpoint, undefined, config);
  }

  post<TResponse = unknown, TRequest = unknown>(
    endpoint: string,
    formData?: TRequest,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>(
      "POST",
      endpoint,
      formData,
      config
    );
  }

  // Note: needed to refactor to allow for different req and res types
  put<TResponse = unknown, TRequest = unknown>(
    endpoint: string,
    formData?: TRequest,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse, TRequest>("PUT", endpoint, formData, config);
  }

  delete<TResponse = unknown>(
    endpoint: string,
    config?: ApiRequestConfig
  ): Promise<ApiResponse<TResponse>> {
    return this.request<TResponse>("DELETE", endpoint, undefined, config);
  }
}

export default ApiService;
