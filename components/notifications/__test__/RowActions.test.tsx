import { render, fireEvent } from "@testing-library/react";
import { RowActions } from "../RowActions";
import { notificationsData } from "../../../mock-data/notifications";
import store from "../../../redux/store/store";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import { updateNotificationStatus } from "../../../utilities/NotificationsUtilities";

jest.mock("../../../utilities/NotificationsUtilities", () => ({
  ...jest.requireActual("../../../utilities/NotificationsUtilities"),
  updateNotificationStatus: jest.fn()
}));

test("RowActions", () => {
  const row = notificationsData[1];
  const { getByRole } = render(
    <Provider store={store}>
      <Router history={history}>
        <RowActions row={row} />
      </Router>
    </Provider>
  );
  const button = getByRole("button", { name: /Mark as unread/i });
  fireEvent.click(button);
  expect(updateNotificationStatus).toHaveBeenCalledWith(row, "UNREAD");
});
