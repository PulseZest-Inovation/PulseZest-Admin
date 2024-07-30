import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteField, Timestamp } from "firebase/firestore";
import { learningDb } from '../../utils/Firebase/learningFirebaseConfig';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, TextField, Paper, Button, IconButton, Grid, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Duration$Coupon = () => {
    const [courses, setCourses] = useState([]);
    const [displayedCourses, setDisplayedCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [validDate, setValidDate] = useState('');
    const [couponPrice, setCouponPrice] = useState('');
    const [courseDuration, setCourseDuration] = useState('');
    const [couponList, setCouponList] = useState([]);

    const durationOptions = ['1 month', '2 months', '3 months', '4 months', '5 months', '6 months', '12 months'];

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesCollection = collection(learningDb, 'courses');
                const courseSnapshot = await getDocs(coursesCollection);
                const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(courseList);
                setDisplayedCourses(courseList);
            } catch (error) {
                console.error("Error fetching courses: ", error);
                toast.error("Failed to fetch courses.");
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayedCourses(filteredCourses);
    }, [searchQuery, courses]);

    const handleCourseSelected = (course) => {
        setSelectedCourse(course);
        const updatedCouponList = course.couponCodes
            ? Object.values(course.couponCodes).map(coupon => {
                const validDate = new Date(coupon.validDate.seconds * 1000);
                const now = new Date();
                // Compare dates considering the exact time
                const status = validDate > now ? 'online' : 'expired';
                return { ...coupon, status };
            })
            : [];
        setCouponList(updatedCouponList);
        setCourseDuration(course.courseDuration || '');
    };
    

    const handleCouponCodeChange = (e) => setCouponCode(e.target.value);
    const handleValidDateChange = (e) => setValidDate(e.target.value);
    const handleCouponPriceChange = (e) => setCouponPrice(e.target.value);
    const handleCourseDurationChange = (e) => setCourseDuration(e.target.value);

    const handleSaveCouponCode = async () => {
        if (selectedCourse && couponCode && validDate) {
            try {
                const courseDocRef = doc(learningDb, 'courses', selectedCourse.id);
                const couponExpirationDate = new Date(validDate);
                const now = new Date();
                const status = couponExpirationDate > now ? 'online' : 'expired';
    
                await updateDoc(courseDocRef, {
                    [`couponCodes.${couponCode}`]: {
                        code: couponCode,
                        validDate: Timestamp.fromDate(couponExpirationDate),
                        status: status,
                        price: parseFloat(couponPrice)
                    }
                });
    
                setCouponList(prev => [...prev, {
                    code: couponCode,
                    validDate: Timestamp.fromDate(couponExpirationDate),
                    status: status,
                    price: parseFloat(couponPrice)
                }]);
                setCouponCode('');
                setValidDate('');
                setCouponPrice('');
                toast.success('Coupon code saved successfully!');
            } catch (error) {
                console.error("Error saving coupon code: ", error);
                toast.error('Failed to save coupon code.');
            }
        } else {
            toast.warn('Please fill all fields.');
        }
    };

    const handleDeleteCouponCode = async (code) => {
        if (selectedCourse) {
            try {
                const courseDocRef = doc(learningDb, 'courses', selectedCourse.id);

                await updateDoc(courseDocRef, {
                    [`couponCodes.${code}`]: deleteField()
                });

                setCouponList(prev => prev.filter(coupon => coupon.code !== code));
                toast.success('Coupon code deleted successfully!');
            } catch (error) {
                console.error("Error deleting coupon code: ", error);
                toast.error('Failed to delete coupon code.');
            }
        }
    };

    const handleSaveCourseDuration = async () => {
        if (selectedCourse && courseDuration) {
            try {
                const courseDocRef = doc(learningDb, 'courses', selectedCourse.id);

                await updateDoc(courseDocRef, {
                    courseDuration: courseDuration
                });

                toast.success('Course duration saved successfully!');
            } catch (error) {
                console.error("Error saving course duration: ", error);
                toast.error('Failed to save course duration.');
            }
        } else {
            toast.warn('Please select a valid duration.');
        }
    };

    return (
        <div>
            <Paper style={{ padding: '16px', marginBottom: '16px' }}>
                <TextField
                    label="Search Courses"
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </Paper>
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

            {selectedCourse && (
                <div>
                    <Paper style={{ padding: '16px', marginTop: '16px' }}>
                        <h3>Selected Course: {selectedCourse.name}</h3>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Coupon Code"
                                    variant="outlined"
                                    fullWidth
                                    value={couponCode}
                                    onChange={handleCouponCodeChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Valid Date"
                                    variant="outlined"
                                    fullWidth
                                    type="date"
                                    value={validDate}
                                    onChange={handleValidDateChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Price"
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    value={couponPrice}
                                    onChange={handleCouponPriceChange}
                                />
                            </Grid>
                        </Grid>
                        <Button variant="contained" color="primary" onClick={handleSaveCouponCode} style={{ marginTop: '16px' }}>
                            Save Coupon Code
                        </Button>
                    </Paper>

                    <Paper style={{ padding: '16px', marginTop: '16px' }}>
                        <h3>Course Duration</h3>
                        <FormControl fullWidth>
                            <InputLabel>Course Duration</InputLabel>
                            <Select
                                value={courseDuration}
                                onChange={handleCourseDurationChange}
                                label="Course Duration"
                            >
                                {durationOptions.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleSaveCourseDuration} style={{ marginTop: '16px' }}>
                            Save Course Duration
                        </Button>
                    </Paper>

                    <Paper style={{ padding: '16px', marginTop: '16px' }}>
                        <h3>Coupon Codes</h3>
                        {couponList.map(coupon => (
                            <div key={coupon.code} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ flexGrow: 1 }}>
                                    {coupon.code} - ${coupon.price} - {coupon.status} - {new Date(coupon.validDate.seconds * 1000).toLocaleDateString()}
                                </span>
                                <IconButton color="secondary" onClick={() => handleDeleteCouponCode(coupon.code)}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        ))}
                    </Paper>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Duration$Coupon;
