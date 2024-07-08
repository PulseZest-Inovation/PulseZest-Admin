import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { app } from '../../Firebase/Firebase'; // Adjust the import path as necessary

const ContactPage = () => {
  const db = getFirestore(app);
  const [contacts, setContacts] = useState([]);

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
  }, [db]);

  return (
    <Container maxWidth="lg" style={{ paddingTop: '3rem' }}>
      <Typography variant="h3" component="h1" gutterBottom style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Contact Us Entries
      </Typography>
      <Box style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </Box>
    </Container>
  );
};

const ContactCard = ({ contact }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ ...cardInnerStyle, ...(isHovered ? cardHoverStyle : {}) }}>
        <div style={cardFrontStyle}>
          <CardContent>
            <Typography variant="h5" component="div" style={cardTextStyle}>
              {contact.name}
            </Typography>
          </CardContent>
        </div>
        <div style={cardBackStyle}>
          <CardContent>
            <Table style={{ height: '100%', overflowY: 'auto' }}>
              <TableBody>
                <TableRow>
                  <TableCell style={tableCellStyle}>Name</TableCell>
                  <TableCell style={tableCellStyle}>{contact.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={tableCellStyle}>Email</TableCell>
                  <TableCell style={tableCellStyle}>{contact.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={tableCellStyle}>Message</TableCell>
                  <TableCell style={tableCellStyle}>
                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                      {contact.message}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

const cardStyle = {
  width: '400px', // Increased width
  height: '300px', // Increased height
  perspective: '1000px',
  marginBottom: '20px',
};

const cardInnerStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  textAlign: 'center',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
};

const cardFrontStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#e0e0e0', // Light grey color
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  borderRadius: '10px',
};

const cardBackStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#32cd32', // Lime green color
  boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
  borderRadius: '10px',
};

const cardHoverStyle = {
  transform: 'rotateY(180deg)',
};

const cardTextStyle = {
  color: '#000000',
  fontWeight: 'bold',
  textShadow: '0 0 5px #000000',
};

const tableCellStyle = {
  color: '#ffffff',
};

export default ContactPage;
