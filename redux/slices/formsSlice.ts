import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { IFormR } from "../../models/IFormR";
import { LifeCycleState } from "../../models/LifeCycleState";
import { FormsService } from "../../services/FormsService";
import { DateUtilities } from "../../utilities/DateUtilities";

interface IForms {
  forms: IFormR[];
  submittedForms: IFormR[];
  status: string;
  error: any;
}

export const initialState: IForms = {
  forms: [],
  submittedForms: [],
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
    return DateUtilities.genericSort(response.data, "submissionDate", true);
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
        state.submittedForms = action.payload.filter(
          (form: IFormR) => form.lifecycleState === LifeCycleState.Submitted
        );
      })
      .addCase(fetchForms.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export default formsSlice.reducer;

export const selectAllforms = (state: { forms: IForms }) => state.forms.forms;
export const selectAllSubmittedforms = (state: { forms: IForms }) =>
  state.forms.submittedForms;
