import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig'; // Adjust import as per your configuration
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageCategoriesCourses = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchCourses();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log("Fetching categories...");
      const querySnapshot = await getDocs(collection(learningDb, 'categories'));
      const categoriesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Categories fetched: ", categoriesList);
      setCategories(categoriesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      console.log("Fetching courses...");
      const querySnapshot = await getDocs(collection(learningDb, 'courses'));
      const coursesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Courses fetched: ", coursesList);
      setCourses(coursesList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategoryId(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourses(event.target.value);
  };

  const handleAssignCourses = async () => {
    try {
      console.log("Assigning courses to category...");
      const categoryRef = doc(learningDb, 'categories', selectedCategoryId);
      const categoryDoc = await getDoc(categoryRef);

      if (!categoryDoc.exists()) {
        console.error('Category document does not exist');
        return;
      }

      const currentCourses = categoryDoc.data().courses || [];
      const updatedCourses = [...new Set([...currentCourses, ...selectedCourses])]; // Ensure uniqueness

      await updateDoc(categoryRef, { courses: updatedCourses });
      fetchCategories(); // Refresh category list after updating
      console.log("Courses assigned successfully!");

      // Reset fields
      setSelectedCategoryId('');
      setSelectedCourses([]);

      toast.success('Courses assigned successfully!');
    } catch (error) {
      console.error('Error assigning courses to category:', error);
      toast.error('Error assigning courses to category.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" style={{ marginTop: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <ToastContainer />
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h4" gutterBottom>
          Manage Categories and Courses
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="category-label">Select Category</InputLabel>
              <Select
                labelId="category-label"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
              >
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth style={{ marginBottom: '16px' }}>
              <InputLabel id="course-label">Select Courses</InputLabel>
              <Select
                labelId="course-label"
                multiple
                value={selectedCourses}
                onChange={handleCourseChange}
                renderValue={(selected) => selected.join(', ')}
              >
                {courses.map(course => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAssignCourses}
                disabled={!selectedCategoryId || selectedCourses.length === 0}
              >
                Assign Courses
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ManageCategoriesCourses;
