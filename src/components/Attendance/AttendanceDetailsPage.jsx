import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust import as per your project structure
import PiChart from './piChart'; // Adjust import based on your file structure

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

  useEffect(() => {
    const fetchAttendanceDetails = async () => {
      try {
        // Fetch user details to get full name
        const userDoc = await getDoc(doc(db, 'employeeDetails', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFullName(userData.fullName || 'Unknown');
        } else {
          setFullName('Unknown');
        }

        // Fetch all attendance documents for the user
        const attendanceRef = collection(db, 'employeeDetails', userId, 'attendance');
        const attendanceSnapshot = await getDocs(attendanceRef);

        const attendanceData = attendanceSnapshot.docs.map(doc => ({
          id: doc.id,
          date: doc.id, // Assuming `date` is the document ID
          status: doc.data().attendance,
        }));

        setAttendanceData(attendanceData);

        // Calculate present and absent counts
        let present = attendanceData.filter(entry => entry.status === 'present').length;
        let absent = attendanceData.filter(entry => entry.status === 'absent').length;
        setPresentCount(present);
        setAbsentCount(absent);

      } catch (error) {
        console.error('Error fetching attendance details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetails();
  }, [userId]);

  const handleShowPieChart = async () => {
    try {
      // Fetch individual attendance data for the user
      const userAttendanceRef = collection(db, 'employeeDetails', userId, 'attendance');
      const userAttendanceSnapshot = await getDocs(userAttendanceRef);
  
      const userAttendanceData = userAttendanceSnapshot.docs.map(doc => ({
        id: doc.id,
        date: doc.id, // Assuming `date` is the document ID
        status: doc.data().attendance,
      }));
  
      // Calculate present and absent counts
      let present = userAttendanceData.filter(entry => entry.status === 'present').length;
      let absent = userAttendanceData.filter(entry => entry.status === 'absent').length;
      setPresentCount(present);
      setAbsentCount(absent);
  
      // Set the monthly attendance data for the pie chart
      setMonthlyAttendanceData(userAttendanceData);
  
      setShowPieChartPopup(true); // Show the pie chart popup
    } catch (error) {
      console.error('Error fetching monthly attendance data:', error);
    }
  };
  

  const handleClosePieChart = () => {
    setShowPieChartPopup(false); // Close the pie chart popup
  };

  const fetchMonthlyAttendanceData = async (userId) => {
    // Example function to fetch monthly attendance data
    // Replace with your actual implementation to fetch data from Firestore or any API
    // For demo, returning mock data
    return [
      { month: 'January', present: 20, absent: 5 },
      { month: 'February', present: 18, absent: 7 },
      { month: 'March', present: 22, absent: 3 },
      // Add more months as needed
    ];
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
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Employee Attendance Details for {fullName}</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          style={{
            backgroundColor: '#f3f4f6',
            color: '#333',
            border: 'none',
            padding: '10px 20px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease',
            marginRight: '10px'
          }}
          onClick={() => navigate('/admin/user-attendance')}
        >
          Back to Attendance
        </button>
        <button
          style={{
            backgroundColor: '#4caf50',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'background-color 0.3s ease'
          }}
          onClick={handleShowPieChart}
        >
          Show Pie Chart
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ flex: '1' }}>
          <p><strong>Total Present:</strong> {presentCount}</p>
          <p><strong>Total Absent:</strong> {absentCount}</p>
        </div>
      </div>
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
            <button
              style={{
                backgroundColor: '#4caf50',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
                marginTop: '20px'
              }}
              onClick={handleClosePieChart}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDetailsPage;
