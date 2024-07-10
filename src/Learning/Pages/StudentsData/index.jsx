import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig'; // Adjust import as per your configuration
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';

const UserList = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersRef = collection(learningDb, 'users');
      const querySnapshot = await getDocs(usersRef);

      const userList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setUsers(userList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          All Users
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {users.map(user => (
              <Grid item xs={12} md={6} lg={4} key={user.id}>
                <Paper elevation={2} style={{ padding: '10px', height: '100%' }}>
                  <Typography variant="subtitle1"><strong>Email:</strong> {user.email}</Typography>
                  <Typography variant="subtitle1"><strong>Name:</strong> {user.name}</Typography>
                  <Typography variant="subtitle1"><strong>SUID:</strong> {user.suid}</Typography>
                  <Typography variant="subtitle1"><strong>User ID:</strong> {user.userId}</Typography>
                  {/* Add more details as needed */}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default UserList;
