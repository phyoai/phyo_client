import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface Project {
  _id: string;
  name: string;
  description: string;
  progressPercentage: number;
  date: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
}

interface ProjectStats {
  totalProjects: number;
  inProgressProjects: number;
  completedProjects: number;
  averageProgress: number;
  statusBreakdown: {
    notStarted: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
}

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  projectStats: ProjectStats | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// Async thunks
export const getProjects = createAsyncThunk(
  'project/getProjects',
  async (
    { status, page = 1, limit = 10 }: { status?: string; page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const params: any = { page, limit };
      if (status) params.status = status;

      const response = await api.get('/projects', { params });
      const data = response.data?.data || response.data;
      return { data: Array.isArray(data) ? data : [], pagination: response.data?.pagination || { page, limit, total: 0 } };
    } catch (error) {
      return { data: [], pagination: { page, limit, total: 0 } };
    }
  }
);

export const getProjectById = createAsyncThunk(
  'project/getProjectById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createProject = createAsyncThunk(
  'project/createProject',
  async (
    projectData: {
      name: string;
      description: string;
      progressPercentage?: number;
      date?: string;
      status?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/projects', projectData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateProject = createAsyncThunk(
  'project/updateProject',
  async (
    { id, projectData }: { id: string; projectData: Partial<Project> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/projects/${id}`, projectData);
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const getProjectStats = createAsyncThunk(
  'project/getProjectStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/projects/stats');
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  projectStats: null,
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearProjects: (state) => {
      state.projects = [];
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Projects
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
        state.projects = [];
      })

      // Get by ID
      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?._id === action.payload._id) {
          state.selectedProject = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter((p) => p._id !== action.payload);
        if (state.selectedProject?._id === action.payload) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Stats
      .addCase(getProjectStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjectStats.fulfilled, (state, action) => {
        state.loading = false;
        state.projectStats = action.payload;
      })
      .addCase(getProjectStats.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setFilters, selectProject, clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
