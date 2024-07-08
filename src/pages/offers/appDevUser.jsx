import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Assuming you have configured Firebase
import {  Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer,  TableRow, Paper, TextField, InputAdornment } from '@mui/material'; // Assuming you use Material-UI components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expand/collapse
import SearchIcon from '@mui/icons-material/Search'; // Icon for search

const AppDeveloperFormPage = () => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers/developerForm/appDeveloperForm'));
        const formsData = [];
        querySnapshot.forEach((doc) => {
          formsData.push({ id: doc.id, ...doc.data() });
        });
        setForms(formsData);
        setFilteredForms(formsData); // Initialize filteredForms with all forms
      } catch (error) {
        console.error('Error fetching forms: ', error);
      }
    };

    fetchForms();
  }, []);

  useEffect(() => {
    // Filter forms based on searchQuery whenever it changes
    const filteredResults = forms.filter(form =>
      form.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredForms(filteredResults);
  }, [searchQuery, forms]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const renderFormDetails = (form) => (
    <TableContainer component={Paper} className="mb-4">
      <Table aria-label="form details">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Full Name</TableCell>
            <TableCell>{form.fullname}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Email</TableCell>
            <TableCell>{form.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Phone Number</TableCell>
            <TableCell>{form.phonenumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Purpose</TableCell>
            <TableCell>{form.purpose}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">App Name</TableCell>
            <TableCell>{form.nameofapp}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Description</TableCell>
            <TableCell>{form.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Reference for App</TableCell>
            <TableCell>{form.referenceforapp}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Publish on Play Store</TableCell>
            <TableCell>{form.publish === 'yes' ? 'Yes' : 'No'}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Timestamp</TableCell>
            <TableCell>{form.timestamp && form.timestamp.toDate().toLocaleString()}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-4 flex items-center justify-between">
        <TextField
          id="search"
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
         <br></br>
         <br></br>
      </div>
      {filteredForms.map((form) => (
        <Accordion key={form.id} className="mb-4" style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`form-details-${form.id}-content`}
            id={`form-details-${form.id}-header`}
          >
            <Typography variant="h5" component="h2" className="text-xl font-bold">
              {form.fullname}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderFormDetails(form)}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default AppDeveloperFormPage;
