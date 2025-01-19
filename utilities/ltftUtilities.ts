import { LtftObj } from "../redux/slices/ltftSlice";
import store from "../redux/store/store";

export function populateLtftDraft() {
  const LtftCctSnapshot = store.getState().ltft.LtftCctSnapshot;
  const personalDetails =
    store.getState().traineeProfile.traineeProfileData.personalDetails;
  const draftLtftForm: LtftObj = {
    change: {
      calculationId: LtftCctSnapshot?.id ?? "",
      cctDate: LtftCctSnapshot?.cctDate ?? "",
      type: "LTFT",
      startDate: LtftCctSnapshot?.changes[0].startDate ?? "",
      wte: LtftCctSnapshot?.changes[0].wte ?? 0
    },
    declarations: {
      discussedWithTpd: true,
      informationIsCorrect: null,
      notGuaranteed: null
    },
    discussions: [{ name: "", email: "", role: "tpd" }],
    personalDetails: {
      title: personalDetails?.title,
      surname: personalDetails?.surname,
      forename: personalDetails?.forenames,
      telephoneNumber: personalDetails?.telephoneNumber,
      mobileNumber: personalDetails?.mobileNumber,
      email: personalDetails?.email,
      gmcNumber: personalDetails?.gmcNumber,
      skilledWorkerVisaHolder: null
    },
    programmeMembership: {
      id: LtftCctSnapshot?.programmeMembership.id ?? "",
      name: LtftCctSnapshot?.programmeMembership.name ?? "",
      startDate: LtftCctSnapshot?.programmeMembership.startDate ?? "",
      endDate: LtftCctSnapshot?.programmeMembership.endDate ?? "",
      wte: LtftCctSnapshot?.programmeMembership.wte ?? 0
    },
    reasons: null,
    status: {
      current: "DRAFT",
      history: null
    }
  };
  return draftLtftForm;
}
