import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase'; // Adjust the path as per your project structure
import {
  Typography,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const docRef = doc(db, 'employeeDetails', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEmployeeDetails(data);
          // Initialize editable fields state with current values
          const initialEditableFields = {};
          Object.keys(data).forEach((key) => {
            initialEditableFields[key] = { value: data[key], editing: false };
          });
          setEditableFields(initialEditableFields);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [id]);

  if (!employeeDetails) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  const handleEditField = (key) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [key]: { ...prevFields[key], editing: true },
    }));
  };

  const handleSaveField = async (key) => {
    try {
      const docRef = doc(db, 'employeeDetails', id);
      await updateDoc(docRef, {
        [key]: editableFields[key].value,
      });
      setEditableFields((prevFields) => ({
        ...prevFields,
        [key]: { ...prevFields[key], editing: false },
      }));
      // Update employeeDetails immediately after successful save
      setEmployeeDetails((prevDetails) => ({
        ...prevDetails,
        [key]: editableFields[key].value,
      }));
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleCancelEdit = (key) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [key]: { ...prevFields[key], editing: false },
    }));
  };

  const handleAddField = async () => {
    try {
      const docRef = doc(db, 'employeeDetails', id);
      await updateDoc(docRef, {
        [newFieldKey]: newFieldValue,
      });
      setNewFieldKey('');
      setNewFieldValue('');
      // Update employeeDetails immediately after adding new field
      setEmployeeDetails((prevDetails) => ({
        ...prevDetails,
        [newFieldKey]: newFieldValue,
      }));
    } catch (error) {
      console.error('Error adding new field:', error);
    }
  };

  // Function to format Firestore Timestamps to readable dates
  const formatDate = (timestamp) => {
    const dateObj = timestamp.toDate(); // Convert Firestore Timestamp to Date object
    return dateObj.toLocaleDateString(); // Example of formatting, adjust as needed
  };

  // Function to handle opening URL in new tab
  const handleViewUrl = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" gutterBottom align="center">Employee Details</Typography>
      {employeeDetails.passportPhotoUrl && (
        <Avatar
          alt="Passport Photo"
          src={employeeDetails.passportPhotoUrl}
          sx={{ width: 100, height: 100, position: 'absolute', top: 20, left: 220 }}
        />
      )}
      <TableContainer component={Paper} style={{ marginBottom: '20px', marginTop: '120px' }}>
        <Table>
          <TableBody>
            {Object.keys(employeeDetails).map((key) => (
              <TableRow key={key}>
                <TableCell style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{key}</TableCell>
                <TableCell>
                  {editableFields[key] && editableFields[key].editing ? (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <TextField
                          value={editableFields[key].value}
                          onChange={(e) =>
                            setEditableFields((prevFields) => ({
                              ...prevFields,
                              [key]: { ...prevFields[key], value: e.target.value },
                            }))
                          }
                          fullWidth
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    // Check if it's a Timestamp and format it accordingly
                    typeof employeeDetails[key] === 'object' && employeeDetails[key].hasOwnProperty('seconds') ?
                      formatDate(employeeDetails[key]) :
                      (typeof employeeDetails[key] === 'string' && employeeDetails[key].startsWith('http')) ?
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleViewUrl(employeeDetails[key])}
                        >
                          View
                        </Button>
                        :
                        employeeDetails[key]
                  )}
                </TableCell>
                <TableCell>
                  {editableFields[key] && editableFields[key].editing ? (
                    <Grid container spacing={2} alignItems="center">
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={<SaveIcon />}
                          onClick={() => handleSaveField(key)}
                        >
                          Save
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size="small"
                          startIcon={<CancelIcon />}
                          onClick={() => handleCancelEdit(key)}
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleEditField(key)}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>Add New Field</TableCell>
              <TableCell colSpan={2}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TextField
                      label="Field Key"
                      value={newFieldKey}
                      onChange={(e) => setNewFieldKey(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Field Value"
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={handleAddField}
                    >
                      Add Field
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default EmployeeDetails;
