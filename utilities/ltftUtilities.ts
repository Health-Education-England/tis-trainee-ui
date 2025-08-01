import { ReasonMsgObj } from "../components/common/ActionModal";
import { PersonalDetails } from "../models/PersonalDetails";
import { CctCalculation, CctChangeType } from "../redux/slices/cctSlice";
import {
  LtftCctChange,
  LtftObj,
  StatusInfo,
  unsubmitLtftForm,
  updatedLtft,
  withdrawLtftForm
} from "../redux/slices/ltftSlice";
import store from "../redux/store/store";
import { calcLtftChange } from "./CctUtilities";
import { ACTION_REASONS } from "./Constants";
import { isFormDeleted } from "./FormBuilderUtilities";
import { ActionState } from "./hooks/useActionState";
import { ProfileSType } from "./ProfileUtilities";

export function populateLtftDraft(
  cctSnapshot: CctCalculation,
  personalDetails: PersonalDetails,
  traineeTisId: string
): LtftObj {
  const draftLtftForm: LtftObj = {
    traineeTisId: traineeTisId,
    change: {
      calculationId: cctSnapshot?.id ?? "",
      cctDate: cctSnapshot?.cctDate ?? "",
      type: "LTFT",
      startDate: cctSnapshot?.changes[0].startDate ?? "",
      wte: cctSnapshot?.changes[0].wte ?? 0,
      changeId: cctSnapshot?.changes[0].id ?? ""
    },
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
      publicHealthNumber: personalDetails?.publicHealthNumber,
      skilledWorkerVisaHolder: null
    },
    programmeMembership: {
      id: cctSnapshot?.programmeMembership.id ?? "",
      name: cctSnapshot?.programmeMembership.name ?? "",
      startDate: cctSnapshot?.programmeMembership.startDate ?? "",
      endDate: cctSnapshot?.programmeMembership.endDate ?? "",
      wte: cctSnapshot?.programmeMembership.wte ?? 0,
      designatedBodyCode:
        cctSnapshot?.programmeMembership.designatedBodyCode ?? "",
      managingDeanery: cctSnapshot?.programmeMembership.managingDeanery ?? ""
    },
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

export type LtftDto = {
  traineeTisId: string;
  id: string | null;
  formRef: string | null;
  name: string | null;
  change: LtftCctChange;
  declarations: {
    discussedWithTpd: boolean | null;
    informationIsCorrect: boolean | null;
    notGuaranteed: boolean | null;
  };
  discussions: {
    tpdName: string;
    tpdEmail: string;
    other: {
      name: string;
      email: string;
      role: string;
    }[];
  };
  personalDetails: {
    title?: ProfileSType;
    forenames: ProfileSType;
    surname: ProfileSType;
    telephoneNumber?: string | null;
    mobileNumber?: string | null;
    email: ProfileSType;
    gmcNumber?: string | null;
    gdcNumber?: string | null;
    publicHealthNumber?: string | null;
    skilledWorkerVisaHolder: boolean | null;
  };
  programmeMembership: {
    id: string;
    name: string;
    startDate: Date | string;
    endDate?: Date | string;
    wte: number;
    designatedBodyCode?: string;
    managingDeanery?: string;
  };
  reasons: {
    selected: string[];
    otherDetail?: string;
    supportingInformation: string | null;
  };
  status: {
    current: StatusInfo;
    history: StatusInfo[];
  };
  created: Date | string;
  lastModified: Date | string;
};

export const mapLtftObjToDto = (ltftObj: LtftObj): LtftDto => {
  return {
    traineeTisId: ltftObj.traineeTisId ?? "",
    id: ltftObj.id ?? null,
    formRef: ltftObj.formRef ?? null,
    name: ltftObj.name ?? null,
    change: {
      calculationId: ltftObj.change.calculationId,
      cctDate: ltftObj.change.cctDate,
      type: ltftObj.change.type,
      startDate: ltftObj.change.startDate,
      wte: ltftObj.change.wte,
      changeId: ltftObj.change.changeId
    },
    declarations: {
      discussedWithTpd: ltftObj.declarations.discussedWithTpd ?? true,
      informationIsCorrect: ltftObj.declarations.informationIsCorrect ?? false,
      notGuaranteed: ltftObj.declarations.notGuaranteed ?? false
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
      skilledWorkerVisaHolder:
        ltftObj.personalDetails.skilledWorkerVisaHolder ?? null
    },
    programmeMembership: {
      id: ltftObj.programmeMembership.id,
      name: ltftObj.programmeMembership.name,
      startDate: ltftObj.programmeMembership.startDate,
      endDate: ltftObj.programmeMembership.endDate,
      wte: ltftObj.programmeMembership.wte,
      designatedBodyCode:
        ltftObj.programmeMembership.designatedBodyCode ?? null,
      managingDeanery: ltftObj.programmeMembership.managingDeanery ?? null
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

export const mapLtftDtoToObj = (ltftDto: LtftDto): LtftObj => {
  return {
    traineeTisId: ltftDto.traineeTisId,
    id: ltftDto.id ?? "",
    formRef: ltftDto.formRef ?? "",
    name: ltftDto.name ?? "",
    change: {
      calculationId: ltftDto.change.calculationId,
      cctDate: ltftDto.change.cctDate,
      type: ltftDto.change.type,
      startDate: ltftDto.change.startDate,
      wte: ltftDto.change.wte,
      changeId: ltftDto.change.changeId
    },
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
      publicHealthNumber: ltftDto.personalDetails.publicHealthNumber,
      skilledWorkerVisaHolder: ltftDto.personalDetails.skilledWorkerVisaHolder
    },
    programmeMembership: {
      id: ltftDto.programmeMembership.id,
      name: ltftDto.programmeMembership.name,
      startDate: ltftDto.programmeMembership.startDate,
      endDate: ltftDto.programmeMembership.endDate ?? "",
      wte: ltftDto.programmeMembership.wte,
      designatedBodyCode: ltftDto.programmeMembership.designatedBodyCode ?? "",
      managingDeanery: ltftDto.programmeMembership.managingDeanery ?? ""
    },
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

export const recalculateCctDate = (
  endDate: Date | string,
  currentWte: number,
  changeDateValue: string,
  wteValue: string
): void => {
  const updatedCompletionDate = calcLtftChange(endDate, currentWte, {
    type: "LTFT",
    startDate: changeDateValue,
    wte: Number(wteValue) / 100
  } as CctChangeType);

  const currentLtftData = store.getState().ltft.formData;
  const updatedLtftData = {
    ...currentLtftData,
    change: {
      ...currentLtftData.change,
      startDate: changeDateValue,
      wte: Number(wteValue) / 100,
      cctDate: updatedCompletionDate
    }
  };

  store.dispatch(updatedLtft(updatedLtftData));
};

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

export function isValidProgramme(progId: string): boolean {
  if (!progId) return false;
  const progIdsToCheckAgainst = store.getState().user.features.ltftProgrammes;
  if (progIdsToCheckAgainst.length < 1) {
    return false;
  }
  return progIdsToCheckAgainst.some(id => id === progId);
}
