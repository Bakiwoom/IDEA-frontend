import { Routes, Route } from 'react-router-dom';

import "../contexts/css/Reset.css";

import VendorSidebar from "../pages/vendor/VendorSidebar";
import ApplicantManagement from "../pages/vendor/ApplicantManagement";
import InfoManagement from "../pages/vendor/InfoManagement";
import NotificationSettings from "../pages/vendor/NotificationSettings";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/Sidebar" element={<VendorSidebar />} />
      <Route path="/applicant/management" element={<ApplicantManagement />} />
      <Route path="/info/management" element={<InfoManagement />} />
      <Route path="/notification/settings" element={<NotificationSettings />} />
    </Routes>
  );
};

export default VendorRoutes;