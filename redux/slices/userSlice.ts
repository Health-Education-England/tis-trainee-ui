import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toastErrText } from "../../utilities/Constants";
import { showToast, ToastType } from "../../components/common/ToastMessage";
import {
  fetchMFAPreference,
  getCurrentUser,
  setUpTOTP,
  fetchAuthSession
} from "aws-amplify/auth";

export type CojVersionType = "GG9" | "GG10";

export type MfaAttribType = "email" | "phone_number";

export type UserFeaturesType = {
  ltft: boolean;
  ltftProgrammes: string[];
};

interface IUser {
  status: string;
  tempMfa: string;
  smsSection: number;
  totpSection: number;
  error: any;
  totpCode: string;
  preferredMfa: string;
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
  totpCode: "",
  preferredMfa: "NOMFA",
  username: "",
  features: {
    ltft: false,
    ltftProgrammes: []
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
    return mfaPreference.preferred;
  }
);

export const updateTotpCode = createAsyncThunk(
  "user/updateTotpCode",
  async () => {
    return (await setUpTOTP()).sharedSecret;
  }
);

export const getUsername = createAsyncThunk("user/getUsername", async () => {
  const { username } = await getCurrentUser();
  return username;
});

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
        error: "",
        totpCode: ""
      };
    },
    resetError(state) {
      return { ...state, status: "idle", error: "" };
    },
    updatedTempMfa(state, action: PayloadAction<string>) {
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
    updatedPreferredMfa(state, action: PayloadAction<string>) {
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
        state.features = action?.payload?.features as UserFeaturesType;
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getPreferredMfa.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preferredMfa = action.payload ?? "NOMFA";
      })
      .addCase(getPreferredMfa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateTotpCode.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totpCode = action.payload;
      })
      .addCase(updateTotpCode.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.updateTotpCode,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(getUsername.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.username = action.payload;
      })
      .addCase(getUsername.rejected, (state, action) => {
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
