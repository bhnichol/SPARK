import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './features/empSlice';
import organizationsReducer from './features/orgSlice';
import loggerMiddleware from './loggerMiddleware';

export default configureStore({
  reducer: {
    employees: employeesReducer,
    organizations: organizationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
})