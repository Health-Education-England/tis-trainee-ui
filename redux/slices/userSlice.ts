import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import { MFAType } from "../../models/MFAStatus";
import { toastErrText, toastSuccessText } from "../../utilities/Constants";
import { showToast, ToastType } from "../../components/common/ToastMessage";

export type CojVersionType = "GG9" | "GG10";

interface IUser {
  status: string;
  tempMfa: string;
  smsSection: number;
  totpSection: number;
  error: any;
  totpCode: string;
  preferredMfa: string;
  username: string;
  features: {
    ltft: boolean;
  };
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
    ltft: false
  },
  signingCojProgName: null,
  signingCojPmId: "",
  signingCoj: false,
  signingCojSignedDate: null,
  signingCojVersion: "GG10",
  redirected: false
};

export const fetchUserAuthInfo = createAsyncThunk(
  "user/fetchUserAuthInfo",
  async () => {
    const user = await Auth.currentAuthenticatedUser();
    const { idToken } = user.signInUserSession;
    console.log("idToken payload", idToken.payload);
    return idToken.payload;
  }
);

export const getPreferredMfa = createAsyncThunk(
  "user/getPreferredMfa",
  async () => {
    const { preferredMFA } = await Auth.currentAuthenticatedUser();
    return preferredMFA;
  }
);

export const updateTotpCode = createAsyncThunk(
  "user/updateTotpCode",
  async () => {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.setupTOTP(user);
  }
);

export const updateUserAttributes = createAsyncThunk(
  "user/updateUserAttributes",
  async (attrib: { phone_number: string }) => {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.updateUserAttributes(user, attrib);
  }
);

export const verifyPhone = createAsyncThunk("user/verifyPhone", async () => {
  return Auth.verifyCurrentUserAttribute("phone_number");
});

export const verifyTotp = createAsyncThunk(
  "user/verifyTotp",
  async (totpInput: string) => {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.verifyTotpToken(user, totpInput);
  }
);

export const verifyUserAttributeSubmit = createAsyncThunk(
  "user/verifyUserAttributeSubmit",
  async (userAttribSubData: any) => {
    const { attrib, code } = userAttribSubData;
    return Auth.verifyCurrentUserAttributeSubmit(attrib, code);
  }
);

export const setPreferredMfa = createAsyncThunk(
  "user/setPreferredMfa",
  async (pref: MFAType) => {
    const user = await Auth.currentAuthenticatedUser();
    return Auth.setPreferredMFA(user, pref);
  }
);

export const getUsername = createAsyncThunk("user/getUsername", async () => {
  const { username } = await Auth.currentAuthenticatedUser();
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
    updatedLtftPilot(state, action: PayloadAction<boolean>) {
      return {
        ...state,
        features: { ...state.features, ltft: action.payload }
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
      .addCase(fetchUserAuthInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.features = action.payload.features;
      })
      .addCase(fetchUserAuthInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(getPreferredMfa.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.preferredMfa = action.payload;
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
      .addCase(updateUserAttributes.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateUserAttributes.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.updateUserAttributes,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(verifyPhone.fulfilled, (state, _action) => {
        state.status = "succeeded";
        showToast(toastSuccessText.verifyPhone, ToastType.SUCCESS);
      })
      .addCase(verifyPhone.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.verifyPhone,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(verifyTotp.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(verifyTotp.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.verifyTotp,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(verifyUserAttributeSubmit.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(verifyUserAttributeSubmit.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.verifyUserAttributeSubmit,
          ToastType.ERROR,
          `${error.code}-${error.message}`
        );
      })
      .addCase(setPreferredMfa.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(setPreferredMfa.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
        showToast(
          toastErrText.setPreferredMfa,
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
  updatedLtftPilot,
  updatedsigningCojProgName,
  updatedsigningCojPmId,
  updatedsigningCoj,
  updatedsigningCojSignedDate,
  updatedsigningCojVersion,
  updatedRedirected
} = userSlice.actions;
