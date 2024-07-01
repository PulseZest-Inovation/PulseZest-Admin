import React, { useEffect, useState } from 'react';
import { db } from '../Firebase/Firebase'; // Adjust the path as necessary
import { collection, updateDoc, doc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import styled from 'styled-components';

// Styled components
const PageContainer = styled.div`
  padding: 20px;
`;

const ProposalList = styled.div`
  margin-top: 20px;
  max-height: 400px; /* Set a maximum height for the list */
  overflow-y: auto; /* Enable vertical scrolling */
`;

const ProposalItem = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => {
    switch (props.status) {
      case 'approved':
        return '#6AF316'; // Light green for approved
      case 'open':
        return '#BBDEFB'; // Light blue for open
      case 'pending':
        return '#F3E316'; // Light yellow for pending
      case 'closed':
        return '#E76245'; // Light red for closed
      default:
        return '#FFFFFF'; // Default color
    }
  }};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add box shadow for a subtle effect */
  font-weight: bold; /* Make all text bold */
  color: #333; /* Darken text color for better contrast */

  /* Shine effect */
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

const Proposals = () => {
  const [proposals, setProposals] = useState([]);

  // Fetch proposals from Firestore, ordered by creation time (latest first)
  useEffect(() => {
    const proposalCollection = collection(db, 'proposals');
    const q = query(proposalCollection, orderBy('timestamp', 'desc')); // Order by creation time descending
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const proposalList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProposals(proposalList);
    });

    return () => unsubscribe();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    const proposalDoc = doc(db, 'proposals', id);
    await updateDoc(proposalDoc, { status: newStatus });
    setProposals((prevProposals) =>
      prevProposals.map((proposal) => (proposal.id === id ? { ...proposal, status: newStatus } : proposal))
    );
  };

  return (
    <PageContainer>
      <h1>Proposals</h1>
      <ProposalList>
        {proposals.map((proposal) => (
          <ProposalItem key={proposal.id} status={proposal.status}>
            <div>
              <p>Phone Number: {proposal.phoneNumber}</p>
              <p>Status: {proposal.status}</p>
            </div>
            <FormControl variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={proposal.status}
                onChange={(e) => handleStatusChange(proposal.id, e.target.value)}
                label="Status"
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </ProposalItem>
        ))}
      </ProposalList>
    </PageContainer>
  );
};

export default Proposals;
