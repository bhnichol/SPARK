import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../api/api';
import { fetchEmployees } from './empSlice';
import substituteUrlParams from '../../api/util';

export const fetchOrgs = createAsyncThunk('organizations/fetchOrgs', async (axios, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL.ORG_URL);
        return response.data;
    }
    catch (err) {
        if (!err.response) {
            return rejectWithValue('No Server Response');
        }
        return rejectWithValue(err.response.data?.message || 'Failed to fetch organizations');
    }
});

export const deleteOrg = createAsyncThunk(
    'organizations/deleteOrg',
    async ({ orgid, axios }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(API_URL.ORG_URL, { data: { orgid: orgid } });
            dispatch(fetchOrgs(axios));
            dispatch(fetchEmployees(axios));
            return orgid;
        } catch (err) {

            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to delete Organization');
        }
    }
);

export const removeEmp = createAsyncThunk(
    'organizations/removeEmp',
    async ({ empid, axios }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(substituteUrlParams(API_URL.ORG_MAN_URL.REMOVE, { "id": empid }));
            dispatch(fetchEmployees(axios));
            return empid;
        } catch (err) {

            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to remove employee');
        }
    }
);

export const createOrg = createAsyncThunk(
    'organizations/createOrg',
    async ({ employees, ORG_NAME, PARENT_ORG, axios }, { dispatch, rejectWithValue }) => {
        try {
            console.log(PARENT_ORG);
            const response = await axios.post(API_URL.ORG_URL, { employees: employees, ORG_NAME: ORG_NAME, PARENT_ORG: PARENT_ORG });
            dispatch(fetchOrgs(axios));
            dispatch(fetchEmployees(axios));
            return response.data;
        } catch (err) {
            console.error(err);
            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to create org');
        }
    }
);

export const editOrg = createAsyncThunk(
    'organizations/editOrg',
    async ({employees, ORG_NAME, PARENT_ORG, orgid, axios }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(substituteUrlParams(API_URL.ORG_MAN_URL.EDIT, { "id": orgid }),{ employees, ORG_NAME, PARENT_ORG});
            dispatch(fetchOrgs(axios));
            dispatch(fetchEmployees(axios));
            return orgid;
        } catch (err) {

            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to remove employee');
        }
    }
);

const organizationsSlice = createSlice({
    name: 'organizations',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearOrgs: (state) => {
            state.list = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch orgs
            .addCase(fetchOrgs.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrgs.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchOrgs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // delete org

            .addCase(deleteOrg.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteOrg.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteOrg.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // create org

            .addCase(createOrg.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrg.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(createOrg.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // remove employee

            .addCase(removeEmp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeEmp.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(removeEmp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // edit org

            .addCase(editOrg.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editOrg.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(editOrg.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearOrgs } = organizationsSlice.actions;
export default organizationsSlice.reducer;
