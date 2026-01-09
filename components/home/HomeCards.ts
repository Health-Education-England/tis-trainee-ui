import { UserFeaturesType } from "../../models/FeatureFlags";
import { HomeCardProps } from "../../models/HomeCard";

export const HOME_CARDS: HomeCardProps[] = [
  {
    linkHeader: "Action Summary",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.actions.enabled,
    isClickable: true,
    route: "/action-summary",
    items: [
      {
        text: "Outstanding tasks to complete",
        isFeatureEnabled: true
      },
      {
        text: "Status of FormR submissions",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          userFeatures.forms.formr.enabled
      }
    ]
  },
  {
    linkHeader: "Programmes",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.details.programmes.enabled,
    isClickable: true,
    route: "/programmes",
    items: [
      {
        text: "Training Number (NTN/DRN)",
        isFeatureEnabled: true
      },
      {
        text: "Conditions of Joining (CoJ) Agreement(s)",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          userFeatures.details.programmes.conditionsOfJoining.enabled
      },
      {
        text: "CCT Calculator",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          userFeatures.cct.enabled
      },
      {
        text: "Programmes (past, current and future)",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "Placements",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.details.placements.enabled,
    isClickable: true,
    route: "/placements",
    items: [
      {
        text: "Placements (past, current and future)",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "CCT (Certificate of Completion of Training)",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.cct.enabled,
    isClickable: true,
    route: "/cct",
    items: [
      {
        text: "Make a CCT Calculation",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "Form R (Part A)",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.forms.formr.enabled,
    isClickable: true,
    route: "/formr-a",
    items: [
      {
        text: "Submit a new form",
        isFeatureEnabled: true
      },
      {
        text: "View and save a PDF copy of a submitted form",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "Form R (Part B)",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.forms.formr.enabled,
    isClickable: true,
    route: "/formr-b",
    items: [
      {
        text: "Submit a new form",
        isFeatureEnabled: true
      },
      {
        text: "View and save a PDF copy of a submitted form",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "Profile",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.details.profile.enabled,
    isClickable: true,
    route: "/profile",
    items: [
      {
        text: "Personal information",
        isFeatureEnabled: true
      },
      {
        text: "Registration details",
        isFeatureEnabled: true
      },
      {
        text: "Update GMC number",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          userFeatures.details.profile.gmcUpdate.enabled
      }
    ]
  },
  {
    linkHeader: "Support",
    isFeatureEnabled: true,
    isClickable: true,
    route: "/support",
    items: [
      {
        text: "Email your Local Office with Personal details queries",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          !userFeatures.forms.formr.enabled
      },
      {
        text: "Email your Local Office with Form R and Personal details queries",
        isFeatureEnabled: (userFeatures: UserFeaturesType) =>
          userFeatures.forms.formr.enabled
      },
      {
        text: "Email TIS Support with any technical issues (e.g. error messages)",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "MFA",
    isFeatureEnabled: true,
    isClickable: true,
    route: "/mfa",
    items: [
      {
        text: "Set up or update your MFA (Multi-Factor Authentication) sign-in method",
        isFeatureEnabled: true
      }
    ]
  },
  {
    linkHeader: "Less Than Full Time (LTFT)",
    isFeatureEnabled: (userFeatures: UserFeaturesType) =>
      userFeatures.forms.ltft.enabled,
    isClickable: true,
    route: "/ltft",
    items: [
      {
        text: "Submit and track a Less Than Full Time (LTFT) application",
        isFeatureEnabled: true
      }
    ]
  }
];
