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

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employeeDetails'));
        const employeeList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore Timestamp to Date object
          dateOfRegistration: doc.data().dateOfRegistration.toDate()
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const fullName = employee.fullName ? employee.fullName.toLowerCase() : '';
    const email = employee.email ? employee.email.toLowerCase() : '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
      <Typography variant="h4" gutterBottom align="center">
        Employee Details
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
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.fullName}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                {/* Display formatted registration date */}
                <TableCell>{employee.dateOfRegistration.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    component={Link}
                    to={`/employee-details/${employee.id}`}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '10px' }} // Add some spacing between buttons
                  >
                    View Details
                  </Button>
                  <Button
                    component={Link}
                    to={`/manage-employee/${employee.id}`}
                    variant="contained"
                    color="secondary" // Use a different color for the "Manage" button
                  >
                    Manage
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

export default Employee;
