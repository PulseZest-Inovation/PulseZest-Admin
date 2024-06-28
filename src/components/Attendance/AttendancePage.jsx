import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust import as per your project structure

const AttendancePage = () => {
  const navigate = useNavigate();
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeesAttendance = async () => {
      try {
        const employeesSnapshot = await getDocs(collection(db, 'employeeDetails'));

        const attendancePromises = employeesSnapshot.docs.map(async (employeeDoc) => {
          const userId = employeeDoc.id;
          const userData = employeeDoc.data(); // Assuming user data contains fullName

          // Directly access the attendance subcollection
          const attendanceRef = collection(db, 'employeeDetails', userId, 'attendance');
          const attendanceSnapshot = await getDocs(attendanceRef);

          // Example: Fetch attendance for today's date
          const today = new Date();
          const todayDateString = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;

          const todayAttendanceDoc = attendanceSnapshot.docs.find(doc => doc.id === todayDateString);

          if (todayAttendanceDoc) {
            return {
              userId,
              fullName: userData.fullName, // Assuming user data contains fullName
              status: todayAttendanceDoc.data().attendance,
            };
          } else {
            return {
              userId,
              fullName: userData.fullName, // Assuming user data contains fullName
              status: 'absent',
            };
          }
        });

        const attendanceResults = await Promise.all(attendancePromises);
        setEmployeesAttendance(attendanceResults);
      } catch (error) {
        console.error('Error fetching employees attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeesAttendance();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '1.5rem', color: '#333' }}>Loading attendance data...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center', color: '#333' }}>Employee Attendance</h1>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px' }}>
          <thead style={{ backgroundColor: '#f3f4f6', color: '#333', textTransform: 'uppercase', fontSize: '0.75rem', borderBottom: '2px solid #ddd' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left' }}>User ID</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>User Name</th>
              <th style={{ padding: '15px', textAlign: 'left' }}>Attendance Status</th>
              <th style={{ padding: '15px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody style={{ color: '#555', fontSize: '0.875rem' }}>
            {employeesAttendance.map((employee) => (
              <tr key={employee.userId} style={{ borderBottom: '1px solid #ddd', transition: 'background-color 0.3s ease' }}>
                <td style={{ padding: '15px', textAlign: 'left' }}>{employee.userId}</td>
                <td style={{ padding: '15px', textAlign: 'left' }}>{employee.fullName}</td>
                <td style={{ padding: '15px', textAlign: 'left', color: employee.status === 'present' ? '#4CAF50' : '#F44336' }}>{employee.status}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button
                    onClick={() => navigate(`/attendance-details/${employee.userId}`)}
                    style={{
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      borderRadius: '5px',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      
    </div>
  );
};

export default AttendancePage;
