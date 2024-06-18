import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase'; // Adjust the path as per your project structure
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Typography,
  Button,
  TextField
} from '@mui/material';

export default function AppDevelopment() {
  const [appData, setAppData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appDevelopment'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAppData(data);
      } catch (error) {
        console.error('Error fetching app development data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = appData.filter((item) => {
    const fullName = item.fullName ? item.fullName.toLowerCase() : '';
    const email = item.email ? item.email.toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        App Development Data
      </Typography>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email Address</TableCell>
              <TableCell>Website Name</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.websiteName}</TableCell>
                <TableCell>{item.registrationDate}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/app-development/${item.id}`}
                    variant="contained"
                    color="primary"
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
