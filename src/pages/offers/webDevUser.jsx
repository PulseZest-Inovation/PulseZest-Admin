import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase/Firebase'; // Assuming you have configured Firebase
import { Typography, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TextField, InputAdornment } from '@mui/material'; // Assuming you use Material-UI components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Icon for expand/collapse
import SearchIcon from '@mui/icons-material/Search'; // Icon for search

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch users data initially and set up auto-fetching every 30 seconds
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'offers/developerForm/webDeveloperForm'));
        const usersData = [];
        querySnapshot.forEach((doc) => {
          usersData.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize filteredUsers with all users
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    // Fetch users initially
    fetchUsers();

    // Set up interval for auto-fetching every 30 seconds
    const interval = setInterval(fetchUsers, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Filter users based on search query whenever it changes
  useEffect(() => {
    const filteredResults = users.filter(user =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filteredResults);
  }, [searchQuery, users]);

  // Handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Render user details in a Table inside an Accordion
  const renderUserDetails = (user) => (
    <TableContainer component={Paper} className="mb-4 ">
      <Table aria-label="user details ">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Full Name</TableCell>
            <TableCell>{user.fullname}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Email</TableCell>
            <TableCell>{user.email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Phone Number</TableCell>
            <TableCell>{user.phonenumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Purpose</TableCell>
            <TableCell>{user.purpose}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Name of Website</TableCell>
            <TableCell>{user.nameofwebsite}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Description</TableCell>
            <TableCell>{user.description}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Reference for Website</TableCell>
            <TableCell>{user.referenceforwebsite}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Host Needed</TableCell>
            <TableCell>{user.host}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Custom Domain</TableCell>
            <TableCell>{user.customdomain}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Domain</TableCell>
            <TableCell>{user.domain}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Confirm Password</TableCell>
            <TableCell>{user.confirmpassword}</TableCell>
          </TableRow>
         
          <TableRow>
            <TableCell component="th" scope="row" className="font-bold">Timestamp</TableCell>
            <TableCell>{user.timestamp && user.timestamp.toDate().toLocaleString()}</TableCell>
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
      </div>
      {filteredUsers.map((user) => (
        <Accordion key={user.id} className="mb-4" style={{ backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`user-details-${user.id}-content`}
            id={`user-details-${user.id}-header`}
          >
            <Typography variant="h5" component="h2" className="text-xl font-bold">
              {user.fullname}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderUserDetails(user)}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default UsersPage;
