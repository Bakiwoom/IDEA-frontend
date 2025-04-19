import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './pages/Main.jsx';
import UserRoutes from './routes/UserRoutes';
import VendorRoutes from './routes/VendorRoutes';
import AdminRoutes from './routes/AdminRoutes';

import "./assets/css/all.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* 메인화면 */}
        <Route path='/' element={<Main />}/>

        {/* 사용자 라우터 */}
        <Route path="/user/*" element={<UserRoutes />} />

        {/* 업체 라우터 */}
        <Route path="/vendor/*" element={<VendorRoutes />} />

        {/* 관리자 라우터 */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;