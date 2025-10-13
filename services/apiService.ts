import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as Sentry from "@sentry/browser";
import { fetchAuthSession } from "aws-amplify/auth";

export const onFulfilled = async function (response: any) {
  // Any status code that lie within the range of 2xx.
  return response;
};

export const onRejected = async function (error: any) {
  // Any status codes that falls outside the range of 2xx.
  Sentry.captureException(error);
  return Promise.reject(error);
};

export class ApiService {
  axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {}
    });

    this.axiosInstance.interceptors.request.use(async function (config: any) {
      const session = await fetchAuthSession();
      config.headers.authorization = `Bearer ${session.tokens?.idToken?.toString()}`;
      return config;
    });

    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  }

  get<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(endpoint);
  }

  post<T = any>(
    endpoint: string,
    formData?: T,
    params?: any
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(endpoint, formData, params);
  }

  // Note: needed to refactor to allow for different req and res types
  put<TResponse = any, TRequest = any>(
    endpoint: string,
    formData?: TRequest
  ): Promise<AxiosResponse<TResponse>> {
    return this.axiosInstance.put(endpoint, formData);
  }

  delete(endpoint: string): Promise<AxiosResponse> {
    return this.axiosInstance.delete(endpoint);
  }
}

export default ApiService;
