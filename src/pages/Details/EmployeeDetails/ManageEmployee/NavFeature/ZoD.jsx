import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import { db } from '../../../../../Firebase/Firebase'; // Adjust the path as necessary

const Zod = ({ userId, fullName, photoUrl }) => {
  const [zodCount, setZodCount] = useState(0);
  const [status, setStatus] = useState('');

  // Fetch Zod count and status from Firestore on component mount
  useEffect(() => {
    const fetchZodCount = async () => {
      try {
        const employeeRef = doc(db, 'employeeDetails', userId);
        const manageCollectionRef = collection(employeeRef, 'manage');
        const manageDocRef = doc(manageCollectionRef, userId);
        const docSnap = await getDoc(manageDocRef);
        
        if (docSnap.exists()) {
          const { zodCount, status } = docSnap.data();
          setZodCount(zodCount || 0);
          setStatus(status || 'notSeen'); // Set status from Firestore
        } else {
          setZodCount(0);
          setStatus('notSeen'); // Default status if document doesn't exist
          await setDoc(manageDocRef, { zodCount: 0, status: 'notSeen' }); // Create doc with default values
        }
      } catch (error) {
        console.error('Error fetching Zod count:', error);
      }
    };

    fetchZodCount();
  }, [userId]); // Run useEffect whenever userId changes

  const handleAddZod = async () => {
    const newZodCount = zodCount + 1;
    setZodCount(newZodCount);
    await updateZodCountInFirestore(newZodCount);
    await updateStatusInFirestore('notSeen');
  };

  const handleRemoveZod = async () => {
    if (zodCount > 0) {
      const newZodCount = zodCount - 1;
      setZodCount(newZodCount);
      await updateZodCountInFirestore(newZodCount);
      await updateStatusInFirestore('notSeen');
    }
  };

  const updateZodCountInFirestore = async (count) => {
    try {
      const employeeRef = doc(db, 'employeeDetails', userId);
      const manageCollectionRef = collection(employeeRef, 'manage');
      const manageDocRef = doc(manageCollectionRef, userId);

      // Check if the document exists
      const docSnap = await getDoc(manageDocRef);
      if (docSnap.exists()) {
        // Document exists, update it
        await updateDoc(manageDocRef, { zodCount: count });
      } else {
        // Document does not exist, set it (create)
        await setDoc(manageDocRef, { zodCount: count, status: 'notSeen' });
      }

      console.log('Zod count updated successfully!');
    } catch (error) {
      console.error('Error updating Zod count:', error);
    }
  };

  const updateStatusInFirestore = async (newStatus) => {
    try {
      const employeeRef = doc(db, 'employeeDetails', userId);
      const manageCollectionRef = collection(employeeRef, 'manage');
      const manageDocRef = doc(manageCollectionRef, userId);

      // Update status only if it's different from the current status
      if (newStatus !== status) {
        await updateDoc(manageDocRef, { status: newStatus });
        setStatus(newStatus);
        console.log('Status updated successfully!');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '20px' }}>
      {/* Avatar image on the left */}
      <div style={{ marginRight: '20px' }}>
        {photoUrl && <img src={photoUrl} alt={fullName} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />}
      </div>
      {/* User details and Zod count on the right */}
      <div>
        <Typography variant="h5" gutterBottom>
          User ID: {userId}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Full Name: {fullName}
        </Typography>
        <div>
          <Typography variant="h6" gutterBottom>
            Zod Count: {zodCount}
          </Typography>
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
        </div>
      </div>
    </div>
  );
};

export default Zod;
