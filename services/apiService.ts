import axios, { AxiosInstance, AxiosResponse } from "axios";
import { Auth } from "aws-amplify";

export class ApiService {
  axiosInstance: AxiosInstance;

  constructor(baseUrl: string) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      headers: {},
    });

    this.axiosInstance.interceptors.request.use(async config => {
      let user = await Auth.currentAuthenticatedUser();

      typeof config.headers !== "undefined"
        ? (config.headers.authorization = `Bearer ${user.signInUserSession.idToken.jwtToken}`)
        : null;

      return config;
    });
  }

  get<T = any>(endpoint: string): Promise<AxiosResponse<T>> {
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
