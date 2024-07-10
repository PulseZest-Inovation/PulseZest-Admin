import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AddCourse from '../../Components/Courses/AddCourse/AddCourse';
import EditCourses from '../../Components/Courses/EditCourses/EditCourses';

const Main = () => {
  const [activeTab, setActiveTab] = useState('addCourse'); // State to manage active tab

  const renderContent = () => {
    switch (activeTab) {
      case 'addCourse':
        return <AddCourse />;
      case 'editCourses':
        return <EditCourses />;
      default:
        return null;
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button
            variant={activeTab === 'addCourse' ? 'contained' : 'text'}
            onClick={() => setActiveTab('addCourse')}
            style={{ color: 'white', marginRight: '20px' }}
          >
            Add Course
          </Button>
          <Button
            variant={activeTab === 'editCourses' ? 'contained' : 'text'}
            onClick={() => setActiveTab('editCourses')}
            style={{ color: 'white' }}
          >
            Edit Courses
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f4f4f9' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default Main;
