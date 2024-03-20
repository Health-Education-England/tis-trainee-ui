import { render, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { NotificationsTable } from "../../../components/notifications/NotificationsTable";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { loadedNotificationsList } from "../../../redux/slices/notificationsSlice";
import { notificationsData } from "../../../mock-data/notifications";
import store from "../../../redux/store/store";
import { updateNotificationStatus } from "../../../utilities/NotificationsUtilities";

jest.mock("../../../utilities/NotificationsUtilities", () => ({
  updateNotificationStatus: jest.fn()
}));

describe("NotificationsTable", () => {
  const MockedNotificationsTable = () => {
    const dispatch = useAppDispatch();
    dispatch(loadedNotificationsList([notificationsData[1]]));
    return <NotificationsTable />;
  };
  const renderMockedNotificationTable = () =>
    render(
      <Provider store={store}>
        <Router history={history}>
          <MockedNotificationsTable />
        </Router>
      </Provider>
    );

  // TODO - this test is still a WIP
  it("should mark the notification as 'unread' after clicking the 'mark as unread' button but then update reversed after failed BE update", async () => {
    (updateNotificationStatus as jest.Mock).mockResolvedValueOnce(undefined);
    const { getByRole } = renderMockedNotificationTable();

    const button = getByRole("button", {
      name: /Mark as unread/i
    });
    expect(button).toBeInTheDocument();

    await act(async () => userEvent.click(button));

    expect(updateNotificationStatus).toHaveBeenCalledWith(
      notificationsData[1],
      "UNREAD"
    );
    // But then unread update reversed after failed BE update
    expect(button).toBeInTheDocument();
  });
});
