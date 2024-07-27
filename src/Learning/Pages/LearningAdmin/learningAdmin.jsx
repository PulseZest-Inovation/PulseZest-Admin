import React, { useState } from 'react';
import ManageCategory from '../ManageCategory/index';
import ManageCourses from '../ManageCourses/index';
import UserList from '../StudentsData/index';
import ManageCategoriesCourses from '../CombinedC&C/index';
import SaleTimer from '../SaleTimer/saleTimer';

const LearningAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <h2>Manage Categories  <ManageCategory/> </h2>;
      case 'courses':
        return <h2>Manage Courses <ManageCourses/> </h2>;
      case 'students':
        return <h2>Students Data <UserList/> </h2>;
        case 'saleTimer':
          return <h2>Add Sale Timer <SaleTimer/> </h2>;
      case 'settings':
        return <h2>Combine Courses & Categories <ManageCategoriesCourses/>  </h2>;
      default:
        return <h2>Dashboard Content</h2>;
    }
  };

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#282c34',
    padding: '10px',
    borderBottom: '2px solid #61dafb'
  };

  const linkStyle = {
    color: 'white',
    padding: '10px 20px',
    textDecoration: 'none',
    fontSize: '18px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
    cursor: 'pointer'
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#61dafb',
    color: '#282c34'
  };

  const containerStyle = {
    padding: '20px'
  };

  return (
    <div>
      <nav style={navStyle}>
        <div
          style={activeTab === 'dashboard' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('dashboard')}
        >
        Manage Category
        </div>
        <div
          style={activeTab === 'courses' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('courses')}
        >
        Manage Courses
        </div>
        <div
          style={activeTab === 'settings' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('settings')}
        >
          Combine Corses & Category
        </div>
        <div
          style={activeTab === 'saleTimer' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('saleTimer')}
        >
         Add Sale Time
        </div>
        <div
          style={activeTab === 'students' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('students')}
        >
          Students
        </div>
       
      </nav>
      <div style={containerStyle}>
        {renderContent()}
      </div>
    </div>
  );
};

export default LearningAdmin;
