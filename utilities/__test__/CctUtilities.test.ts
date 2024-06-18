import {
  calcDefaultPropStartDate,
  calculateNewEndDates,
  FtePercentsTypes
} from "../CctUtilities";
import dayjs from "dayjs";

describe("calculateNewEndDates", () => {
  beforeAll(() => {
    const mockCurrentDate = new Date("2024-06-05T11:05:27.000Z");
    jest.spyOn(Date, "now").mockImplementation(() => mockCurrentDate.getTime());
  });

  afterAll(() => {
    jest.spyOn(Date, "now").mockRestore();
  });

  it("should correctly calculate new LTFT end dates using ftePercents available in the dropdowns and a bespoke one.", () => {
    const currentFtePercent = 100;
    const ftePercents: FtePercentsTypes[] = [
      { value: 80, label: "80%" },
      { value: 70, label: "70%" },
      { value: 60, label: "60%" },
      { value: 50, label: "50%" },
      { value: 25, label: "25%" }
    ];
    const propStartDate = "2024-09-25";
    const propEndDate = "2028-01-01";
    const currentProgEndDate = "2028-01-01";

    const result = calculateNewEndDates(
      currentFtePercent,
      ftePercents,
      propStartDate,
      propEndDate,
      currentProgEndDate
    );

    expect(result).toEqual([
      { ftePercent: "80%", newEndDate: "26/10/2028" },
      { ftePercent: "70%", newEndDate: "27/05/2029" },
      { ftePercent: "60%", newEndDate: "07/03/2030" },
      { ftePercent: "50%", newEndDate: "08/04/2031" },
      { ftePercent: "25%", newEndDate: "19/10/2037" }
    ]);
  });
  it("should correctly calculate new LTFT end dates when the bespoke input ftePercent is a % string.", () => {
    const currentFtePercent = 100;
    const ftePercents: FtePercentsTypes[] = [{ value: "95%", label: "95%" }];
    const propStartDate = "2024-07-25";
    const propEndDate = "2027-01-01";
    const currentProgEndDate = "2028-01-01";

    const result = calculateNewEndDates(
      currentFtePercent,
      ftePercents,
      propStartDate,
      propEndDate,
      currentProgEndDate
    );

    expect(result).toEqual([{ ftePercent: "95%", newEndDate: "17/02/2028" }]);
  });
});

describe("calcDefaultPropStartDate", () => {
  const sixteenWeeksFromNow = dayjs().add(16, "weeks");
  it("should return the currentProgStartDate if the program start date is at least 16 weeks from now.", () => {
    const currentProgStartDate = sixteenWeeksFromNow.format("YYYY-MM-DD");
    const currentProgEndDate = dayjs().add(2, "years").format("YYYY-MM-DD");
    expect(
      calcDefaultPropStartDate(currentProgStartDate, currentProgEndDate)
    ).toBe(sixteenWeeksFromNow.format("YYYY-MM-DD"));
    expect(
      calcDefaultPropStartDate(
        sixteenWeeksFromNow.add(1, "day").format("YYYY-MM-DD"),
        currentProgEndDate
      )
    ).toBe(sixteenWeeksFromNow.add(1, "day").format("YYYY-MM-DD"));
  });
  it("should return an empty string if the program end date is before 16 weeks from now.", () => {
    const currentProgStartDate = dayjs().format("YYYY-MM-DD");
    const currentProgEndDate = sixteenWeeksFromNow
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    expect(
      calcDefaultPropStartDate(currentProgStartDate, currentProgEndDate)
    ).toBe("");
  });
  it("should the default sixteenWeeksFromNow if the program start date is less than 16 weeks from now and the program end date is at least 16 weeks away from now.", () => {
    const currentProgStartDate = sixteenWeeksFromNow
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const currentProgEndDate = sixteenWeeksFromNow
      .add(1, "day")
      .format("YYYY-MM-DD");
    expect(
      calcDefaultPropStartDate(currentProgStartDate, currentProgEndDate)
    ).toBe(sixteenWeeksFromNow.format("YYYY-MM-DD"));
  });
});
