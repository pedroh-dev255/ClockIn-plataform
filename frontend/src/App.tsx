import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LoginPage from './screens/loginScreen';
import DashboardPage from './screens/dashboard';
import ConfigsScreen from './screens/configsScreen';

import NotFoundRedirect from './screens/NotFoundRedirect';


function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    setAutenticado(!!(token && userData));
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (autenticado) {
        navigate('/');
      } else {
        navigate('/login');
      }
    }
  }, [loading, autenticado, navigate]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Carregando sistema...</h1>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path='/configs' element={<ConfigsScreen/>} />

        <Route path="*" element={<NotFoundRedirect />}/>
      </Routes>
    </Router>
  );
}
