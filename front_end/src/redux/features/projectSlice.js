import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../api/api';

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async (axios, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL.PROJECT_URL);
        return response.data;
    }
    catch (err) {
        if (!err.response) {
            return rejectWithValue('No Server Response');
        }
        return rejectWithValue(err.response.data?.message || 'Failed to fetch projects');
    }
});

export const deleteProject = createAsyncThunk(
    'projects/deleteProject',
    async ({ PROJECT_ID, axios }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(API_URL.EMP_URL, { data: { empid: PROJECT_ID } });
            dispatch(fetchProjects(axios));
            return PROJECT_ID;
        } catch (err) {

            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to delete employee');
        }
    }
);

export const createProject = createAsyncThunk(
    'projects/createProject',
    async ({ pdt,wbs, title, notes, group, subtype, start_date, axios }, {dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL.PROJECT_URL, { pdt,wbs, title, notes, group, subtype, start_date});
            
            dispatch(fetchProjects(axios));
            return response.data;
        } catch (err) {
            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to create employee');
        }
    }
);


const projectSlice = createSlice({
    name: 'projects',
    initialState: {
        list: [],
        selected: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearProjects: (state) => {
            state.list = [];
            state.selected = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch projects
            .addCase(fetchProjects.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // delete project

            .addCase(deleteProject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // create project

            .addCase(createProject.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(createProject.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

            // select project
    },
});

export const { clearProjects } = projectSlice.actions;
export default projectSlice.reducer;
