import { render, fireEvent } from "@testing-library/react";
import { NotificationsTable } from "../NotificationsTable";
import { notificationsData } from "../../../mock-data/notifications";
import store from "../../../redux/store/store";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { updateNotificationStatus } from "../../../utilities/NotificationsUtilities";
import { useAppDispatch } from "../../../redux/hooks/hooks";
import { loadedNotificationsList } from "../../../redux/slices/notificationsSlice";

jest.mock("../../../utilities/NotificationsUtilities", () => ({
  ...jest.requireActual("../../../utilities/NotificationsUtilities"),
  updateNotificationStatus: jest.fn()
}));

test("NotificationsTable", () => {
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
  const { getByTestId } = renderMockedNotificationTable();
  const tableRow = getByTestId(
    `notificationsTableRow-${notificationsData[1].id}`
  );
  fireEvent.click(tableRow);
  expect(updateNotificationStatus).toHaveBeenCalledWith(
    notificationsData[1],
    "READ"
  );
});
