import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from '../../Firebase/Firebase'; // Adjust the path according to your project structure
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Container, Box, Typography } from '@mui/material';

const Demo = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'offers', 'demo', 'demoForm'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setData(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredData = data.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'fullName', headerName: 'Full Name', width: 200 },
    { field: 'number', headerName: 'Number', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
  ];

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom>Demo Requests</Typography>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          margin="normal"
        />
        <Box mt={2} style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredData}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
        </Box>
      </Box>
    </Container>
  );
}

export default Demo;
