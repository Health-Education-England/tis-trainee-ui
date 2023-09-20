import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supportCatOptions } from "../../../utilities/Constants";
import { LoSupport } from "../LoSupport";
import selectEvent from "react-select-event";
import store from "../../../redux/store/store";
import { updatedReference } from "../../../redux/slices/referenceSlice";
import { mockedCombinedReference } from "../../../mock-data/combinedReferenceData";
import { Provider } from "react-redux";

describe("LoSupport", () => {
  store.dispatch(updatedReference(mockedCombinedReference));
  const renderLoSupport = () => {
    return render(
      <Provider store={store}>
        <LoSupport
          emailIds="TisID: 47165, GMC: 1111111"
          userAgentData="Mocked User Agent Info"
        />
      </Provider>
    );
  };

  const openSelectList = (selectElement: HTMLElement) => {
    act(() => {
      selectEvent.openMenu(selectElement);
    });
  };

  const clickElement = async (optionElement: Element) => {
    await act(async () => {
      await userEvent.click(optionElement);
    });
  };

  it("should display the PGMDE support portal link when a Local Office that uses the PGMDE support portal is selected", async () => {
    const { getAllByRole, getByRole } = renderLoSupport();
    const user = userEvent.setup();

    const loList = getAllByRole("combobox")[0];
    await act(async () => {
      await user.selectOptions(loList, "Health Education England South London");
    });

    const PgmdeSupportLink = getByRole("link", {
      name: /Click here to email your support request via the PGMDE Support Portal/i
    });

    expect(PgmdeSupportLink).toBeInTheDocument();
    expect(PgmdeSupportLink.getAttribute("href")).toBe(
      "https://lasepgmdesupport.hee.nhs.uk/support/tickets/new?form_7=true"
    );
  });

  it("should display the support categories and LO support link when a Non-PGMDE local office is selected", async () => {
    const { getByRole, getAllByRole } = renderLoSupport();
    const user = userEvent.setup();

    const loList = getAllByRole("combobox")[0];
    await act(async () => {
      await user.selectOptions(
        loList,
        "Health Education England Thames Valley"
      );
    });

    const loSupportCatList = getAllByRole("combobox")[1];
    openSelectList(loSupportCatList);

    const supportCatChosenOption = screen.getByText(supportCatOptions[0].label);
    await clickElement(supportCatChosenOption);

    const loSupportLink = getByRole("link", {
      name: /Please click here to email Health Education England Thames Valley/i
    });
    expect(loSupportLink).toBeInTheDocument();
    await act(() => {
      fireEvent.click(loSupportLink);
    });
    const expectedHref =
      "mailto:england.formr.tv@nhs.net?subject=TSS LO support query (TisID: 47165, GMC: 1111111, Support categories: Authenticator)&body=Browser and OS info:%0AMocked User Agent Info%0A%0APlease describe your issue(s) below. Include any screenshots you think might help: %0A%0A%0A";
    expect(loSupportLink.getAttribute("href")).toBe(expectedHref);
  });
});
