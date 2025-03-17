
import { Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import MinLayout from './screens/minLayout';
import PersistLogin from './components/persistLogin';
import RequireAuth from './components/RequireAuth';
import Home from './screens/Home';
import MissingScreen from './screens/missingScreen';
import Layout from './screens/layout';
import Register from './screens/Register';

function App() {

  return (
    <Routes>
      <Route path="/" element={<MinLayout />}>

        {/*Public Routes*/}
        <Route path="login" index element={<Login />} />
        <Route path="register" index element={<Register />} />

        {/*Protected Routes*/}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[1]} />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
            </Route>
          </Route>
        </Route>
        <Route path = "*" element={<MissingScreen/>}/>
      </Route>
    </Routes>
  );
}


export default App;
