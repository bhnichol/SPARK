
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

function App() {
  document.body.style = 'background-color: #1A1A1D'
  return (
    <ThemeProvider theme={AppTheme}>
      <ThemedWrapper>
      <Routes>
        <Route path="/" element={<MinLayout/>}>
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
