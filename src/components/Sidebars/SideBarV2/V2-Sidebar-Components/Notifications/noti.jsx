import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, Grid, Box, CircularProgress } from '@mui/material';
import { collection, getDocs, doc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../../Firebase/Firebase'; // Adjust the path as necessary
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SendIcon from '@mui/icons-material/Send'; // Import Send icon from MUI icons

const Notification = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for submit button

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employeeDetails'));
        const employeeList = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          employeeList.push({ id: doc.id, fullName: data.fullName });
        });
        setEmployees(employeeList);
      } catch (error) {
        toast.error('Error fetching employees.');
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeSelection = (employeeId) => {
    const currentIndex = selectedEmployees.indexOf(employeeId);
    const newSelectedEmployees = [...selectedEmployees];

    if (currentIndex === -1) {
      newSelectedEmployees.push(employeeId);
    } else {
      newSelectedEmployees.splice(currentIndex, 1);
    }

    setSelectedEmployees(newSelectedEmployees);
  };

  const handleSelectAll = () => {
    // Toggle select all logic
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      const allEmployeeIds = employees.map((employee) => employee.id);
      setSelectedEmployees(allEmployeeIds);
    }
  };

  const handleSendNotification = async () => {
    if (selectedEmployees.length === 0) {
      toast.warn('Please select at least one employee.');
      return;
    }

    if (notificationMessage.trim() === '') {
      toast.warn('Please type any message.');
      return;
    }

    setLoading(true); // Set loading state to true when sending notification

    // Prepare notification data
    const notificationData = {
      message: notificationMessage,
      timestamp: Timestamp.fromDate(new Date()),
      sound: 'notSeen' // Add sound field with 'notSeen' value
    };

    // Save notification to selected employees' documents
    try {
      const promises = selectedEmployees.map((employeeId) => {
        const employeeDocRef = doc(db, 'employeeDetails', employeeId);
        const notificationsCollectionRef = collection(employeeDocRef, 'notifications');
        return addDoc(notificationsCollectionRef, notificationData);
      });

      await Promise.all(promises);

      // Show success toast
      toast.success('Notification sent successfully.');
    } catch (error) {
      console.error('Error sending notification:', error.message);
      toast.error('Failed to send notification. Please try again.');
    } finally {
      setLoading(false); // Set loading state back to false
      setSelectedEmployees([]);
      setNotificationMessage('');
    }
  };

  return (
    <div>
      <ToastContainer />
      <Grid container spacing={2}>
        {/* Left side: Employee list */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: 2 }}>
            <h2>Employee List</h2>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedEmployees.length === employees.length}
                    onChange={handleSelectAll}
                  />
                }
                label="Select All"
              />
              {employees.map((employee) => (
                <FormControlLabel
                  key={employee.id}
                  control={
                    <Checkbox
                      checked={selectedEmployees.includes(employee.id)}
                      onChange={() => handleEmployeeSelection(employee.id)}
                    />
                  }
                  label={employee.fullName}
                />
              ))}
            </FormGroup>
          </Box>
        </Grid>

        {/* Right side: Notification message input */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pr: 2 }}>
            <h2>Notification Panel</h2>
            <TextField
              multiline
              rows={6}
              variant="outlined"
              placeholder="Enter notification message"
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              sx={{ marginTop: 2, width: '100%' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendNotification}
              sx={{ marginTop: 2 }}
              disabled={loading} // Disable button when loading is true
              startIcon={loading ? <CircularProgress size={24} /> : <SendIcon />} // Show progress or Send icon
            >
              Send Notification
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Notification;
