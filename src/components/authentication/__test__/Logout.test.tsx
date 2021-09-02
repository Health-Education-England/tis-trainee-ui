import Logout from "../Logout";
import { shallow, mount } from "enzyme";

describe("Logout", () => {
  it("renders without crashing", () => {
    shallow(<Logout />);
  });
});
