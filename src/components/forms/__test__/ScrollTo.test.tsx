import React from "react";
import ScrollTo from "../ScrollTo";
import { shallow } from "enzyme";

describe("ScrollTo", () => {
  it("renders without crashing", () => {
    shallow(<ScrollTo />);
  });

  it("renders without crashing scrolling to element", () => {
    shallow(<ScrollTo location="element" />);
  });

  it("renders without crashing with smooth scrolling", () => {
    shallow(<ScrollTo scrollType="smooth" />);
  });
});
