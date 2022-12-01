import axios, { AxiosInstance, AxiosResponse } from "axios";
import * as Sentry from "@sentry/browser";
import { Auth } from "aws-amplify";

export class ApiService {
  axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {}
    });

    this.axiosInstance.interceptors.request.use(async function (config) {
      let user = await Auth.currentAuthenticatedUser();
      config.headers.authorization = `Bearer ${user.signInUserSession.idToken.jwtToken}`;

      return config;
    });

    this.axiosInstance.interceptors.response.use(
      async function (response) {
        // Any status code that lie within the range of 2xx
        return response;
      },
      async function (error) {
        // Any status codes that falls outside the range of 2xx
        Sentry.captureException(error);
        return Promise.reject(error);
      }
    );
  }

  get<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
    console.log(this.axiosInstance.interceptors);
    return this.axiosInstance.get(endpoint);
  }

  post<T = any>(endpoint: string, formData: T): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(endpoint, formData);
  }

  put<T = any>(endpoint: string, formData: T): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(endpoint, formData);
  }
}

export default ApiService;
