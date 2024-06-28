import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/Firebase'; // Adjust the path as per your project structure
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

const Intern = () => {
  const [interns, setInterns] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'internDetails'));
        const internList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Ensure dateOfRegistration is valid and convert it to Date object
          const dateOfRegistration = data.dateOfRegistration ? new Date(data.dateOfRegistration) : null;
          return {
            id: doc.id,
            ...data,
            dateOfRegistration: dateOfRegistration instanceof Date ? dateOfRegistration : null
          };
        });
        setInterns(internList);
      } catch (error) {
        console.error('Error fetching interns:', error);
      }
    };

    fetchInterns();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredInterns = interns.filter((intern) => {
    const fullName = intern.fullName ? intern.fullName.toLowerCase() : '';
    const email = intern.email ? intern.email.toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Intern Details
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
              <TableCell>Phone Number</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInterns.map((intern) => (
              <TableRow key={intern.id}>
                <TableCell>{intern.fullName}</TableCell>
                <TableCell>{intern.email}</TableCell>
                <TableCell>{intern.phoneNumber}</TableCell>
                <TableCell>
                  {intern.dateOfRegistration ? intern.dateOfRegistration.toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/intern-details/${intern.id}`}
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
};

export default Intern;
