import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main.jsx";
import UserRoutes from "./routes/UserRoutes";
import CompanyRoutes from "./routes/CompanyRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes";
import Layout from "./components/Layout";
import CompanyLayout from "./components/CompanyLayout.jsx";
<<<<<<< HEAD
import {AuthProvider} from "../src/contexts/user/AuthProvider.js";
=======
import ChatBot from './components/Chatbot/ChatBot';
import { ChatProvider } from './contexts/ChatContext';
>>>>>>> feature/chatbot_ui

import "./assets/css/all.css";

function App() {
  return (
<<<<<<< HEAD
    <Router>
      <AuthProvider>
=======
    <ChatProvider>
      <Router>
>>>>>>> feature/chatbot_ui
        <Routes>
          {/* 푸터가 필요 없는 벤더 경로 */}
          <Route element={<CompanyLayout />}>
            <Route path="/company/*" element={<CompanyRoutes />} />
          </Route>

          {/* 푸터가 있는 나머지 경로 */}
          <Route element={<Layout />}>
            {/* 메인화면 */}
            <Route path="/" element={<Main />} />
            {/* 관리자 라우터 */}
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>

          {/* 사용자 라우터 (layout X) */}
          <Route path="/user/*" element={<UserRoutes />} />
<<<<<<< HEAD

        </Routes>
      </AuthProvider>
    </Router>
=======
        </Routes>
        <ChatBot />
      </Router>
    </ChatProvider>
>>>>>>> feature/chatbot_ui
  );
}

export default App;
