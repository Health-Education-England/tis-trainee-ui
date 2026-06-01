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
  startDate: beyond16w,
  altStartDate: null,
  skilledWorkerVisaHolder: false,
  supportingInformation: "info"
};

describe("ltftValidationSchema - altStartDate (optional)", () => {
  beforeAll(() => {
    store.dispatch(updatedTraineeProfileData(mockTraineeProfile));
  });

  it("accepts a form with no altStartDate when startDate is more than 16 weeks away", async () => {
    await expect(
      ltftValidationSchema.validate({ ...baseValid, startDate: beyond16w })
    ).resolves.toBeTruthy();
  });

  it("accepts a late startDate with no altStartDate provided", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        startDate: within16w,
        altStartDate: null
      })
    ).resolves.toBeTruthy();
  });

  it("treats an empty string as cleared (no typeError)", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        startDate: within16w,
        altStartDate: ""
      })
    ).resolves.toBeTruthy();
  });

  it("rejects an altStartDate that is itself within 16 weeks", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        startDate: within16w,
        altStartDate: dayjs().add(8, "week").format("YYYY-MM-DD")
      })
    ).rejects.toThrow(/at least 16 weeks from today/);
  });

  it("accepts an altStartDate that is at least 16 weeks away", async () => {
    await expect(
      ltftValidationSchema.validate({
        ...baseValid,
        startDate: within16w,
        altStartDate: dayjs().add(20, "week").format("YYYY-MM-DD")
      })
    ).resolves.toBeTruthy();
  });
});
