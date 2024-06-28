import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../Firebase/Firebase'; // Adjust the path as per your project structure
import { Typography, Table, TableBody, TableCell, TableContainer,   TableRow, Paper, TextField, Button, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

export default function WebDevelopmentDetail() {
  const { id } = useParams();
  const [webDetails, setWebDetails] = useState(null);
  const [editableFields, setEditableFields] = useState({});
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const docRef = doc(db, 'webDevelopment', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setWebDetails(data);
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
        console.error('Error fetching web development details:', error);
      }
    };

    fetchDetails();
  }, [id]);

  if (!webDetails) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  // Get keys of webDetails and sort them alphabetically
  const sortedKeys = Object.keys(webDetails).sort((a, b) => a.localeCompare(b));

  const handleEditField = (key) => {
    setEditableFields((prevFields) => ({
      ...prevFields,
      [key]: { ...prevFields[key], editing: true },
    }));
  };

  const handleSaveField = async (key) => {
    try {
      const docRef = doc(db, 'webDevelopment', id);
      await updateDoc(docRef, {
        [key]: editableFields[key].value,
      });
      setEditableFields((prevFields) => ({
        ...prevFields,
        [key]: { ...prevFields[key], editing: false },
      }));
      // Update webDetails immediately after successful save
      setWebDetails((prevDetails) => ({
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
      const docRef = doc(db, 'webDevelopment', id);
      await updateDoc(docRef, {
        [newFieldKey]: newFieldValue,
      });
      setNewFieldKey('');
      setNewFieldValue('');
      // Update webDetails immediately after adding new field
      setWebDetails((prevDetails) => ({
        ...prevDetails,
        [newFieldKey]: newFieldValue,
      }));
    } catch (error) {
      console.error('Error adding new field:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <Typography variant="h4" gutterBottom align="center">Web Development Details</Typography>
      <TableContainer component={Paper} style={{ marginBottom: '20px' }}>
        <Table>
          <TableBody>
            {sortedKeys.map((key) => (
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
                    webDetails[key]
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
}
