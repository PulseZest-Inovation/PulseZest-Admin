import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';

// Import Files For V1 Sidebar

import Home from '../pages/V1SidebarPages/home';
import AppDevelopment from '../pages/V1SidebarPages/appDevelopment';
import WebDevelopment from '../pages/V1SidebarPages/webDevelopment';
import UserResgistration from '../pages/V1SidebarPages/UserRegister';
import Employee from '../pages/V1SidebarPages/employee';
import Intern from '../pages/V1SidebarPages/intern';
import AttendancePage from '../components/Employee-Attendance/Attendance/AttendancePage';
import Offers from '../pages/V1SidebarPages/Offers';
import PulseZestLearning from '../Learning/Pages/LearningAdmin/learningAdmin';


// Import Files For V2 Sidebar

import V2Home from '../components/Sidebars/SideBarV2/V2-Sidebar-Components/Home/home';
import Notification from '../components/Sidebars/SideBarV2/V2-Sidebar-Components/Notifications/noti';
import EmailTemp from '../components/Sidebars/SideBarV2/V2-Sidebar-Components/EmailTemp/temp';

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
              <Route path="/email-temp" element={<EmailTemp />} />

              </Routes>



    </Layout>
  );
};

export default Dashboard;
