import React from "react";
import PageTitle from "../PageTitle";
import { shallow, mount } from "enzyme";

describe("PageTitle", () => {
  it("renders without crashing", () => {
    shallow(<PageTitle />);
  });
  it("displays the correct default page title", () => {
    const wrapper = mount(<PageTitle />);
    expect(wrapper.find("NullComponent").prop("title")).toBe(
      "TIS Self-Service"
    );
  });

  it("displays the correct custom page title", () => {
    const customTitle = "Custom Title";
    const wrapper = mount(<PageTitle title={customTitle} />);
    expect(wrapper.find("NullComponent").prop("title")).toContain(customTitle);
  });
});
