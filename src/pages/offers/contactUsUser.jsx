import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../Firebase/Firebase'; // Adjust the import path as necessary
import { DataGrid } from '@mui/x-data-grid';

const ContactPage = () => {
  const db = getFirestore(app);
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers', 'contact', 'contactUs'));
        const contactsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setContacts(contactsData);
      } catch (error) {
        console.error('Error fetching contact data: ', error);
      }
    };

    fetchContacts();

    // Auto-fetch every 30 seconds
    const interval = setInterval(fetchContacts, 30000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [db]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'message', headerName: 'Message', width: 400 },
  ];

  return (
    <Container maxWidth="lg" style={{ paddingTop: '2rem' }}>
      <Typography variant="h6" component="h1" gutterBottom>
        Contact Us Entries
      </Typography>
      <Box display="flex" justifyContent="center" mb={3}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filteredContacts}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </Container>
  );
};

export default ContactPage;
