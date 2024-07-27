import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/Firebase'; // Adjust path as needed
import { collection, getDocs, query } from 'firebase/firestore';
import { Card, CardContent, Typography, Grid, Container, Button, CircularProgress, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import PaymentIcon from '@mui/icons-material/Payment';
import WebinarData from './WebinarFormData/webinar';

// Styled Components
const SectionTitle = styled(Typography)`
  margin: 20px 0;
  font-weight: bold;
  text-align: center;
  color: #2196f3;
`;

const StyledCard = styled(Card)`
  margin: 10px 0;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

const CardHeader = styled(CardContent)`
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonGroup = styled('div')`
  text-align: center;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
position: relative;
left: -370px;  
margin: 0 10px;
`;

const PaymentIconButton = styled(IconButton)`
  margin-left: 10px;
`;

const PaymentDialogContent = styled(DialogContent)`
  padding: 20px;
  background: #2E3B55;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  & .MuiTypography-root {
    margin-bottom: 10px;
  }
`;

const ScrollableGrid = styled(Grid)`
  max-height: 50vh;
  overflow-y: auto;
`;

const formatAmount = (amountInPaise) => {
  return (amountInPaise / 100);
};

const FormsData = () => {
  const [view, setView] = useState('intern'); // State to manage view
  const [internData, setInternData] = useState([]);
  const [webinarData, setWebinarData] = useState(null);
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedInternId, setSelectedInternId] = useState(null); // Track selected intern for payment details

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (view === 'intern') {
          // Fetch intern form data
          const internQuery = query(collection(db, 'forms', 'internForm', 'internForms'));
          const internSnapshot = await getDocs(internQuery);
          if (internSnapshot.empty) {
            throw new Error('No intern form data found');
          }

          const internDocs = internSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setInternData(internDocs);

          // Fetch payment data for all intern forms
          for (const internDoc of internDocs) {
            const paymentQuery = collection(db, 'forms', 'internForm', 'internForms', internDoc.id, 'payment');
            const paymentSnapshot = await getDocs(paymentQuery);
            if (!paymentSnapshot.empty) {
              const paymentDocs = paymentSnapshot.docs.map(doc => doc.data());
              if (paymentDocs.length > 0) {
                setPaymentData(prev => ({ ...prev, [internDoc.id]: paymentDocs[0] }));
              }
            }
          }
        } else if (view === 'webinar') {
          // Fetch webinar form data
          const webinarQuery = query(collection(db, 'forms', 'webinarForm', 'webinarForms'));
          const webinarSnapshot = await getDocs(webinarQuery);
          if (webinarSnapshot.empty) {
            throw new Error('No webinar form data found');
          }

          const webinarDocs = webinarSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (webinarDocs.length > 0) {
            setWebinarData(webinarDocs[0]);
          } else {
            throw new Error('No webinar data found');
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err); // Log detailed error
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view]);

  const handleOpenPaymentDialog = (internId) => {
    setSelectedInternId(internId);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setSelectedInternId(null);
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress color="primary" />
      </Container>
    );
  }

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  return (
    <Container>
      <ButtonGroup>
        <StyledButton
          variant={view === 'intern' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setView('intern')}
        >
          Intern Form
        </StyledButton>
        <StyledButton
          variant={view === 'webinar' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setView('webinar')}
        >
          Webinar Form
        </StyledButton>
      </ButtonGroup>

      <SectionTitle variant="h4">{view === 'intern' ? 'Intern Form Details' : 'Webinar Form Details'}</SectionTitle>
      <ScrollableGrid container spacing={3}>
        {view === 'intern' && internData.map(intern => (
          <Grid item xs={12} key={intern.id}>
            <StyledCard>
              <CardHeader>
                <Typography variant="h6">Intern Information</Typography>
                <PaymentIconButton
                  color="primary"
                  onClick={() => handleOpenPaymentDialog(intern.id)}
                >
                  <PaymentIcon />
                </PaymentIconButton>
              </CardHeader>
              <CardContent>
                <Typography><strong>Name:</strong> {intern.name}</Typography>
                <Typography><strong>Number:</strong> {intern.number}</Typography>
                <Typography><strong>College:</strong> {intern.college}</Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
        {view === 'webinar' && webinarData && (
          <Grid item xs={12}>
            <StyledCard>
              <CardHeader>
                <Typography variant="h6">Webinar Information</Typography>
              </CardHeader>
             
             
             <WebinarData/>


            </StyledCard>
          </Grid>
        )}
      </ScrollableGrid>

      {/* Payment Details Dialog */}
      <Dialog open={openPaymentDialog} onClose={handleClosePaymentDialog}>
        <DialogTitle>Intern Payment Details</DialogTitle>
        <PaymentDialogContent>
          {selectedInternId && paymentData[selectedInternId] ? (
            <>
              <Typography><strong>Amount:</strong> ₹{formatAmount(paymentData[selectedInternId].amount)}</Typography>
              <Typography><strong>Currency:</strong> {paymentData[selectedInternId].currency}</Typography>
              <Typography><strong>Payment Date:</strong> {new Date(paymentData[selectedInternId].paymentDate).toLocaleDateString()}</Typography>
              <Typography><strong>Payment ID:</strong> {paymentData[selectedInternId].paymentId}</Typography>
              <Typography><strong>Status:</strong> {paymentData[selectedInternId].status}</Typography>
            </>
          ) : (
            <Typography>No payment data available</Typography>
          )}
        </PaymentDialogContent>
      </Dialog>
    </Container>
  );
};

export default FormsData;