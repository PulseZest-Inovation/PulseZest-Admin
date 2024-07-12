import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';

// Import Files Fro V1 Sidebar

import Home from '../pages/home';
import AppDevelopment from '../pages/appDevelopment';
import WebDevelopment from '../pages/webDevelopment';
import UserResgistration from '../pages/UserRegister';
import Employee from '../pages/employee';
import Intern from '../pages/intern';
import AttendancePage from '../components/Attendance/AttendancePage';
import Offers from '../pages/Offers';
import PulseZestLearning from '../Learning/Pages/LearningAdmin/learningAdmin';


// Import Files Fro V2 Sidebar

import V2Home from '../components/V2-Sidebar-Components/Home/home';
import Notification from '../components/V2-Sidebar-Components/Notifications/noti';

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [sidebarVersion, setSidebarVersion] = useState('V1');

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleVersionChange = (version) => {
    setSidebarVersion(version);
  };

  return (
    <Layout
      isSidebarOpen={isSidebarOpen}
      handleSidebarToggle={handleSidebarToggle}
      sidebarVersion={sidebarVersion}
      onVersionChange={handleVersionChange}
    >
      {/*Routes For V1 Sidebar*/}
      <Routes>
        <Route path="pulsezest-learning" element={<PulseZestLearning />} />
        <Route path="app-development" element={<AppDevelopment />} />
        <Route path="web-development" element={<WebDevelopment />} />
        <Route path="user-registration" element={<UserResgistration />} />
        <Route path="offers" element={<Offers />} />
        <Route path="employee-details" element={<Employee />} />
        <Route path="intern-details" element={<Intern />} />
        <Route path="user-attendance" element={<AttendancePage />} />
        <Route path="/" element={<Home />} />
      </Routes>
     
              {/*Routes For V2 Sidebar*/}

              <Routes>

              <Route path="/V2-home" element={<V2Home />} />
              <Route path="/notifiaction-portal" element={<Notification />} />
              </Routes>



    </Layout>
  );
};

export default Dashboard;
