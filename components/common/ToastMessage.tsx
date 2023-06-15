import React from "react";
import { toast } from "react-toastify";
import { useAppSelector } from "../../redux/hooks/hooks";
import { selectTraineeProfile } from "../../redux/slices/traineeProfileSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle
} from "@fortawesome/free-solid-svg-icons";
import { getUserAgentInfo } from "../../utilities/UserUtilities";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error"
}

type ToastMessageProps = {
  msg: string;
  type: ToastType;
  actionErrorMsg?: string;
};

export const ToastMessage = ({
  msg,
  type,
  actionErrorMsg
}: ToastMessageProps) => {
  const { personalDetails, traineeTisId } =
    useAppSelector(selectTraineeProfile);
  const gmcNo = personalDetails?.gmcNumber ?? "Not available";
  const userIds = gmcNo
    ? `GMC no. ${gmcNo}, TIS ID ${traineeTisId}`
    : `TIS ID ${traineeTisId}`;

  const getPageURL = (): string => {
    return window.location.href;
  };

  return (
    <>
      <p className="toast-text" data-cy="toastText">
        {msg}
      </p>
      {type === "error" && (
        <a
          className="toast-anchor"
          data-cy="techSupportLink"
          href={`mailto:tis.support@hee.nhs.uk?subject=TSS tech support query (${userIds})&body=Browser and OS info:%0A${getUserAgentInfo()}%0A%0APage URL:%0A${getPageURL()}%0A%0AError message:%0A${actionErrorMsg}%0A%0A%0A%0A`}
        >
          Click here to email Support
        </a>
      )}
    </>
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
        icon: <FontAwesomeIconWrapper messageType={messageType} />,
        autoClose: 6000
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
        icon: <FontAwesomeIconWrapper messageType={messageType} />,
        autoClose: 12000
      }
    );
  }
};

type FontAwesomeIconWrapperProps = {
  messageType: ToastType;
};

export function FontAwesomeIconWrapper({
  messageType
}: FontAwesomeIconWrapperProps) {
  return (
    <FontAwesomeIcon
      data-cy={
        messageType === ToastType.ERROR ? "faIconError" : "faIconSuccess"
      }
      className={`fa-icon ${messageType}`}
      icon={
        messageType === ToastType.ERROR ? faExclamationCircle : faCheckCircle
      }
      size="xl"
    />
  );
}
