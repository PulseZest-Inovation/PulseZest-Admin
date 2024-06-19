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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

export default function AppDevelopment() {
  const [appData, setAppData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div style={{ overflow: 'auto', maxHeight: '500px' }}>
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
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(item)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for showing detailed view */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Details for {selectedItem?.fullName}</DialogTitle>
        <DialogContent>
          <Typography><strong>Email Address:</strong> {selectedItem?.email}</Typography>
          <Typography><strong>Website Name:</strong> {selectedItem?.websiteName}</Typography>
          <Typography><strong>Registration Date:</strong> {selectedItem?.registrationDate}</Typography>
          {/* Add more fields as needed */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
          {/* Add additional actions if required */}
        </DialogActions>
      </Dialog>
    </div>
  );
}
