import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project?: any;
  assignedTo?: any;
  dueDate?: string;
  createdAt: string;
}

interface TaskState {
  list: Task[];
  loading: boolean;
  error: any;
}

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async (projectId: string | void, thunkAPI) => {
  try {
    const url = projectId ? `/tasks?projectId=${projectId}` : '/tasks';
    const res = await api.get(url);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (data: any, thunkAPI) => {
  try {
    const res = await api.post('/tasks', data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const updateTask = createAsyncThunk('tasks/update', async ({ id, data }: { id: string, data: any }, thunkAPI) => {
  try {
    const res = await api.put(`/tasks/${id}`, data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string, thunkAPI) => {
  try {
    await api.delete(`/tasks/${id}`);
    return id;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
  }
});

const initialState: TaskState = { list: [], loading: false, error: null };

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.loading = false; state.list = action.payload; })
      .addCase(fetchTasks.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createTask.fulfilled, (state, action) => { state.list.push(action.payload); })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
