import React, { useState, useEffect } from 'react';
import { db } from '../../../../../Firebase/Firebase'; // Adjust the path as necessary
import { collection, getDocs, doc, getDoc, updateDoc,setDoc } from 'firebase/firestore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const Zod = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [zodCount, setZodCount] = useState(0);

  // Fetch employee details from Firestore
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'employeeDetails'));
        const employeeData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeeData);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleClickOpen = async (employee) => {
    setSelectedEmployee(employee);
    try {
      const employeeRef = doc(db, 'employeeDetails', employee.id);
      const manageCollectionRef = collection(employeeRef, 'manage');
      const manageDocRef = doc(manageCollectionRef, employee.id);
      const docSnap = await getDoc(manageDocRef);
      if (docSnap.exists()) {
        setZodCount(docSnap.data().zodCount || 0);
      } else {
        setZodCount(0);
      }
    } catch (error) {
      console.error('Error fetching Zod count:', error);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddZod = () => {
    setZodCount(zodCount + 1);
  };

  const handleRemoveZod = () => {
    if (zodCount > 0) {
      setZodCount(zodCount - 1);
    }
  };

  const handleSaveZod = async () => {
    try {
      const employeeRef = doc(db, 'employeeDetails', selectedEmployee.id);
      const manageCollectionRef = collection(employeeRef, 'manage');
      const manageDocRef = doc(manageCollectionRef, selectedEmployee.id);
  
      // Check if the document exists
      const docSnap = await getDoc(manageDocRef);
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(manageDocRef, { zodCount });
      } else {
        // Document does not exist, set it (create)
        await setDoc(manageDocRef, { zodCount });
      }
  
      console.log('Zod count updated successfully!');
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, zodCount } : emp
        )
      );
      handleClose();
    } catch (error) {
      console.error('Error updating Zod count:', error);
    }
  };
  

  return (
    <div>
      <h1>zod</h1>
      {loading ? (
        <p>Loading employees...</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Full Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map(employee => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.id}</TableCell>
                  <TableCell>{employee.fullName}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleClickOpen(employee)}
                    >
                      Manage Zod
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Manage Zod</DialogTitle>
        <DialogContent>
          <TextField
            label="Zod Count"
            type="number"
            value={zodCount}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleAddZod} color="primary" variant="contained">
            Add Zod
          </Button>
          <Button
            onClick={handleRemoveZod}
            color="secondary"
            variant="contained"
            disabled={zodCount === 0}
            style={{ marginLeft: '10px' }}
          >
            Remove Zod
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveZod} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Zod;
