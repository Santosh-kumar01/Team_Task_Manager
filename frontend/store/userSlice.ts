import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

export const fetchAllUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

interface UserState {
  list: any[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  list: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
