import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust import as per your project structure
import PiChart from './piChart'; // Adjust import based on your file structure
import { Button, Select, MenuItem, FormControl, InputLabel, Grid } from '@mui/material'; // Import Material-UI components

const AttendanceDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [showPieChartPopup, setShowPieChartPopup] = useState(false); // State for showing/hiding the pie chart popup
  const [monthlyAttendanceData, setMonthlyAttendanceData] = useState([]); // State for monthly attendance data
  const [selectedMonth, setSelectedMonth] = useState(''); // Default to empty string for all months
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'employeeDetails', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName || 'Unknown');
        } else {
          setFullName('Unknown');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setFullName('Unknown');
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      setLoading(true);
      try {
        const attendanceRef = collection(db, 'employeeDetails', userId, 'attendance');
        const attendanceSnapshot = await getDocs(attendanceRef);
  
        const attendanceData = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.id, // Assuming `date` is the document ID in d-m-yyyy format
          status: doc.data().attendance,
        }));
  
        // Filter data based on the selected month and year
        const filteredData = attendanceData.filter(entry => {
          if (!selectedMonth) {
            return true; // Show all data if no specific month is selected
          }
          const [day, month, year] = entry.date.split('-').map(Number);
          return month === parseInt(selectedMonth, 10) && year === selectedYear;
        });
  
        setAttendanceData(filteredData);
  
        const present = filteredData.filter(entry => entry.status === 'present').length;
        const absent = filteredData.filter(entry => entry.status === 'absent').length;
        setPresentCount(present);
        setAbsentCount(absent);
      } catch (error) {
        console.error('Error fetching attendance details:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendanceDetails();
  }, [userId, selectedMonth, selectedYear]);
  

  const handleShowPieChart = () => {
    setShowPieChartPopup(true);
    setMonthlyAttendanceData(attendanceData);
  };

  const handleClosePieChart = () => {
    setShowPieChartPopup(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  if (loading) {
    return (
      <div>
        <p style={{ fontSize: '1.5rem', textAlign: 'center', marginTop: '50px' }}>Loading attendance details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Attendance Details for {fullName}</h1>
      <Grid container justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Button
          variant="outlined"
          style={{ marginRight: '10px' }}
          onClick={() => navigate('/admin/user-attendance')}
        >
          Back to Attendance
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: '#4caf50', color: '#fff' }}
          onClick={handleShowPieChart}
        >
          Show Pie Chart
        </Button>
      </Grid>
      <Grid container justifyContent="space-between" marginBottom="10px">
        <Grid item style={{ flex: '1' }}>
          <p><strong>Total Present:</strong> {presentCount}</p>
          <p><strong>Total Absent:</strong> {absentCount}</p>
        </Grid>
      </Grid>
      <Grid container justifyContent="space-between" marginBottom="20px">
        <Grid item>
          <FormControl variant="standard" style={{ minWidth: 200 }}>
            <InputLabel id="month-label">Select Month</InputLabel>
            <Select
              labelId="month-label"
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              <MenuItem value="">All Months</MenuItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                <MenuItem key={month} value={month}>{new Date(0, month - 1).toLocaleString('default', { month: 'long' })}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="standard" style={{ minWidth: 200 }}>
            <InputLabel id="year-label">Select Year</InputLabel>
            <Select
              labelId="year-label"
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflowX: 'auto' }}>
        <thead style={{ backgroundColor: '#f3f4f6', color: '#333', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          <tr>
            <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody style={{ color: '#555', fontSize: '0.875rem' }}>
          {attendanceData.map((attendance) => (
            <tr key={attendance.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '15px', textAlign: 'left' }}>{attendance.date}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{attendance.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pie Chart Popup */}
      {showPieChartPopup && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: '999', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', maxWidth: '80%', maxHeight: '80%', overflow: 'auto' }}>
            <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '20px' }}>Pie Chart</h2>
            <PiChart data={monthlyAttendanceData} />
            <Button
              variant="contained"
              style={{ backgroundColor: '#4caf50', color: '#fff', marginTop: '20px' }}
              onClick={handleClosePieChart}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetailsPage;
