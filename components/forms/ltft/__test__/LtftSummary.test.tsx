import React from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import LtftSummary from "../LtftSummary";
import {
  mockLtftDraftList,
  mockLtftsList1
} from "../../../../mock-data/mock-ltft-data";
import * as FormBuilderUtilities from "../../../../utilities/FormBuilderUtilities";
import history from "../../../../components/navigation/history";

// Mock Dialog methods that JSDOM doesn't support
HTMLDialogElement.prototype.showModal = jest.fn();
HTMLDialogElement.prototype.close = jest.fn();

jest.mock("../../../../utilities/FormBuilderUtilities", () => ({
  loadTheSavedForm: jest.fn()
}));

jest.mock("../../../../components/navigation/history", () => ({
  push: jest.fn()
}));

const store = configureStore({
  reducer: () => ({
    forms: { ltft: { status: "idle" } }
  })
});

describe("LtftSummary Row Interactions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CURRENT type row interactions", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <LtftSummary
              ltftSummaryType="CURRENT"
              ltftSummaryStatus="succeeded"
              ltftSummaryList={mockLtftDraftList}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should call loadTheSavedForm when clicking a row", async () => {
      const user = userEvent.setup();

      const firstRow = document.querySelector('[data-cy="ltft-row-0"]');
      expect(firstRow).not.toBeNull();

      await user.click(firstRow as HTMLElement);

      expect(FormBuilderUtilities.loadTheSavedForm).toHaveBeenCalledWith(
        "/ltft",
        mockLtftDraftList[0].id,
        history
      );
    });

    it("should call loadTheSavedForm with the id of the row that was clicked", async () => {
      const user = userEvent.setup();

      // Click the second row using standard DOM query
      const secondRow = document.querySelector('[data-cy="ltft-row-1"]');
      expect(secondRow).not.toBeNull();
      await user.click(secondRow as HTMLElement);

      // Verify correct ID was passed
      expect(FormBuilderUtilities.loadTheSavedForm).toHaveBeenCalledWith(
        "/ltft",
        mockLtftDraftList[1].id,
        history
      );
    });
  });

  describe("PREVIOUS type row interactions", () => {
    beforeEach(() => {
      render(
        <Provider store={store}>
          <MemoryRouter>
            <LtftSummary
              ltftSummaryType="PREVIOUS"
              ltftSummaryStatus="succeeded"
              ltftSummaryList={mockLtftsList1}
            />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should call history.push when clicking a row", async () => {
      const user = userEvent.setup();

      const firstRow = document.querySelector('[data-cy="ltft-row-0"]');
      expect(firstRow).not.toBeNull();
      await user.click(firstRow as HTMLElement);

      expect(history.push).toHaveBeenCalledWith(
        `/ltft/${mockLtftsList1[0].id}`
      );

      expect(FormBuilderUtilities.loadTheSavedForm).not.toHaveBeenCalled();
    });
  });
});
