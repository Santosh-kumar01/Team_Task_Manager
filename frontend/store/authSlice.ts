import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed';
    return thunkAPI.rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout error', err);
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
  try {
    const res = await api.get('/auth/me');
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue('Not logged in');
  }
});

export const register = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err) {
    const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed';
    return thunkAPI.rejectWithValue(message);
  }
});

interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: any;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isInitialized: false,
};

// localStorage read moved to StoreProvider to prevent Next.js hydration mismatch

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
      })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
