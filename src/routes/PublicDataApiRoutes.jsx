import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisabledJoboffers from '../pages/PublicDataApi/DisabledJoboffers';
import WelfareServices from '../pages/PublicDataApi/WelfareServices';
import DisabledJobseekers from '../pages/PublicDataApi/DisabledJobseekers';
import DisabilityStatsPage from '../pages/PublicDataApi/DisabilityResearch/DisabilityStatsPage';

const PublicDataApiRoutes = () => {
    return (
        <Routes>
            <Route path="/disabled-job-offers" element={<DisabledJoboffers />} />
            <Route path="/welfare-services" element={<WelfareServices />} />
            <Route path="/disabled-jobseekers" element={<DisabledJobseekers />} />
            <Route path="/disability-stats" element={<DisabilityStatsPage />} />
        </Routes>
    );
};

export default PublicDataApiRoutes; 