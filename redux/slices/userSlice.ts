import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import { MFAType } from "../../models/MFAStatus";

interface IUser {
  status: string;
  tempMfa: string;
  smsSection: number;
  totpSection: number;
  error: any;
  totpCode: string;
  preferredMfa: any;
  username: string;
  cognitoGroups: string[] | undefined;
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
  cognitoGroups: undefined
};

export const getCognitoGroups = createAsyncThunk(
  "user/getCognitoGroups",
  async () => {
    const user = await Auth.currentAuthenticatedUser();
    const cogGroups = await user.signInUserSession.accessToken.payload[
      "cognito:groups"
    ];
    return cogGroups;
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
    updatedCognitoGroups(state, action: PayloadAction<Array<string>>) {
      return { ...state, cognitoGroups: action.payload };
    }
  },
  extraReducers(builder): void {
    builder
      .addCase(getCognitoGroups.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cognitoGroups = action.payload;
      })
      .addCase(getCognitoGroups.rejected, (state, action) => {
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
      .addCase(updateTotpCode.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(updateUserAttributes.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(updateUserAttributes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(verifyPhone.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(verifyPhone.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(verifyTotp.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(verifyTotp.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(verifyUserAttributeSubmit.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(verifyUserAttributeSubmit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(setPreferredMfa.fulfilled, (state, _action) => {
        state.status = "succeeded";
      })
      .addCase(setPreferredMfa.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
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
  updatedCognitoGroups
} = userSlice.actions;
