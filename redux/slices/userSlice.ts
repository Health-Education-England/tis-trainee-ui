import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchMFAPreference, fetchAuthSession } from "aws-amplify/auth";
import { UserFeaturesType } from "../../models/FeatureFlags";

export type CojVersionType = "GG9" | "GG10";

export type MFAType = "TOTP" | "SMS" | "EMAIL" | "NOMFA";

export type MfaAttribType = "email" | "phone_number";

export interface IUser {
  status: string;
  tempMfa: MFAType;
  smsSection: number;
  totpSection: number;
  error: any;
  preferredMfa: MFAType;
  enabledMfa?: MFAType[];
  username: string;
  features: UserFeaturesType;
  signingCojProgName: string | null;
  signingCojPmId: string;
  signingCoj: boolean;
  signingCojSignedDate: Date | null;
  signingCojVersion: CojVersionType;
  redirected: boolean;
}

const initialState: IUser = {
  status: "idle",
  tempMfa: "NOMFA",
  smsSection: 1,
  totpSection: 1,
  error: "",
  preferredMfa: "NOMFA",
  enabledMfa: [],
  username: "",
  features: {
    actions: {
      enabled: false
    },
    cct: {
      enabled: false
    },
    details: {
      enabled: false,
      placements: {
        enabled: false
      },
      profile: {
        enabled: false,
        gmcUpdate: {
          enabled: false
        }
      },
      programmes: {
        enabled: false,
        conditionsOfJoining: {
          enabled: false
        },
        confirmation: {
          enabled: false
        }
      }
    },
    forms: {
      enabled: false,
      formr: {
        enabled: false
      },
      ltft: {
        enabled: false,
        qualifyingProgrammes: []
      }
    },
    notifications: {
      enabled: false
    }
  },
  signingCojProgName: null,
  signingCojPmId: "",
  signingCoj: false,
  signingCojSignedDate: null,
  signingCojVersion: "GG10",
  redirected: false
};

export const fetchUserSession = createAsyncThunk(
  "user/fetchUserSession",
  async () => {
    const session = await fetchAuthSession();
    return session.tokens?.idToken?.payload;
  }
);

export const getPreferredMfa = createAsyncThunk(
  "user/getPreferredMfa",
  async () => {
    const mfaPreference = await fetchMFAPreference();
    return {
      preferred: mfaPreference.preferred,
      enabled: mfaPreference.enabled
    };
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMfaJourney(state) {
      return {
        ...state,
        status: "idle",
        tempMfa: "NOMFA",
        smsSection: 1,
        totpSection: 1,
        error: ""
      };
    },
    resetError(state) {
      return { ...state, status: "idle", error: "" };
    },
    updatedTempMfa(state, action: PayloadAction<MFAType>) {
      return { ...state, tempMfa: action.payload };
    },
    decrementSmsSection: state => {
      state.smsSection -= 1;
    },
    incrementSmsSection: state => {
      state.smsSection += 1;
    },
    incrementTotpSection: state => {
      state.totpSection += 1;
    },
    updatedTotpSection(state, action: PayloadAction<number>) {
      return { ...state, totpSection: action.payload };
    },
    updatedSmsSection(state, action: PayloadAction<number>) {
      return { ...state, smsSection: action.payload };
    },
    resetStatus(state, action: PayloadAction<string>) {
      return { ...state, status: action.payload };
    },
    updatedPreferredMfa(state, action: PayloadAction<MFAType>) {
      return { ...state, preferredMfa: action.payload };
    },
    updatedUserFeatures(state, action: PayloadAction<UserFeaturesType>) {
      return {
        ...state,
        features: {
          ...state.features,
          ...action.payload
        }
      };
    },
    updatedsigningCojProgName(state, action: PayloadAction<null | string>) {
      return { ...state, signingCojProgName: action.payload };
    },
    updatedsigningCojPmId(state, action: PayloadAction<string>) {
      return { ...state, signingCojPmId: action.payload };
    },
    updatedsigningCoj(state, action: PayloadAction<boolean>) {
      return { ...state, signingCoj: action.payload };
    },
    updatedsigningCojSignedDate(state, action: PayloadAction<Date | null>) {
      return { ...state, signingCojSignedDate: action.payload };
    },
    updatedsigningCojVersion(state, action: PayloadAction<CojVersionType>) {
      return { ...state, signingCojVersion: action.payload };
    },
    updatedRedirected(state, action: PayloadAction<boolean>) {
      return { ...state, redirected: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.features =
          (action?.payload?.features as UserFeaturesType) ??
          initialState.features;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getPreferredMfa.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preferredMfa = action.payload.preferred ?? "NOMFA";
        state.enabledMfa = action.payload.enabled ?? [];
      })
      .addCase(getPreferredMfa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default userSlice.reducer;

export const selectPreferredMFA = (state: { user: IUser }) =>
  state.user.preferredMfa;

export const {
  resetMfaJourney,
  resetError,
  updatedTempMfa,
  decrementSmsSection,
  incrementSmsSection,
  incrementTotpSection,
  updatedTotpSection,
  updatedSmsSection,
  updatedPreferredMfa,
  updatedUserFeatures,
  updatedsigningCojProgName,
  updatedsigningCojPmId,
  updatedsigningCoj,
  updatedsigningCojSignedDate,
  updatedsigningCojVersion,
  updatedRedirected
} = userSlice.actions;
