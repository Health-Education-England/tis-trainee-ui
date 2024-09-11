import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import {
  FontAwesomeIconWrapper,
  ToastMessage,
  ToastType,
  showToast
} from "../ToastMessage";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe("ToastMessage - error", () => {
  it("displays the error message plus Support link and href data", () => {
    jest
      .spyOn(window.navigator, "userAgent", "get")
      .mockReturnValue("Mocked User Agent Info");
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "https://www.evertonfc.com"
    });
    store.dispatch(updatedTraineeProfileStatus("succeeded"));
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));

    const { getByText, getByRole } = render(
      <Provider store={store}>
        <ToastMessage
          msg="This is an error toast message"
          type={ToastType.ERROR}
          actionErrorMsg="808 State"
        />
      </Provider>
    );

    const messageElement = getByText("This is an error toast message");
    expect(messageElement).toBeInTheDocument();

    const supportLinkElement = getByRole("link", {
      name: /Click here to email Support/i
    });

    // Simulate click event on the support link
    fireEvent.click(supportLinkElement);

    // Wait for any asynchronous tasks to complete
    return waitFor(() => {
      const expectedHref =
        "mailto:england.tis.support@nhs.net?subject=TSS tech support query (GMC no. 1111111, TIS ID 123)&body=Browser and OS info:%0AUser Agent: Mocked User Agent Info%0A%0APage URL:%0Ahttps://www.evertonfc.com%0A%0AError message:%0A808 State%0A%0A%0A%0A";

      // Check the href attribute of the support link element
      expect(supportLinkElement.getAttribute("href")).toBe(expectedHref);
    });
  });
});

describe("showToast", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call toast.success with correct parameters for success message", () => {
    showToast("Success message", ToastType.SUCCESS);

    expect(toast.success).toHaveBeenCalledWith(
      <ToastMessage
        data-cy="toastMsgSuccess"
        msg="Success message"
        type={ToastType.SUCCESS}
      />,
      {
        autoClose: 6000,
        icon: <FontAwesomeIconWrapper messageType={ToastType.SUCCESS} />
      }
    );
  });

  test("should call toast.error with correct parameters for error message", () => {
    const actionErrorMsg = "Action error message";
    showToast("Error message", ToastType.ERROR, actionErrorMsg);

    expect(toast.error).toHaveBeenCalledWith(
      <ToastMessage
        data-cy="toastMsgError"
        msg="Error message"
        type={ToastType.ERROR}
        actionErrorMsg="Action error message"
      />,
      {
        icon: <FontAwesomeIconWrapper messageType={ToastType.ERROR} />,
        autoClose: 12000
      }
    );
  });
});
