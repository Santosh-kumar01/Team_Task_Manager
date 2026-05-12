import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

interface Project {
  _id: string;
  name: string;
  description?: string;
  members: any[];
  createdBy: any;
  createdAt: string;
}

interface ProjectState {
  list: Project[];
  loading: boolean;
  error: any;
}

export const fetchProjects = createAsyncThunk('projects/fetchAll', async (_: void, thunkAPI) => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createProject = createAsyncThunk('projects/create', async (data: any, thunkAPI) => {
  try {
    const res = await api.post('/projects', data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }: { id: string, data: any }, thunkAPI) => {
  try {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteProject = createAsyncThunk('projects/delete', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/projects/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState: ProjectState = { list: [], loading: false, error: null };

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createProject.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.payload);
      });
  },
});

export default projectSlice.reducer;
