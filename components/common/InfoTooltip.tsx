import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { Tooltip } from "react-tooltip";

type InfoTooltipProps = {
  tooltipId: string;
  content: string;
  size?: SizeProp;
};

export default function InfoTooltip({
  tooltipId,
  content,
  size
}: Readonly<InfoTooltipProps>) {
  return (
    <>
      <FontAwesomeIcon
        className="information-icon"
        icon={faInfoCircle}
        color="#005EB8"
        data-tooltip-id={tooltipId}
        size={(size ?? "lg") as SizeProp}
        data-cy={`${tooltipId}-icon`}
      />
      <Tooltip
        id={tooltipId}
        className="tooltipContent"
        place="top"
        content={content}
      />
    </>
  );
}
