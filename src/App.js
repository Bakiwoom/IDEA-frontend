import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main.jsx";
import UserRoutes from "./routes/UserRoutes";
import VendorRoutes from "./routes/VendorRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Layout from "./components/Layout";
import VendorLayout from "./components/VendorLayout";

import "./assets/css/all.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 푸터가 필요 없는 벤더 경로 */}
        <Route element={<VendorLayout />}>
          <Route path="/vendor/*" element={<VendorRoutes />} />
        </Route>

        {/* 푸터가 있는 나머지 경로 */}
        <Route element={<Layout />}>
          {/* 메인화면 */}
          <Route path="/" element={<Main />} />
          {/* 사용자 라우터 */}
          <Route path="/user/*" element={<UserRoutes />} />
          {/* 관리자 라우터 */}
          <Route path="/admin/*" element={<AdminRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
