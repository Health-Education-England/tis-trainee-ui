import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { IFormR } from "../../models/IFormR";
import { FormsService } from "../../services/FormsService";

interface IForms {
  forms: IFormR[];
  status: string;
  error: any;
}

export const initialState: IForms = {
  forms: [],
  status: "idle",
  error: ""
};

export const fetchForms = createAsyncThunk(
  "forms/fetchForms",
  async (path: string) => {
    const formsService = new FormsService();
    let response: AxiosResponse<IFormR[]>;
    if (path === "/formr-a") {
      response = await formsService.getTraineeFormRPartAList();
    } else response = await formsService.getTraineeFormRPartBList();
    return response.data;
  }
);

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchForms.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchForms.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.forms = action.payload;
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formsSlice.reducer;

export const selectAllforms = (state: { forms: IForms }) => state.forms.forms;
