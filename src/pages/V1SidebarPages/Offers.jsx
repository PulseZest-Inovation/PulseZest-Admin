import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase'; // Adjust the path as necessary
import { collection, updateDoc, doc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';
import styled from 'styled-components';
import WebDevUserDataFetch from "../offers/webDevUser";
import AppDevUserDataFetch from "../offers/appDevUser";
import ContactUsDataFetch from "../offers/contactUsUser";
import Demo from '../offers/demo';

const PageContainer = styled.div`
  padding: 20px;
  height: 100vh; /* Set the container to full viewport height */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const OffersList = styled.div`
  margin-top: 20px;
  padding-right: 20px; /* Adjusted padding */
`;

const OfferItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => {
    switch (props.status) {
      case 'approved':
        return '#6AF316';
      case 'open':
        return '#BBDEFB';
      case 'pending':
        return '#F3E316';
      case 'closed':
        return '#E76245';
      default:
        return '#FFFFFF';
    }
  }};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: #333;
  transition: background-color 0.3s ease; /* Smooth transition for background-color */

  position: relative;
  overflow: hidden;
  &:after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(30deg);
    opacity: 0;
    transition: all 0.5s;
  }
  &:hover:after {
    opacity: 1;
    top: -30%;
    left: -30%;
  }
`;



const SearchBarContainer = styled.div`
  margin-bottom: 20px;
`;

const SearchBar = styled(TextField)`
  width: 300px;
`;

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [selectedOption, setSelectedOption] = useState('Phone Proposals');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleMouseEnter = (index) => setHoveredIndex(index);
  const handleMouseLeave = () => setHoveredIndex(null);

  const linkStyle = {
    cursor: 'pointer',
    padding: '10px 20px',
    textDecoration: 'none',
    color: '#fff',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    margin: '0 5px',
    fontSize: '16px',
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  };
  
  const linkHoverStyle = {
    backgroundColor: '#555',
  };
  
  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '60px',
    backgroundColor: '#333',
    color: '#fff',
    padding: '0 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #444',
  };

  useEffect(() => {
    const fetchOffers = async () => {
      const offersRef = collection(db, 'offers', 'proposal', 'proposals');
      const q = query(offersRef, orderBy('timestamp', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const offersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(offersList);
        // Set filtered offers initially to all offers
        setFilteredOffers(offersList);
      });

      return unsubscribe;
    };

    fetchOffers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const offerDoc = doc(db, 'offers', 'proposal', 'proposals', id);
    await updateDoc(offerDoc, { status: newStatus });
    setOffers((prevOffers) =>
      prevOffers.map((offer) => (offer.id === id ? { ...offer, status: newStatus } : offer))
    );
    setFilteredOffers((prevOffers) =>
      prevOffers.map((offer) => (offer.id === id ? { ...offer, status: newStatus } : offer))
    );
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = offers.filter((offer) =>
      offer.phoneNumber.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOffers(filtered);
  };

  const renderContent = () => {
    switch (selectedOption) {
      case 'Phone Proposals':
        return (
          <>
          <br></br>
            <SearchBarContainer>
              <SearchBar
                variant="outlined"
                label="Search by Phone Number"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchBarContainer>
            <OffersList>
              {filteredOffers.length === 0 ? (
                <p>No offers available</p>
              ) : (
                filteredOffers.map((offer) => (
                  <OfferItem key={offer.id} status={offer.status}>
                    <div>
                      <p>Phone Number: {offer.phoneNumber}</p>
                      <p>Status: {offer.status}</p>
                      <p>Additional Fields:</p>
                      {/* Render additional fields as needed */}
                    </div>
                    <FormControl variant="outlined" size="small">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={offer.status}
                        onChange={(e) => handleStatusChange(offer.id, e.target.value)}
                        label="Status"
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="approved">Approved</MenuItem>
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="closed">Closed</MenuItem>
                      </Select>
                    </FormControl>
                  </OfferItem>
                ))
              )}
            </OffersList>
          </>
        );
      case 'Web Form':
        return <div><h1 className="text-3xl font-bold mb-4 text-center">Web Form details here </h1><WebDevUserDataFetch/> </div>; 
      case 'App Form':
        return <div><h1 className="text-3xl font-bold mb-4 text-center">App Form details here </h1> <AppDevUserDataFetch/></div>; 
      case 'Contact Us Form':
        return <div><h1 className="text-3xl font-bold mb-4 text-center"> </h1> <ContactUsDataFetch/> </div>;
        case 'School Application Demo':
          return <div><h1 className="text-3xl font-bold mb-4 text-center"> </h1> <Demo/> </div>;  
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <u>    <h1>Offers Section</h1></u>
      <div style={navContainerStyle}>
      <div 
        style={hoveredIndex === 0 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
        onMouseEnter={() => handleMouseEnter(0)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedOption('Phone Proposals')}
      >
        Phone Proposals
      </div>
      <div 
        style={hoveredIndex === 1 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
        onMouseEnter={() => handleMouseEnter(1)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedOption('Web Form')}
      >
        Web Form
      </div>
      <div 
        style={hoveredIndex === 2 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
        onMouseEnter={() => handleMouseEnter(2)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedOption('App Form')}
      >
        App Form
      </div>
      <div 
        style={hoveredIndex === 3 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
        onMouseEnter={() => handleMouseEnter(3)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedOption('Contact Us Form')}
      >
        Contact Us Form
      </div>
      <div 
        style={hoveredIndex === 4 ? { ...linkStyle, ...linkHoverStyle } : linkStyle}
        onMouseEnter={() => handleMouseEnter(4)}
        onMouseLeave={handleMouseLeave}
        onClick={() => setSelectedOption('Demo Form')}
      >
       Demo Form
      </div>
    </div>
      {renderContent()}
    </PageContainer>
  );
};

export default Offers;
