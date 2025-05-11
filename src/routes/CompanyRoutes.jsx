import { Routes, Route } from 'react-router-dom';

import CompanySidebar from "../pages/vendor/CompanySidebar";
import JobManagement from "../pages/vendor/JobManagement";
import JobDetail from "../pages/vendor/JobDetail";
import ApplicantManagement from "../pages/vendor/ApplicantManagement";
import InfoManagement from "../pages/vendor/InfoManagement";
import NotificationSettings from "../pages/vendor/NotificationSettings";
import JobCreate from "../pages/vendor/JobCreate";


const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/sidebar" element={<CompanySidebar />} />
      <Route path="/job/management" element={<JobManagement />} />
      <Route path="job/management/detail/:jobId" element={<JobDetail />} />
      <Route path="/applicant/management" element={<ApplicantManagement />} />
      <Route path="/info/management" element={<InfoManagement />} />
      <Route path="/notification/settings" element={<NotificationSettings />} />
      <Route path="/job/create" element={<JobCreate />} />
    </Routes>
  );
};

export default VendorRoutes;