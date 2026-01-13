import dayjs from "dayjs";
import { ReasonMsgObj } from "../components/common/ActionModal";
import { LtftDto, LtftObjNew } from "../models/LtftTypes";
import { PersonalDetails } from "../models/PersonalDetails";
import { ProgrammeMembership } from "../models/ProgrammeMembership";
import { unsubmitLtftForm, withdrawLtftForm } from "../redux/slices/ltftSlice";
import store from "../redux/store/store";
import { ACTION_REASONS } from "./Constants";
import { isFormDeleted } from "./FormBuilderUtilities";
import { ActionState } from "./hooks/useActionState";

export function populateLtftDraftNew(
  personalDetails: PersonalDetails,
  traineeTisId: string
): LtftObjNew {
  const draftLtftForm: LtftObjNew = {
    traineeTisId: traineeTisId,
    pmId: "",
    pmName: "",
    pmStartDate: "",
    pmEndDate: "",
    designatedBodyCode: "",
    managingDeanery: "",
    cctDate: "",
    type: "LTFT",
    startDate: "",
    wteBeforeChange: null,
    wte: null,
    declarations: {
      discussedWithTpd: true,
      informationIsCorrect: null,
      notGuaranteed: null
    },
    tpdName: "",
    tpdEmail: "",
    otherDiscussions: null,
    personalDetails: {
      title: personalDetails?.title,
      surname: personalDetails?.surname,
      forenames: personalDetails?.forenames,
      telephoneNumber: personalDetails?.telephoneNumber,
      mobileNumber: personalDetails?.mobileNumber,
      email: personalDetails?.email,
      gmcNumber: personalDetails?.gmcNumber,
      gdcNumber: personalDetails?.gdcNumber,
      publicHealthNumber: personalDetails?.publicHealthNumber
    },
    skilledWorkerVisaHolder: null,
    reasonsSelected: null,
    reasonsOtherDetail: null,
    supportingInformation: null,
    status: {
      current: {
        state: "DRAFT",
        detail: {
          reason: "",
          message: ""
        },
        modifiedBy: {
          name: "",
          email: "",
          role: ""
        },
        timestamp: "",
        revision: 0
      },
      history: []
    }
  };
  return draftLtftForm;
}

export const mapLtftObjToDto = (ltftObj: LtftObjNew): LtftDto => {
  return {
    traineeTisId: ltftObj.traineeTisId ?? "",
    id: ltftObj.id ?? null,
    formRef: ltftObj.formRef ?? null,
    name: ltftObj.name ?? null,
    change: {
      calculationId: "",
      cctDate: ltftObj.cctDate ?? null,
      type: "LTFT",
      startDate: ltftObj.startDate,
      wte: ltftObj.wte ? ltftObj.wte / 100 : 0,
      changeId: ""
    },
    declarations: {
      discussedWithTpd: ltftObj.declarations.discussedWithTpd ?? true,
      informationIsCorrect: ltftObj.declarations.informationIsCorrect ?? null,
      notGuaranteed: ltftObj.declarations.notGuaranteed ?? null
    },
    discussions: {
      tpdName: ltftObj.tpdName,
      tpdEmail: ltftObj.tpdEmail,
      other:
        ltftObj.otherDiscussions?.map(discussion => ({
          name: discussion.name,
          email: discussion.email,
          role: discussion.role
        })) || []
    },
    personalDetails: {
      title: ltftObj.personalDetails.title ?? null,
      surname: ltftObj.personalDetails.surname ?? "",
      forenames: ltftObj.personalDetails.forenames ?? "",
      telephoneNumber: ltftObj.personalDetails.telephoneNumber ?? "",
      mobileNumber: ltftObj.personalDetails.mobileNumber ?? "",
      email: ltftObj.personalDetails.email ?? "",
      gmcNumber: ltftObj.personalDetails.gmcNumber ?? "",
      gdcNumber: ltftObj.personalDetails.gdcNumber ?? "",
      publicHealthNumber: ltftObj.personalDetails.publicHealthNumber ?? "",
      skilledWorkerVisaHolder: ltftObj.skilledWorkerVisaHolder ?? null
    },
    programmeMembership: {
      id: ltftObj.pmId ?? null,
      name: ltftObj.pmName ?? null,
      startDate: ltftObj.pmStartDate ?? null,
      endDate: ltftObj.pmEndDate ?? null,
      wte: ltftObj.wteBeforeChange ? ltftObj.wteBeforeChange / 100 : 0,
      designatedBodyCode: ltftObj.designatedBodyCode ?? null,
      managingDeanery: ltftObj.managingDeanery ?? null
    },
    reasons: {
      selected: ltftObj.reasonsSelected || [],
      otherDetail: ltftObj.reasonsOtherDetail ?? "",
      supportingInformation: ltftObj.supportingInformation ?? null
    },
    status: {
      current: {
        state: ltftObj.status.current.state,
        detail: {
          reason: ltftObj.status.current.detail.reason,
          message: ltftObj.status.current.detail.message
        },
        modifiedBy: {
          name: ltftObj.status.current.modifiedBy.name,
          email: ltftObj.status.current.modifiedBy.email,
          role: ltftObj.status.current.modifiedBy.role
        },
        timestamp: ltftObj.status.current.timestamp,
        revision: ltftObj.status.current.revision
      },
      history:
        ltftObj.status.history?.map(historyItem => ({
          state: historyItem.state,
          timestamp: historyItem.timestamp,
          detail: {
            reason: historyItem.detail.reason,
            message: historyItem.detail.message
          },
          modifiedBy: {
            name: historyItem.modifiedBy.name,
            email: historyItem.modifiedBy.email,
            role: historyItem.modifiedBy.role
          },
          revision: historyItem.revision
        })) || []
    },
    created: ltftObj.created ?? "",
    lastModified: ltftObj.lastModified ?? ""
  };
};

export const mapLtftDtoToObj = (ltftDto: LtftDto): LtftObjNew => {
  return {
    traineeTisId: ltftDto.traineeTisId,
    id: ltftDto.id ?? "",
    formRef: ltftDto.formRef ?? "",
    name: ltftDto.name ?? "",
    pmId: ltftDto.programmeMembership.id ?? "",
    pmName: ltftDto.programmeMembership.name ?? "",
    pmStartDate: ltftDto.programmeMembership.startDate ?? "",
    pmEndDate: ltftDto.programmeMembership.endDate ?? "",
    designatedBodyCode: ltftDto.programmeMembership.designatedBodyCode ?? "",
    managingDeanery: ltftDto.programmeMembership.managingDeanery ?? "",
    cctDate: ltftDto.change.cctDate ?? "",
    type: ltftDto.change.type,
    startDate: ltftDto.change.startDate,
    wteBeforeChange: ltftDto.programmeMembership.wte
      ? Math.round(ltftDto.programmeMembership.wte * 100)
      : null,
    wte: ltftDto.change.wte ? Math.round(ltftDto.change.wte * 100) : null,
    declarations: {
      discussedWithTpd: ltftDto.declarations.discussedWithTpd,
      informationIsCorrect: ltftDto.declarations.informationIsCorrect,
      notGuaranteed: ltftDto.declarations.notGuaranteed
    },
    tpdName: ltftDto.discussions.tpdName,
    tpdEmail: ltftDto.discussions.tpdEmail,
    otherDiscussions: ltftDto.discussions.other.map(discussion => ({
      name: discussion.name,
      email: discussion.email,
      role: discussion.role
    })),
    personalDetails: {
      title: ltftDto.personalDetails.title,
      surname: ltftDto.personalDetails.surname,
      forenames: ltftDto.personalDetails.forenames,
      telephoneNumber: ltftDto.personalDetails.telephoneNumber,
      mobileNumber: ltftDto.personalDetails.mobileNumber,
      email: ltftDto.personalDetails.email,
      gmcNumber: ltftDto.personalDetails.gmcNumber,
      gdcNumber: ltftDto.personalDetails.gdcNumber,
      publicHealthNumber: ltftDto.personalDetails.publicHealthNumber
    },
    skilledWorkerVisaHolder: ltftDto.personalDetails.skilledWorkerVisaHolder,
    reasonsSelected: ltftDto.reasons.selected,
    reasonsOtherDetail: ltftDto.reasons.otherDetail ?? null,
    supportingInformation: ltftDto.reasons.supportingInformation ?? null,
    status: {
      current: {
        state: ltftDto.status.current.state,
        detail: {
          reason: ltftDto.status.current.detail.reason,
          message: ltftDto.status.current.detail.message
        },
        modifiedBy: {
          name: ltftDto.status.current.modifiedBy.name,
          email: ltftDto.status.current.modifiedBy.email,
          role: ltftDto.status.current.modifiedBy.role
        },
        timestamp: ltftDto.status.current.timestamp,
        revision: ltftDto.status.current.revision
      },
      history: ltftDto.status.history.map(historyItem => ({
        state: historyItem.state,
        timestamp: historyItem.timestamp,
        detail: {
          reason: historyItem.detail.reason,
          message: historyItem.detail.message
        },
        modifiedBy: {
          name: historyItem.modifiedBy.name,
          email: historyItem.modifiedBy.email,
          role: historyItem.modifiedBy.role
        },
        revision: historyItem.revision
      }))
    },
    created: ltftDto.created,
    lastModified: ltftDto.lastModified
  };
};

export async function handleLtftSummaryModalSub(
  currentAction: ActionState,
  reasonObj?: ReasonMsgObj
) {
  if (currentAction.type === "Delete") {
    return await isFormDeleted("ltft", currentAction.id);
  }
  if (currentAction.type === "Unsubmit") {
    return await store.dispatch(
      unsubmitLtftForm({
        id: currentAction.id,
        reasonObj: reasonObj as ReasonMsgObj
      })
    );
  }
  if (currentAction.type === "Withdraw") {
    return await store.dispatch(
      withdrawLtftForm({
        id: currentAction.id,
        reasonObj: reasonObj as ReasonMsgObj
      })
    );
  }
  return false;
}

export function getStatusReasonLabel(
  status: string,
  statusReason: string
): string {
  if (status === "UNSUBMITTED" && statusReason) {
    return (
      ACTION_REASONS.UNSUBMIT.find(reason => reason.value === statusReason)
        ?.label ?? statusReason
    );
  }

  if (status === "WITHDRAWN" && statusReason) {
    return (
      ACTION_REASONS.WITHDRAW.find(reason => reason.value === statusReason)
        ?.label ?? statusReason
    );
  }

  return statusReason || "";
}

export function makeValidProgrammeOptions(
  pmsNotPast: ProgrammeMembership[],
  progIdsFromFeatFlags: string[]
): { value: string; label: string }[] {
  if (progIdsFromFeatFlags.length === 0 || pmsNotPast.length === 0) {
    return [];
  }

  const programmeOptions = pmsNotPast.reduce((progOptions, prog) => {
    if (prog.tisId && progIdsFromFeatFlags.includes(prog.tisId)) {
      progOptions.push({
        value: prog.tisId,
        label: `${prog.programmeName} (${dayjs(prog.startDate).format(
          "DD/MM/YYYY"
        )} to ${dayjs(prog.endDate).format("DD/MM/YYYY")})`
      });
    }
    return progOptions;
  }, [] as { value: string; label: string }[]);

  return programmeOptions;
}
