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
  Button
} from '@mui/material';

export default function WebDevelopment() {
  const [webData, setWebData] = useState([]);

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

  return (
    <div>
      <Typography variant="h4" gutterBottom align="center">
        Web Development Data
      </Typography>
      <TableContainer component={Paper} style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', overflowX: 'auto' }}>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Website Name</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {webData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
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
