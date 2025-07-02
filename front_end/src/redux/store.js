import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './features/empSlice';
import organizationsReducer from './features/orgSlice';
import projectsReducer from './features/projectSlice';
import loggerMiddleware from './loggerMiddleware';

export default configureStore({
  reducer: {
    employees: employeesReducer,
    organizations: organizationsReducer,
    projects: projectsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
})