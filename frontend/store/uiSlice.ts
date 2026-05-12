import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  activeTab: 'overview' | 'tasks' | 'team';
}

const initialState: UIState = {
  activeTab: 'overview',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<'overview' | 'tasks' | 'team'>) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = uiSlice.actions;
export default uiSlice.reducer;
