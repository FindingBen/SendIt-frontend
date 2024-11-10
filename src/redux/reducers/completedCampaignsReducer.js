import { createSlice } from "@reduxjs/toolkit";

const campaignsSlice = createSlice({
  name: "campaigns",
  initialState: {
    campaigns: [],
  },
  reducers: {
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    clearCampaigns: (state) => {
      state.campaigns = [];
    },
  },
});

export const { setCampaigns, clearCampaigns } = campaignsSlice.actions;

export const selectCampaigns = (state) => state.completedCampaigns.campaigns;

export default campaignsSlice.reducer;
