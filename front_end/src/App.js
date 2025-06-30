
import { Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import MinLayout from './screens/minLayout';
import PersistLogin from './components/persistLogin';
import RequireAuth from './components/RequireAuth';
import Home from './screens/Home';
import MissingScreen from './screens/missingScreen';
import Layout from './screens/layout';
import Register from './screens/Register';
import { ThemeProvider } from '@emotion/react';
import { AppTheme } from './theme';
import ThemedWrapper from './components/themeWrapper';
import Resources from './screens/Resources/Resources';
import Employees from './screens/Resources/Employees';
import Organizations from './screens/Resources/Organizations';
import Nonlabor from './screens/Resources/Nonlabor';
import Projects from './screens/Projects/Projects';
import ProjectCreate from './screens/Projects/ProjectCreate';
import { useDispatch } from 'react-redux';
import { clearEmployees, fetchEmployees } from './redux/features/empSlice';
import useAuth from './hooks/useAuth';
import { useEffect } from 'react';
import useAxiosPrivate from './hooks/useAxiosPrivate';
import { clearOrgs, fetchOrgs } from './redux/features/orgSlice';

function App() {
  document.body.style = 'background-color: #1A1A1D'
  const { auth } = useAuth();
  const dispatch = useDispatch();
  const axios = useAxiosPrivate();

useEffect(() => {
  if (auth?.accessToken) {
    dispatch(fetchEmployees(axios));
    dispatch(fetchOrgs(axios));
  } else {
    dispatch(clearEmployees());
    dispatch(clearOrgs());
  }
}, [auth?.accessToken, dispatch]);
  return (
    <ThemeProvider theme={AppTheme}>
      <ThemedWrapper>
        <Routes>
          <Route path="/" element={<MinLayout />}>
            {/* Public Routes */}
            <Route path="login" index element={<Login />} />
            <Route path="register" index element={<Register />} />

            {/* Protected Routes */}
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={[1]} />}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="/resources" element={<Resources />}>
                    <Route path="/resources/emp" element={<Employees />} />
                    <Route path="/resources/org" element={<Organizations />} />
                    <Route path="/resources/nonlabor" element={<Nonlabor />} />
                  </Route>
                  <Route path="/projects" element={<Projects />}>
                    <Route path="/projects/create" element={<ProjectCreate />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            {/* Catch-all route for missing pages */}
            <Route path="*" element={<MissingScreen />} />
          </Route>
        </Routes>

      </ThemedWrapper>
    </ThemeProvider>
  );
}


export default App;
