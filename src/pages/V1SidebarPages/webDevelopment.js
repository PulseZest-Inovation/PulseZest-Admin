import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Adjust the path as per your project structure
import {
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  TextField
} from '@mui/material';

export default function WebDevelopment() {
  const [webData, setWebData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'webDevelopment'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWebData(data);
      } catch (error) {
        console.error('Error fetching web development data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = webData.filter((item) => {
    const fullName = item.fullName ? item.fullName.toLowerCase() : '';
    const email = item.email ? item.email.toLowerCase() : '';
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Web Development Data
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
                    to={`/web-development/${item.id}`}
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
