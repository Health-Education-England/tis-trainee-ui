import { ActionLink, WarningCallout } from "nhsuk-react-components";
import {
  ltftRotationWindowLinkText,
  ltftRotationWindowNoticeText
} from "../../../utilities/Constants";

type LtftRotationWindowNoticeProps = {
  rotationWindowUrl: string;
};

export function LtftRotationWindowNotice({
  rotationWindowUrl
}: Readonly<LtftRotationWindowNoticeProps>) {
  return (
    <WarningCallout data-cy="rotationWindowWarning">
      <WarningCallout.Heading
        visuallyHiddenText=""
        data-cy="rotationWindowLabel"
      >
        Important
      </WarningCallout.Heading>
      <p data-cy="rotationWindowText">{ltftRotationWindowNoticeText}</p>
      <ActionLink
        data-cy="rotationWindowLink"
        href={rotationWindowUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${ltftRotationWindowLinkText} (opens in a new tab)`}
      </ActionLink>
    </WarningCallout>
  );
}
