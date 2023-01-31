import React from "react";
import PageNotFound from "../PageNotFound";
import { shallow } from "enzyme";

describe("PageNotFound", () => {
  it("renders without crashing", () => {
    shallow(<PageNotFound />);
  });
});
