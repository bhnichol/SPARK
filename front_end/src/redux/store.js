import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from './features/empSlice';

export default configureStore({
  reducer: {
    employees: employeesReducer
  },
})