import { renderHook } from "@testing-library/react";
import { useNotificationMessage } from "../useNotificationMessage";
import { getNotificationMessage } from "../../../redux/slices/notificationsSlice";
import { useAppSelector } from "../../../redux/hooks/hooks";
import store from "../../../redux/store/store";
import { useParams } from "react-router-dom";
import { mockNotificationMsg } from "../../../mock-data/mock-notifications-data";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn()
}));

jest.mock("../../../redux/hooks/hooks", () => ({
  useAppSelector: jest.fn()
}));

jest.mock("../../../redux/store/store", () => ({
  dispatch: jest.fn()
}));

jest.mock("../../../redux/slices/notificationsSlice", () => ({
  getNotificationMessage: jest.fn()
}));

const mockedUseParams = useParams as jest.Mock;
const mockedUseAppSelector = useAppSelector as jest.Mock;
const mockedDispatch = store.dispatch as jest.Mock;
const mockedGetNotificationMessage =
  getNotificationMessage as unknown as jest.Mock;

describe("useNotificationMessage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("dispatches getNotificationMessage with the current id", () => {
    const mockAction = {
      type: "notifications/getNotificationMessage",
      payload: "123"
    };
    mockedUseParams.mockReturnValue({ id: "123" });
    mockedUseAppSelector.mockImplementation(selector =>
      selector({
        notifications: {
          notificationMsg: mockNotificationMsg,
          msgStatus: "idle"
        }
      })
    );
    mockedGetNotificationMessage.mockReturnValue(mockAction);

    renderHook(() => useNotificationMessage());

    expect(mockedGetNotificationMessage).toHaveBeenCalledWith("123");
    expect(mockedDispatch).toHaveBeenCalledWith(mockAction);
  });

  it("returns the notification message and status from the store", () => {
    mockedUseParams.mockReturnValue({ id: "456" });
    mockedUseAppSelector.mockImplementation(selector =>
      selector({
        notifications: {
          notificationMsg: mockNotificationMsg,
          msgStatus: "succeeded"
        }
      })
    );

    const { result } = renderHook(() => useNotificationMessage());

    expect(result.current.notificationMessageContent?.content).toBe(
      "<p>Test notification message</p>"
    );
    expect(result.current.notificationMessageStatus).toBe("succeeded");
  });
});
