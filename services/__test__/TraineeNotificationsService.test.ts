import { AxiosRequestHeaders, AxiosResponse } from "axios";
import { TraineeNotificationsService } from "../TraineeNotificationsService";
import { NotificationPage } from "../../redux/slices/notificationsSlice";
import { inAppNotifications } from "../../mock-data/mock-notifications-data";

const mockService = new TraineeNotificationsService();
describe("TraineeNotificationsService", () => {
  it("getAllNotifications should call /notifications when no params provided", async () => {
    const mockResponse: AxiosResponse<NotificationPage> = {
      data: {
        content: inAppNotifications,
        page: {
          size: 2000,
          number: 0,
          totalElements: 0,
          totalPages: 1
        }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders
      },
    };

    jest
      .spyOn(mockService, "get")
      .mockResolvedValue(mockResponse);

    const result = await mockService.getAllNotifications();

    expect(mockService.get).toHaveBeenCalledWith("/notifications");
    expect(result).toEqual(mockResponse);
  });

  it("getAllNotifications should call /notifications with query string when params are provided", async () => {
    const params = { page: 1, size: 10, sort:"sentAt,desc", type:"IN_APP", status:"UNREAD", keyword:"Placement" };
    const mockResponse: AxiosResponse<NotificationPage> = {
      data: {
        content: inAppNotifications,
        page: {
          size: 2000,
          number: 0,
          totalElements: 0,
          totalPages: 1
        }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders
      },
    };

    jest
      .spyOn(mockService, "get")
      .mockResolvedValue(mockResponse);

    const result = await mockService.getAllNotifications(params);

    expect(mockService.get).toHaveBeenCalledWith("/notifications?page=1&size=10&sort=sentAt%2Cdesc&type=IN_APP&status=UNREAD&keyword=Placement");
    expect(result).toEqual(mockResponse);
  });

  it("getAllNotifications should ignore empty or null param values", async () => {
    const params = { page: 1, type: "" };
    const mockResponse: AxiosResponse<NotificationPage> = {
      data: {
        content: inAppNotifications,
        page: {
          size: 2000,
          number: 0,
          totalElements: 0,
          totalPages: 1
        }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {
        headers: {} as AxiosRequestHeaders
      },
    };

    jest
      .spyOn(mockService, "get")
      .mockResolvedValue(mockResponse);

    const result = await mockService.getAllNotifications(params);

    expect(mockService.get).toHaveBeenCalledWith("/notifications?page=1");
    expect(result).toEqual(mockResponse);
  });
});
