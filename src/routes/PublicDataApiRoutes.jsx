import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DisabledJoboffers from '../pages/PublicDataApi/DisabledJoboffers';
import WelfareServices from '../pages/PublicDataApi/WelfareServices';

const PublicDataApiRoutes = () => {
    return (
        <Routes>
            <Route path="/disabled-job-offers" element={<DisabledJoboffers />} />
            <Route path="/welfare-services" element={<WelfareServices />} />
        </Routes>
    );
};

export default PublicDataApiRoutes; 