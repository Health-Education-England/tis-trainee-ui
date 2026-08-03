import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnnouncements } from "../../services/AnnouncementsService";
import { Announcement } from "../../models/Announcement";

interface IAnnouncements {
  announcements: Announcement[];
  status: string;
  error: any;
}

export const initialState: IAnnouncements = {
  announcements: [],
  status: "idle",
  error: ""
};

export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async () => {
    return await getAnnouncements();
  }
);

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAnnouncements.pending, state => {
        state.status = "loading";
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.announcements = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, { error }) => {
        state.status = "failed";
        state.error = error.message;
      });
  }
});

export default announcementsSlice.reducer;
