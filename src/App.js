import { Toaster } from 'sonner';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componant/Login/Login';
import HomePage from './componant/HomePage/HomePage';
import Language from './componant/Language/Language';
import Signup from './componant/Signup/Signup';
import ChangePassword from './componant/ChangePassword/ChangePassword';
import PublicRoutes from './Routes/PublicRoute';
import PrivateRoutes from './Routes/PrivateRoute';
import MatrasFile from './componant/MatrasFile/MatrasFile';

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path="" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="change-password" element={<ChangePassword />} />
          </Route>
          <Route element={<PrivateRoutes />}>
            <Route path="home" element={<HomePage />} />
            <Route path="your-matras" element={<MatrasFile />} />
            <Route path="change-language" element={<Language />} />
          </Route>
        </Routes>
      </Router >
    </>
  );
}

export default App;
