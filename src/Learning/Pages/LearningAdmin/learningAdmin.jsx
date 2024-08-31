import React, { useState } from 'react';
import ManageCategory from '../ManageCategory/index';
import ManageCourses from '../ManageCourses/index';
import UserList from '../StudentsData/index';
import ManageCategoriesCourses from '../CombinedC&C/index';
import SaleTimer from '../SaleTimer/saleTimer';
import Duration$Coupon from '../CourseDuration&Coupon/page';
import Comment from '../../Components/CourseComments/comment';

const LearningAdmin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <h2>Manage Categories <ManageCategory /> </h2>;
      case 'courses':
        return <h2>Manage Courses <ManageCourses /> </h2>;
      case 'students':
        return <h2>Students Data <UserList /> </h2>;
      case 'saleTimer':
        return <h2>Add Sale Timer <SaleTimer /> </h2>;
      case 'Duration$Coupon':
        return <h2>Duration & Coupon <Duration$Coupon /> </h2>;
      case 'settings':
        return <h2>Combine Courses & Categories <ManageCategoriesCourses /> </h2>;
        case 'comments':
          return <h2>Comments <Comment /> </h2>;

      // Add more cases as needed for other tabs
      default:
        return <h2>Dashboard Content</h2>;
    }
  };

  // Determine the screen width
  const screenWidth = window.innerWidth;

  // Responsive styles
  const navStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: screenWidth < 768 ? 'center' : 'space-around',
    alignItems: 'center',
    backgroundColor: '#282c34',
    padding: '10px',
    borderBottom: '2px solid #61dafb',
  };

  const linkStyle = {
    color: 'white',
    padding: screenWidth < 768 ? '8px 12px' : '10px 20px',
    textDecoration: 'none',
    fontSize: screenWidth < 480 ? '12px' : screenWidth < 768 ? '14px' : '16px',
    borderRadius: '5px',
    transition: 'background-color 0.3s, color 0.3s',
    cursor: 'pointer',
    margin: '5px',
  };

  const activeLinkStyle = {
    ...linkStyle,
    backgroundColor: '#61dafb',
    color: '#282c34',
  };

  const containerStyle = {
    padding: '20px',
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
          Combine Courses & Categories
        </div>
        <div
          style={activeTab === 'saleTimer' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('saleTimer')}
        >
          Add Sale Timer
        </div>
        <div
          style={activeTab === 'Duration$Coupon' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('Duration$Coupon')}
        >
          Duration & Coupon
        </div>
        <div
          style={activeTab === 'students' ? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('students')}
        >
          Students
        </div>
        <div
          style={activeTab === 'comments'? activeLinkStyle : linkStyle}
          onClick={() => setActiveTab('comments')}
        >
          Comments
        </div>
      </nav>
      <div style={containerStyle}>
        {renderContent()}
      </div>
    </div>
  );
};

export default LearningAdmin;
