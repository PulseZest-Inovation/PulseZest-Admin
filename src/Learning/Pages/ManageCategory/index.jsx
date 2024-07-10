import React, { useState, useEffect } from 'react';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig'; // Adjust the import according to your Firebase configuration
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [lastCid, setLastCid] = useState(0);
  const [categories, setCategories] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchLastCid();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(learningDb, 'categories'));
      const categoryList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoryList);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchLastCid = async () => {
    try {
      const querySnapshot = await getDocs(collection(learningDb, 'categories'));
      if (querySnapshot.docs.length > 0) {
        const lastCategory = querySnapshot.docs.reduce((prev, current) =>
          (prev.data().cid > current.data().cid) ? prev : current
        );
        const lastCidNumber = parseInt(lastCategory.data().cid.split('-')[1]);
        setLastCid(lastCidNumber);
      }
    } catch (error) {
      console.error('Error fetching last Cid:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty!');
      return;
    }
  
    const newCid = `cid:pulse-${String(lastCid + 1).padStart(3, '0')}`;
  
    try {
      const docRef = await addDoc(collection(learningDb, 'categories'), {
        name: categoryName,
        cid: newCid
      });
  
      const newCategoryId = docRef.id; // Get the auto-generated document ID
      await updateDoc(doc(learningDb, 'categories', newCategoryId), { id: newCategoryId }); // Update the document with its own ID
  
      setLastCid(lastCid + 1);
      setCategoryName('');
      toast.success('Category added successfully!');
      fetchCategories(); // Refresh category list after adding
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category. Please try again.');
    }
  };

  const handleEditCategory = async () => {
    try {
      const docRef = doc(learningDb, 'categories', editCategoryId);
      await updateDoc(docRef, {
        name: editCategoryName
      });
      toast.success('Category updated successfully!');
      setEditDialogOpen(false);
      fetchCategories(); // Refresh category list after updating
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category. Please try again.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const docRef = doc(learningDb, 'categories', id);
      await deleteDoc(docRef);
      toast.success('Category deleted successfully!');
      fetchCategories(); // Refresh category list after deleting
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category. Please try again.');
    }
  };

  const handleOpenEditDialog = (id, name) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
  };

  const handleCategoryNameChange = (event) => {
    setEditCategoryName(event.target.value);
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '100vh',
    backgroundColor: '#f4f4f9',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
    marginRight: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#61dafb',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '10px',
  };

  const headingStyle = {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
  };

  const categoryListStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    flex: '1',
  };

  const categoryItemStyle = {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const categoryNameStyle = {
    flex: '1',
    marginRight: '10px',
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h1 style={headingStyle}>Add Category</h1>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleAddCategory} style={buttonStyle}>
          Add Category
        </button>
      </div>
      <div style={categoryListStyle}>
        <h1 style={headingStyle}>Categories</h1>
        {categories.map(category => (
          <div key={category.id} style={categoryItemStyle}>
            <div style={categoryNameStyle}>{category.name}</div>
            <div>
              <button onClick={() => handleOpenEditDialog(category.id, category.name)} style={buttonStyle}>
                Edit
              </button>
              <button onClick={() => handleDeleteCategory(category.id)} style={{ ...buttonStyle, backgroundColor: '#f44336' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            type="text"
            fullWidth
            value={editCategoryName}
            onChange={handleCategoryNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditCategory} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default AddCategory;
