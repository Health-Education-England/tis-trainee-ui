import React from "react";
import { Zoom, toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { ActionLink } from "nhsuk-react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning"
}

type ToastMessageProps = {
  msg: string;
  type: ToastType;
  actionErrorMsg?: string;
};

const ToastMessage = ({ msg, type, actionErrorMsg }: ToastMessageProps) => {
  const traineeProfileData = useAppSelector(selectTraineeProfile);
  const gmcNo = traineeProfileData.personalDetails?.gmcNumber;
  const tisId = traineeProfileData.traineeTisId;
  const emailIds = gmcNo
    ? `GMC no. ${gmcNo}, TIS ID ${tisId}, Error: ${actionErrorMsg}`
    : `TIS ID ${tisId}, Error: ${actionErrorMsg}`;

  return (
    <div>
      <p style={{ marginLeft: 40 }}>
        <b>{msg}</b>
      </p>
      {type === "error" && (
        <ActionLink
          data-cy="techSupportLink"
          href={`mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (${emailIds})`}
        >
          Click here to email TIS Support
        </ActionLink>
      )}
    </div>
  );
};

export const showToast = (
  message: string,
  messageType: ToastType,
  actionErrorMsg?: string
) => {
  if (messageType === ToastType.SUCCESS) {
    toast.success(
      <ToastMessage
        data-cy="toastMsgSuccess"
        msg={message}
        type={messageType}
      />,
      {
        icon: (
          <FontAwesomeIcon
            data-cy="faIconSuccess"
            className="fa-icon Success"
            icon={faCheckCircle}
            size="lg"
          />
        )
      }
    );
  } else if (messageType === ToastType.ERROR) {
    toast.error(
      <ToastMessage
        data-cy="toastMsgError"
        msg={message}
        type={messageType}
        actionErrorMsg={actionErrorMsg}
      />,
      {
        icon: (
          <FontAwesomeIcon
            data-cy="faIconError"
            className="fa-icon Error"
            icon={faExclamationCircle}
            size="lg"
          />
        )
      }
    );
  }
};
