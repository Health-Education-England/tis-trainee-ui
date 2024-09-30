import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { Tooltip } from "react-tooltip";
import { string } from "yup";

type InfoTooltipProps = {
  tooltipId: string;
  content: string;
};

export default function InfoTooltip({ tooltipId, content }: InfoTooltipProps) {
  return (
    <>
      <FontAwesomeIcon
        icon={faInfoCircle}
        color="#005EB8"
        data-tooltip-id={tooltipId}
      />
      <Tooltip
        id="cojInfo"
        className="tooltipContent"
        place="right-start"
        content={content}
      />
    </>
  );
}
