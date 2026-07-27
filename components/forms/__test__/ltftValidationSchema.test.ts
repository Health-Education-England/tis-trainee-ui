import dayjs from "dayjs";
import { ltftValidationSchema } from "../ltft/ltftValidationSchema";
import store from "../../../redux/store/store";
import { updatedTraineeProfileData } from "../../../redux/slices/traineeProfileSlice";
import { mockTraineeProfile } from "../../../mock-data/trainee-profile";

const within16w = dayjs().add(10, "week").format("YYYY-MM-DD");
const beyond16w = dayjs().add(20, "week").format("YYYY-MM-DD");

const baseValid = {
  pmId: "7ab1aae3-83c2-4bb6-b1f3-99146e79b362",
  wteBeforeChange: 100,
  wte: 80,
  tpdName: "TPD",
  tpdEmail: "tpd@example.com",
  otherDiscussions: null,
  reasonsSelected: ["Caring responsibilities"],
  personalDetails: {
    forenames: "Jo",
    surname: "Surname",
    gmcNumber: "1234567",
    telephoneNumber: "01234567890",
    mobileNumber: "01234567890",
    email: "jo@example.com"
  },
  canGiveCompliantStartDate: false,
  startDate: beyond16w,
  altStartDate: null,
  exceptionalReasons: "A valid exceptional reason",
  exceptionalReasonsDate: within16w,
  skilledWorkerVisaHolder: false,
  supportingInformation: "info"
};

describe("ltftValidationSchema - exceptionalReasonsDate (mandatory when exceptional)", () => {
  beforeAll(() => {
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
  });

  it("rejects a missing exceptionalReasonsDate", async () => {
    const { exceptionalReasonsDate, ...withoutDate } = baseValid;
    await expect(ltftValidationSchema.validate(withoutDate)).rejects.toThrow(
      /provide the date you would like this change to begin/
    );
  });

  it("rejects an exceptionalReasonsDate in the past", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        exceptionalReasonsDate: dayjs().subtract(1, "day").format("YYYY-MM-DD")
      })
    ).rejects.toThrow(/cannot be before today/);
  });

  it("rejects an exceptionalReasonsDate 16 or more weeks in the future", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        exceptionalReasonsDate: beyond16w
      })
    ).rejects.toThrow(/less than 16 weeks from today/);
  });

  it("accepts an exceptionalReasonsDate today", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        exceptionalReasonsDate: dayjs().format("YYYY-MM-DD")
      })
    ).resolves.toBeTruthy();
  });

  it("accepts an exceptionalReasonsDate within 16 weeks", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        exceptionalReasonsDate: within16w
      })
    ).resolves.toBeTruthy();
  });
});
