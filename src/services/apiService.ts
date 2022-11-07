import axios, { AxiosInstance, AxiosResponse } from "axios";
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
  }

  get<T = any>(endpoint: string, params?: any): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(endpoint, params);
  }

  post<T = any>(endpoint: string, formData: T): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(endpoint, formData);
  }

  put<T = any>(endpoint: string, formData: T): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(endpoint, formData);
  }
}

export default ApiService;
