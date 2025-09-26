import { Link } from "react-router-dom";

type OnboardingTrackerLinkProps = {
  progPanelId: string;
};

export function OnboardingTrackerLink({
  progPanelId
}: Readonly<OnboardingTrackerLinkProps>) {
  return (
    <p>
      <Link to={`/programmes/${progPanelId}/onboarding-tracker`}>
        Track your onboarding journey for this programme
      </Link>
    </p>
  );
}
