import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LoginPage from './screens/loginScreen';
import NovaSenhaPage from './screens/novaSenhaScreen';
import DashboardPage from './screens/dashboard';
import ConfigsScreen from './screens/configsScreen';

import NotFoundRedirect from './screens/NotFoundRedirect';



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/resetar-senha/:token" element={<NovaSenhaPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path='/configs' element={<ConfigsScreen/>} />

        <Route path="*" element={<NotFoundRedirect />}/>
      </Routes>
    </Router>
  );
}
