import { render, fireEvent, waitFor } from "@testing-library/react";
import CredentialIssue from "../CredentialIssue";
import { handleIssueCredential } from "../../../utilities/DspUtilities";
import { MemoryRouter, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../redux/store/store";
import {
  updatedDspPanelObjName,
  updatedDspPanelObj,
  updatedDspGatewayUri
} from "../../../redux/slices/dspSlice";
import React from "react";

jest.mock("../../../utilities/DspUtilities", () => ({
  handleIssueCredential: jest.fn()
}));

describe("CredentialIssue component", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true
    });
  });
  it("calls handleIssueCredential on button click", async () => {
    const panelName = "programmes";
    const stateParam = "eMdRu7Ir8kRNOrs8QxKSP";
    const panelData = {
      tisId: "321",
      programmeTisId: "2",
      programmeName: "General Practice",
      programmeNumber: "EOE8950",
      startDate: "2020-01-01",
      endDate: "2028-01-01",
      managingDeanery: "West of England",
      curricula: []
    };
    store.dispatch(updatedDspPanelObjName(panelName));
    store.dispatch(updatedDspPanelObj(panelData));
    store.dispatch(updatedDspGatewayUri(""));
    localStorage.setItem(
      stateParam,
      JSON.stringify({
        panelData: store.getState().dsp.dspPanelObj,
        panelName: store.getState().dsp.dspPanelObjName
      })
    );
    (handleIssueCredential as jest.Mock).mockResolvedValueOnce(
      "https://www.evertonfc.com"
    );

    const { getByRole } = render(
      <MemoryRouter initialEntries={[`/?state=${stateParam}`]}>
        <Route path="/">
          <Provider store={store}>
            <CredentialIssue />
          </Provider>
        </Route>
      </MemoryRouter>
    );

    const button = getByRole("button", {
      name: /Click to add credential to your wallet/i
    });

    fireEvent.click(button);

    expect(handleIssueCredential).toHaveBeenCalledWith(stateParam, panelName);

    await waitFor(() => {
      expect(window.location.href).toBe("https://www.evertonfc.com");
    });
  });
});
