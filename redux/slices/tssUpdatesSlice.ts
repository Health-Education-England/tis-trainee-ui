import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getWhatsNew } from "../../services/TssUpdatesService";
import { Post } from "../../models/WPPost";

interface ITssUpdates {
  tssUpdates: Post[];
  status: string;
  error: any;
}

export const initialState: ITssUpdates = {
  tssUpdates: [],
  status: "idle",
  error: ""
};

export const fetchWhatsNew = createAsyncThunk(
  "tssUpdates/fetchTssUpdates",
  async () => {
    const response = await getWhatsNew();
    return response.json();
  }
);

const tssUpdatesSlice = createSlice({
  name: "tssUpdates",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchWhatsNew.pending, (state, _action) => {
        state.status = "loading";
      })
      .addCase(fetchWhatsNew.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tssUpdates = action.payload;
      })
      .addCase(fetchWhatsNew.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
      });
  }
});

export default tssUpdatesSlice.reducer;

export const {} = tssUpdatesSlice.actions;
