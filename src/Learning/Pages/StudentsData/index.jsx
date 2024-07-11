import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig'; // Adjust import as per your configuration
import {Container,Typography,Paper,Box,CircularProgress,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,} from '@mui/material';

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
          <TableContainer component={Paper}>
            <Table aria-label="user table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>SUID</strong></TableCell>
                  <TableCell><strong>User ID</strong></TableCell>
                  {/* Add more headers as needed */}
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.suid}</TableCell>
                    <TableCell>{user.userId}</TableCell>
                    {/* Add more cells as needed */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default UserList;
