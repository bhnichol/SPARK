import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import API_URL from '../../api/api';

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (axios, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL.EMP_URL);
        return response.data;
    }
    catch (err) {
        if (!err.response) {
            return rejectWithValue('No Server Response');
        }
        return rejectWithValue(err.response.data?.message || 'Failed to fetch employees');
    }
});

export const deleteEmployee = createAsyncThunk(
    'employees/deleteEmployee',
    async ({ EMP_ID, axios }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.delete(API_URL.EMP_URL, { data: { empid: EMP_ID } });
            dispatch(fetchEmployees(axios));
            return EMP_ID;
        } catch (err) {

            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to delete employee');
        }
    }
);

export const createEmployee = createAsyncThunk(
    'employees/createEmployee',
    async ({ empData, axios }, {dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL.EMP_URL, {employees: empData});
            
            dispatch(fetchEmployees(axios));
            return response.data;
        } catch (err) {
            if (!err.response) {
                return rejectWithValue('No Server Response');
            }
            return rejectWithValue(err.response.data?.message || 'Failed to create employee');
        }
    }
);


const employeesSlice = createSlice({
    name: 'employees',
    initialState: {
        list: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        clearEmployees: (state) => {
            state.list = [];
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch emp
            .addCase(fetchEmployees.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.list = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // delete emp

            .addCase(deleteEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            // create emp

            .addCase(createEmployee.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
