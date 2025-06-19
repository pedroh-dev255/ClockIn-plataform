import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './screens/loginScreen';
import DashboardPage from './screens/dashboard';

function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [autenticado, setAutenticado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Aqui você pode validar o token com sua API, se quiser
      setAutenticado(true);
    } else {
      setAutenticado(false);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (autenticado) {
        navigate('/dashboard');
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
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/login" element={<LoginPage />} />
        {/*<Route path="/dashboard" element={<DashboardPage />} />*/}
      </Routes>
    </Router>
  );
}
