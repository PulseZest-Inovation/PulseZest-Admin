import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust import as per your project structure

const AttendanceDetailsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);

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
          date: doc.id,
          status: doc.data().attendance,
        }));

        setAttendanceData(attendanceData);
      } catch (error) {
        console.error('Error fetching attendance details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceDetails();
  }, [userId]);

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
      <div style={{ display: 'flex', justifyContent: 'start', marginTop: '20px' }}>
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
          }}
          onClick={() => navigate('/admin/user-attendance')}
        >
          Back to Attendance
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflowX: 'auto', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f3f4f6', color: '#333', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          <tr>
            <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody style={{ color: '#555', fontSize: '0.875rem' }}>
          {attendanceData.map((attendance) => (
            <tr key={attendance.date} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '15px', textAlign: 'left' }}>{attendance.date}</td>
              <td style={{ padding: '15px', textAlign: 'left' }}>{attendance.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDetailsPage;
