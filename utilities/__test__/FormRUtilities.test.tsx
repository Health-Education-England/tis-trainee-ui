import { FormRUtilities } from "../FormRUtilities";

// Note - delete tests when FormB uses FormBuilder
describe("FormRUtilities", () => {
  it("should return value if data (string) provided", () => {
    const value = "Super Compliment";
    expect(FormRUtilities.showMsgIfEmpty(value)).toBe(value);
  });
  it("should return given message if no data (empty string) provided", () => {
    const value = "";
    const message = "This is my message if no data";
    expect(FormRUtilities.showMsgIfEmpty(value, message)).toBe(message);
  });
  it("should return default message if no value (empty string) and no message provided", () => {
    const value = "";
    expect(FormRUtilities.showMsgIfEmpty(value)).toBe("None recorded");
  });
});
