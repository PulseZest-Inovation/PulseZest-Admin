import React, { useEffect, useState } from 'react';
import { getAnalytics } from 'firebase/analytics';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const HomePage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = getAnalytics();
        const userCount = await analytics.getTotalUsers();

        // Replace with other analytics data fetches as needed

        setAnalyticsData({
          totalUsers: userCount,
          // Add more analytics data here
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Firebase Analytics Dashboard
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <Paper style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="body1">
              {analyticsData ? analyticsData.totalUsers : 'Loading...'}
            </Typography>
          </Paper>
        </Grid>
        {/* Add more Grid items for other analytics data */}
      </Grid>
    </div>
  );
};

export default HomePage;
