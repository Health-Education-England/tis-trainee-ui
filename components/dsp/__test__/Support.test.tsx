import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import Support from "../../../components/support/Support";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import {
  mockTraineeProfile,
  mockTraineeProfileNoGMC
} from "../../../mock-data/trainee-profile";
import {
  updatedTraineeProfileData,
  updatedTraineeProfileStatus
} from "../../../redux/slices/traineeProfileSlice";

describe("Support", () => {
  it("should show the tisId and GMC number plus User Agent data in the Support link href", () => {
    jest
      .spyOn(window.navigator, "userAgent", "get")
      .mockReturnValue("Mocked User Agent Info");
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "http://example.com"
    });
    store.dispatch(updatedTraineeProfileStatus("succeeded"));
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
    const { getByRole } = render(
      <Provider store={store}>
        <Support />
      </Provider>
    );
    const supportLinkElement = getByRole("link", {
      name: /Please click here to email TIS Support/i
    });
    // Simulate click event on the support link
    fireEvent.click(supportLinkElement);
    // Wait for any asynchronous tasks to complete
    return waitFor(() => {
      const expectedHref =
        "mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (GMC no. 11111111, TIS ID 123)&body=Browser and OS info:%0AUser Agent: Mocked User Agent Info%0A%0A";

      // Check the href attribute of the support link element
      expect(supportLinkElement.getAttribute("href")).toBe(expectedHref);
    });
  });
  it("should show only show the tisId if no GMC number available - plus User Agent data in the Support link href", () => {
    jest
      .spyOn(window.navigator, "userAgent", "get")
      .mockReturnValue("Mocked User Agent Info");
    jest.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      href: "http://example.com"
    });
    store.dispatch(updatedTraineeProfileStatus("succeeded"));
    store.dispatch(updatedTraineeProfileData(mockTraineeProfileNoGMC));
    const { getByRole } = render(
      <Provider store={store}>
        <Support />
      </Provider>
    );
    const supportLinkElement = getByRole("link", {
      name: /Please click here to email TIS Support/i
    });
    // Simulate click event on the support link
    fireEvent.click(supportLinkElement);
    // Wait for any asynchronous tasks to complete
    return waitFor(() => {
      const expectedHref =
        "mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (TIS ID 789)&body=Browser and OS info:%0AUser Agent: Mocked User Agent Info%0A%0A";

      // Check the href attribute of the support link element
      expect(supportLinkElement.getAttribute("href")).toBe(expectedHref);
    });
  });
});
