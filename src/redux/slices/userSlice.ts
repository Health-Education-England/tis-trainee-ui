import { CognitoUser } from "@aws-amplify/auth";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";

interface IUser {
  status: string;
  tempMfa: string;
  smsSection: number;
  totpSection: number;
  error: any;
  totpCode: string;
}

const initialState: IUser = {
  status: "idle",
  tempMfa: "NOMFA",
  smsSection: 1,
  totpSection: 1,
  error: "",
  totpCode: ""
};

export const updateTotpCode = createAsyncThunk(
  "user/updateTotpCode",
  async (user: any) => {
    return Auth.setupTOTP(user);
  }
);

export const updateUserAttributes = createAsyncThunk(
  "user/updateUserAttributes",
  async (userAttribdata: any) => {
    const { user, attrib } = userAttribdata;
    return Auth.updateUserAttributes(user, attrib);
  }
);

export const verifyPhone = createAsyncThunk("user/verifyPhone", async () => {
  return Auth.verifyCurrentUserAttribute("phone_number");
});

export const verifyTotp = createAsyncThunk(
  "user/verifyTotp",
  async (totpParamsData: { user: CognitoUser | any; totpInput: string }) => {
    const { user, totpInput } = totpParamsData;
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
  async (userPrefMfaData: { user: CognitoUser | any; pref: any }) => {
    const { user, pref } = userPrefMfaData;
    return Auth.setPreferredMFA(user, pref);
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUser() {
      return initialState;
    },
    resetError(state) {
      return { ...state, status: "idle", error: "" };
    },
    updatedtempMfa(state, action: PayloadAction<string>) {
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
    }
  },
  extraReducers(builder): void {
    builder
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
      });
  }
});

export default userSlice.reducer;

export const {
  resetUser,
  resetError,
  updatedtempMfa,
  decrementSmsSection,
  incrementSmsSection,
  incrementTotpSection,
  updatedTotpSection,
  updatedSmsSection
} = userSlice.actions;
