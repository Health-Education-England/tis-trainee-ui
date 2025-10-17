import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "react-tooltip";

type InfoTooltipProps = {
  tooltipId: string;
  content: string;
};

export default function InfoTooltip({
  tooltipId,
  content
}: Readonly<InfoTooltipProps>) {
  return (
    <>
      <FontAwesomeIcon
        className="information-icon"
        icon={faInfoCircle}
        color="#005EB8"
        data-tooltip-id={tooltipId}
        size="lg"
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
