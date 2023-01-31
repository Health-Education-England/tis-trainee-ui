import React from "react";
import InputFooterLabel from "../InputFooterLabel";
import { shallow } from "enzyme";

describe("InputFooterLabel", () => {
  it("renders without crashing", () => {
    shallow(<InputFooterLabel label="Input footer label" />);
  });
});
