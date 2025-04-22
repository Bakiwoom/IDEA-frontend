import { Routes, Route } from 'react-router-dom';

import VendorSidebar from "../pages/vendor/VendorSidebar";
import JobManagement from "../pages/vendor/JobManagement";
import JobDetail from "../pages/vendor/JobDetail";
import ApplicantManagement from "../pages/vendor/ApplicantManagement";
import InfoManagement from "../pages/vendor/InfoManagement";
import NotificationSettings from "../pages/vendor/NotificationSettings";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/sidebar" element={<VendorSidebar />} />
      <Route path="/job/management" element={<JobManagement />} />
      <Route path="/job/management/detail/:jobId" element={<JobDetail />} />
      <Route path="/applicant/management" element={<ApplicantManagement />} />
      <Route path="/info/management" element={<InfoManagement />} />
      <Route path="/notification/settings" element={<NotificationSettings />} />
    </Routes>
  );
};

export default VendorRoutes;