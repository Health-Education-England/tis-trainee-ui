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
        View the Onboarding journey
      </Link>
    </p>
  );
}
