import { PersonalDetails } from "../models/PersonalDetails";
import { CctCalculation } from "../redux/slices/cctSlice";
import {
  LtftCctChange,
  LtftFormStatus,
  LtftObj,
  StatusInfo
} from "../redux/slices/ltftSlice";
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
        cctSnapshot?.programmeMembership.designatedBodyCode ?? ""
    },
    reasonsSelected: null,
    reasonsOtherDetail: null,
    status: {
      current: "DRAFT",
      history: null
    }
  };
  return draftLtftForm;
}

export type LtftDto = {
  traineeTisId: string;
  id: string | null;
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
  };
  reasons: {
    selected: string[];
    otherDetail?: string;
  };
  status: {
    current: StatusInfo;
    history: StatusInfo[] | [];
  };
  created: Date | string;
  lastModified: Date | string;
};

export const mapLtftObjToDto = (ltftObj: LtftObj): LtftDto => {
  return {
    traineeTisId: ltftObj.traineeTisId ?? "",
    id: ltftObj.id ?? null,
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
        ltftObj.personalDetails.skilledWorkerVisaHolder ?? false
    },
    programmeMembership: {
      id: ltftObj.programmeMembership.id,
      name: ltftObj.programmeMembership.name,
      startDate: ltftObj.programmeMembership.startDate,
      endDate: ltftObj.programmeMembership.endDate,
      wte: ltftObj.programmeMembership.wte,
      designatedBodyCode: ltftObj.programmeMembership.designatedBodyCode ?? null
    },
    reasons: {
      selected: ltftObj.reasonsSelected || [],
      otherDetail: ltftObj.reasonsOtherDetail ?? ""
    },
    status: {
      // TODO: complate status fields with the correct data when implementing state chagning operations
      current: {
        state: ltftObj.status.current,
        detail: "",
        modifiedBy: {
          name: "",
          email: "",
          role: ""
        },
        timestamp: "",
        revision: 1
      },
      history:
        ltftObj.status.history?.map(historyItem => ({
          state: historyItem.status,
          timestamp: historyItem.timestamp,
          detail: "",
          modifiedBy: {
            name: "",
            email: "",
            role: ""
          },
          revision: 1
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
      designatedBodyCode: ltftDto.programmeMembership.designatedBodyCode ?? ""
    },
    reasonsSelected: ltftDto.reasons.selected,
    reasonsOtherDetail: ltftDto.reasons.otherDetail ?? null,
    status: {
      current: ltftDto.status.current.state,
      history: ltftDto.status.history.map(historyItem => ({
        status: historyItem.state,
        timestamp: historyItem.timestamp
      }))
    },
    created: ltftDto.created,
    lastModified: ltftDto.lastModified
  };
};
