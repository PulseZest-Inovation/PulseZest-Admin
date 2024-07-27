import React, { useState, useEffect } from 'react';
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig';
import { collection, getDocs, doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { Container, Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Button, Grid, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Save as SaveIcon, LiveTv as LiveTvIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseSalePage = () => {
  const [courses, setCourses] = useState([]);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [saleTime, setSaleTime] = useState('');
  const [price, setPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const coursesCol = collection(learningDb, 'courses');
        const coursesSnapshot = await getDocs(coursesCol);
        const coursesList = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesList);
        setDisplayedCourses(coursesList);
      } catch (error) {
        toast.error('Error fetching courses');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSave = async () => {
    if (selectedCourse) {
      const newSale = {
        saleTime: new Date(saleTime).getTime(), // Convert sale time to timestamp
        price: parseFloat(price),
        live: false, // Initially, the sale is not live
      };
      try {
        const courseRef = doc(learningDb, 'courses', selectedCourse.id);
        await updateDoc(courseRef, {
          sales: arrayUnion(newSale)
        });
        setSelectedCourse({
          ...selectedCourse,
          sales: [...(selectedCourse.sales || []), newSale]
        });
        setSaleTime('');
        setPrice('');
        toast.success('Sale added successfully!');
      } catch (error) {
        toast.error('Error adding sale');
      }
    }
  };

  const handleLiveToggle = async (sale, index) => {
    if (selectedCourse) {
      const updatedSales = selectedCourse.sales.map((s, i) => i === index ? { ...s, live: !s.live } : s);
      try {
        const courseRef = doc(learningDb, 'courses', selectedCourse.id);
        await updateDoc(courseRef, {
          sales: updatedSales
        });
        setSelectedCourse({ ...selectedCourse, sales: updatedSales });
        toast.success(`Sale ${sale.live ? 'unlived' : 'lived'} successfully!`);
      } catch (error) {
        toast.error('Error updating sale live status');
      }
    }
  };

  const handleRemoveSale = async (sale) => {
    if (selectedCourse) {
      try {
        const courseRef = doc(learningDb, 'courses', selectedCourse.id);
        await updateDoc(courseRef, {
          sales: arrayRemove(sale)
        });
        setSelectedCourse({
          ...selectedCourse,
          sales: selectedCourse.sales.filter(s => s !== sale)
        });
        toast.success('Sale removed successfully!');
      } catch (error) {
        toast.error('Error removing sale');
      }
    }
  };

  const handleCourseSelected = (course) => {
    setSelectedCourse(course);
    setSaleTime('');
    setPrice('');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredCourses = courses.filter(course => course.name.toLowerCase().includes(e.target.value.toLowerCase()));
    setDisplayedCourses(filteredCourses);
  };

  return (
    <Container>
      <ToastContainer />
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Sale Page
        </Typography>
        <TextField
          label="Search Courses"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <List>
                {displayedCourses.map(course => (
                  <ListItem button key={course.id} onClick={() => handleCourseSelected(course)}>
                    <ListItemAvatar>
                      <Avatar src={course.thumbnail} alt={course.name} />
                    </ListItemAvatar>
                    <ListItemText primary={course.name} secondary={course.description} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            {selectedCourse && (
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h5" component="h2">
                    Set Sale Time and Price for {selectedCourse.name}
                  </Typography>
                  <TextField
                    label="Sale Time"
                    type="datetime-local"
                    value={saleTime}
                    onChange={e => setSaleTime(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    fullWidth
                    style={{ marginTop: '16px' }}
                  >
                    Save
                  </Button>
                  <Typography variant="h6" component="h3" style={{ marginTop: '16px' }}>
                    Current Sales:
                  </Typography>
                  <List>
                    {selectedCourse.sales && selectedCourse.sales.map((sale, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={`Price: $${sale.price}`} secondary={`Sale Time: ${new Date(sale.saleTime).toLocaleString()}`} />
                        <IconButton onClick={() => handleLiveToggle(sale, index)}>
                          <LiveTvIcon color={sale.live ? 'primary' : 'disabled'} />
                        </IconButton>
                        <IconButton onClick={() => handleRemoveSale(sale)}>
                          <DeleteIcon />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CourseSalePage;