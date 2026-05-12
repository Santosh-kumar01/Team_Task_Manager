import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/axios';

// --- INITIAL STATE ---
interface AppState {
  auth: {
    user: any | null;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
  };
  projects: {
    list: any[];
    loading: boolean;
    error: string | null;
  };
  tasks: {
    list: any[];
    loading: boolean;
    error: string | null;
  };
  users: {
    list: any[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    activeTab: 'overview' | 'tasks' | 'team';
  };
}

const initialState: AppState = {
  auth: { user: null, loading: false, error: null, isInitialized: false },
  projects: { list: [], loading: false, error: null },
  tasks: { list: [], loading: false, error: null },
  users: { list: [], loading: false, error: null },
  ui: { activeTab: 'overview' },
};

// --- AUTH THUNKS ---
export const login = createAsyncThunk('app/login', async (credentials: any, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', credentials);
    // Login hote hi naye user data ke saath fetch trigger karo
    dispatch(fetchAppData(res.data));
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('app/register', async (data: any, thunkAPI) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('app/logout', async (_, thunkAPI) => {
  try {
    await api.post('/auth/logout');
    return null;
  } catch (err) {
    return null;
  }
});

export const initializeApp = createAsyncThunk('app/initialize', async (_, { dispatch }) => {
  try {
    const authRes = await api.get('/auth/me');
    const user = authRes.data;
    dispatch(setAuthUser(user));
    dispatch(fetchAppData(undefined));
    return user;
  } catch (err) {
    return null;
  }
});

// --- DATA THUNKS ---
export const fetchAppData = createAsyncThunk('app/fetchData', async (userOverride: any = null, { getState }) => {
  const state = getState() as any;
  const user = userOverride || state.app.auth.user;
  const isAdmin = user?.role === 'Admin';
  
  const [projects, tasks, users] = await Promise.all([
    api.get('/projects'),
    api.get('/tasks'),
    isAdmin ? api.get('/auth/users') : Promise.resolve({ data: [] })
  ]);
  return { projects: projects.data, tasks: tasks.data, users: users.data };
});

// --- CRUD THUNKS ---
export const createProject = createAsyncThunk('projects/create', async (data: any, thunkAPI) => {
  try {
    const res = await api.post('/projects', data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create project');
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }: { id: string, data: any }, thunkAPI) => {
  try {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data: any, thunkAPI) => {
  try {
    const res = await api.post('/tasks', data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create task');
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }: { id: string, data: any }, thunkAPI) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Delete failed');
  }
});

// --- SLICE ---
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<any>) => {
      state.auth.user = action.payload;
      state.auth.isInitialized = true;
    },
    setActiveTab: (state, action: PayloadAction<'overview' | 'tasks' | 'team'>) => {
      state.ui.activeTab = action.payload;
    },
    logout: (state) => {
      state.auth.user = null;
      state.projects.list = [];
      state.tasks.list = [];
      state.users.list = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Auth Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.auth.user = null;
        state.projects.list = [];
        state.tasks.list = [];
        state.users.list = [];
        state.auth.isInitialized = true;
      })
      .addCase(login.pending, (state) => { state.auth.loading = true; state.auth.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.auth.loading = false;
        state.auth.user = action.payload;
        state.auth.isInitialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.auth.loading = false;
        state.auth.error = action.payload as string;
      })
      .addCase(register.pending, (state) => { state.auth.loading = true; state.auth.error = null; })
      .addCase(register.fulfilled, (state) => { state.auth.loading = false; })
      .addCase(register.rejected, (state, action) => {
        state.auth.loading = false;
        state.auth.error = action.payload as string;
      })
      .addCase(initializeApp.rejected, (state) => {
        state.auth.isInitialized = true;
      })
      // Data Cases
      .addCase(fetchAppData.pending, (state) => {
        state.projects.loading = true;
        state.tasks.loading = true;
      })
      .addCase(fetchAppData.fulfilled, (state, action) => {
        state.projects.list = action.payload.projects;
        state.tasks.list = action.payload.tasks;
        state.users.list = action.payload.users;
        state.projects.loading = false;
        state.tasks.loading = false;
      })
      // CRUD Cases
      .addCase(createProject.fulfilled, (state, action) => { state.projects.list.unshift(action.payload); })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.list.findIndex(p => p._id === action.payload._id);
        if (index !== -1) state.projects.list[index] = action.payload;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects.list = state.projects.list.filter(p => p._id !== action.payload);
      })
      .addCase(createTask.fulfilled, (state, action) => { state.tasks.list.unshift(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) state.tasks.list[index] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks.list = state.tasks.list.filter(t => t._id !== action.payload);
      });
  }
});

export const { setAuthUser, setActiveTab, logout } = appSlice.actions;
export default appSlice.reducer;
