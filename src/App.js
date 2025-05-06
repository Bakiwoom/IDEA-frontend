import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main.jsx";
import UserRoutes from "./routes/UserRoutes";
import CompanyRoutes from "./routes/CompanyRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes";
import Layout from "./components/Layout";
import CompanyLayout from "./components/CompanyLayout.jsx";
import {AuthProvider} from "../src/contexts/user/AuthProvider.js";
import ChatBot from '../src/components/ChatBot/ChatBot.tsx';
import { ChatProvider } from './contexts/ChatContext';

import "./assets/css/all.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            {/* 푸터가 필요 없는 벤더 경로 */}
            <Route element={<CompanyLayout />}>
              <Route path="/company/*" element={<CompanyRoutes />} />
            </Route>
            {/* 푸터가 있는 나머지 경로 */}
            <Route element={<Layout />}>
              <Route path="/" element={<Main />} />
              <Route path="/admin/*" element={<AdminRoutes />} />
            </Route>
            {/* 사용자 라우터 (layout X) */}
            <Route path="/user/*" element={<UserRoutes />} />
          </Routes>
          <ChatBot />
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
