import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';

const PiChart = ({ data, onClose }) => {
  const totalPresent = data.filter(entry => entry.status === 'present').length;
  const totalAbsent = data.filter(entry => entry.status === 'absent').length;
  const totalLeave = data.filter(entry => entry.status === 'leave').length;
  
  const totalEntries = totalPresent + totalAbsent + totalLeave;

  // Calculate percentages
  const presentPercentage = ((totalPresent / totalEntries) * 100).toFixed(2);
  const absentPercentage = ((totalAbsent / totalEntries) * 100).toFixed(2);
  const leavePercentage = ((totalLeave / totalEntries) * 100).toFixed(2);

  const pieChartData = [
    { name: 'Present', value: totalPresent },
    { name: 'Absent', value: totalAbsent },
    { name: 'Leave', value: totalLeave }
  ];

  const COLORS = ['#4caf50', '#f44336', '#ffeb3b']; // Colors for Present, Absent, and Leave

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', backgroundColor: '#483d8b', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="value"
          data={pieChartData}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          label
        >
          {
            pieChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px', padding: '0 20px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>Attendance Summary</p>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#9932cc', borderRadius: '5px', padding: '10px' }}>
          <div style={{ flex: '1', padding: '10px' }}>
            <p style={{ fontSize: '1rem',fontWeight: 'bold' ,marginBottom: '5px', color: '#4caf50' }}>Total Present</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>{totalPresent} ({presentPercentage}%)</p>
          </div>
          <div style={{ flex: '1', padding: '10px' }}>
            <p style={{ fontSize: '1rem',fontWeight: 'bold' ,marginBottom: '5px', color: '#f44336' }}>Total Absent</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>{totalAbsent} ({absentPercentage}%)</p>
          </div>
          <div style={{ flex: '1', padding: '10px' }}>
            <p style={{ fontSize: '1rem',fontWeight: 'bold' ,marginBottom: '5px', color: '#ffeb3b' }}>Total Leave</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0' }}>{totalLeave} ({leavePercentage}%)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiChart;
