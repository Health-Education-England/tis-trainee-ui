import { render, fireEvent, waitFor } from "@testing-library/react";
import { RowActions } from "../RowActions";
import { notificationsData } from "../../../mock-data/notifications";
import store from "../../../redux/store/store";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import history from "../../../components/navigation/history";
import {
  markAsUnreadBE,
  markAsUnreadFE
} from "../../../utilities/NotificationsUtilities";

jest.mock("../../../utilities/NotificationsUtilities", () => ({
  markAsUnreadBE: jest.fn(),
  markAsUnreadFE: jest.fn()
}));

const mockMarkAsUnreadBE = markAsUnreadBE as jest.MockedFunction<
  typeof markAsUnreadBE
>;
const mockMarkAsUnreadFE = markAsUnreadFE as jest.MockedFunction<
  typeof markAsUnreadFE
>;

test("RowActions", async () => {
  mockMarkAsUnreadBE.mockResolvedValue(undefined);

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

  expect(mockMarkAsUnreadFE).toHaveBeenCalledWith(row);
  expect(button).toBeDisabled();

  await waitFor(() => {
    expect(mockMarkAsUnreadBE).toHaveBeenCalledWith(row);
  });

  await waitFor(() => {
    expect(button).not.toBeDisabled();
  });
});
