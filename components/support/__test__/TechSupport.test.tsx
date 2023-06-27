import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { supportCatOptions } from "../../../utilities/Constants";
import { TechSupport } from "../TechSupport";
import selectEvent from "react-select-event";

describe("TechSupport", () => {
  const renderTechSupport = () => {
    return render(
      <TechSupport
        emailIds="TisID: 47165, GMC: 1111111"
        userAgentData="Mocked User Agent Info"
      />
    );
  };
  const openSelectList = (selectElement: HTMLElement) => {
    act(() => {
      selectEvent.openMenu(selectElement);
    });
  };
  const clickElement = async (optionElement: Element | HTMLElement) => {
    await act(async () => {
      await userEvent.click(optionElement);
    });
  };

  it("should display the selected Support Desk (SD) categories in alphabetical order in the Link href.", async () => {
    const { getByRole } = renderTechSupport();
    const selectElement = getByRole("combobox");
    openSelectList(selectElement);
    const login = screen.getByText(supportCatOptions[5].label);
    await clickElement(login);
    openSelectList(selectElement);
    const authenticator = screen.getByText(supportCatOptions[0].label);
    await clickElement(authenticator);

    const supportLinkElement = getByRole("link", {
      name: /Please click here to email Technical Support/i
    });
    clickElement(supportLinkElement);
    const expectedHref =
      "mailto:tis.support@hee.nhs.uk?subject=TSS Technical support query (TisID: 47165, GMC: 1111111, Support categories: Authenticator, Login)&body=Browser and OS info:%0AMocked User Agent Info%0A%0APlease describe your issue(s) below. Include any screenshots you think might help: %0A%0A%0A";
    expect(supportLinkElement.getAttribute("href")).toBe(expectedHref);
  });

  it("does not display ActionLink when no options are selected", () => {
    const { queryByRole } = renderTechSupport();
    const supportLinkElement = queryByRole("link", {
      name: /Please click here to email Technical Support/i
    });
    expect(supportLinkElement).not.toBeInTheDocument();
  });
});
