import React from "react";
import { shallow, mount } from "enzyme";
import Section7 from "../Sections/Section7";
import { submittedFormRPartBs } from "../../../../mock-data/submitted-formr-partb";
import { SectionProps } from "../Sections/SectionProps";

jest.mock("../ValidationSchema", () => ({
  get Section7ValidationSchema() {
    return null;
  }
}));

const prevSection = jest.fn();
const nextSection = jest.fn();
const saveDraft = jest.fn();

const props: SectionProps = {
  formData: submittedFormRPartBs[0],
  previousSection: prevSection,
  nextSection: nextSection,
  saveDraft: saveDraft,
  history: [],
  section: 6,
  prevSectionLabel: "Previous section navigation label",
  nextSectionLabel: "Continue to submit"
};

describe("Form-R Part-B Section7", () => {
  it("renders without crashing", () => {
    shallow(<Section7 {...props} />);
  });

  it("mounts without crashing", () => {
    mount(<Section7 {...props} />);
  });

  it("should render page heading", () => {
    const wrapper = mount(<Section7 {...props} />);
    expect(wrapper.find("[data-jest='mainFieldset7'] legend").length).toBe(1);
  });

  it("should render previous section link buttons with correct label", () => {
    const wrapper = mount(<Section7 {...props} />);

    expect(wrapper.find("li.nhsuk-pagination-item--previous").length).toBe(1);
    expect(wrapper.find("li.nhsuk-pagination-item--previous").text()).toContain(
      "Previous section navigation label"
    );
    wrapper.find("a.nhsuk-pagination__link--prev").first().simulate("click");
    expect(prevSection).toHaveBeenCalled();
  });

  it("should render Continue to submit button", () => {
    const wrapper = mount(<Section7 {...props} />);

    expect(wrapper.find("[data-cy='BtnContinue']").length).toBe(3);
    expect(wrapper.find("[data-cy='BtnContinue']").last().text()).toContain(
      "Continue to submit"
    );
    wrapper.find("[data-cy='BtnContinue']").last().simulate("click");
  });

  it("should submit the form", () => {
    const wrapper = mount(<Section7 {...props} />);
    const form = wrapper.find("form").first();

    try {
      form.simulate("submit");
      expect(nextSection).toHaveBeenCalled();
    } catch (e) {
      expect(true).toBe(false);
    }
  });
});
