import React, { useState } from 'react';
import { TextField, Button, Grid, IconButton, InputAdornment, MenuItem } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from '../../Firebase/Firebase'; // Adjust path as per your project structure
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp for date of registration

const InternForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: '',
        phoneNumber: '',
        qualification: '',
        internshipMonths: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password and confirm password check
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match. Please check and try again.');
            return;
        }

        try {
            // Create user account with email and password
            const { email, password, fullName, phoneNumber, qualification, internshipMonths } = formData;
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userId = userCredential.user.uid;

            // Additional data to store in Firestore
            const additionalData = {
                fullName,
                email,
                phoneNumber,
                qualification,
                internshipMonths,
                userType: 'intern',
                dateOfRegistration: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
            };

            // Store intern details in Firestore
            await setDoc(doc(db, 'internDetails', userId), additionalData);

            // Clear form data after successful submission
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                fullName: '',
                phoneNumber: '',
                qualification: '',
                internshipMonths: '',
            });

            // Show success message
            toast.success('Intern details saved successfully!');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Failed to save intern details. Please try again.');
        }
    };

    return (
        <div>
            <h1>Intern Form</h1>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <Grid container spacing={2}>
                    {[
                        { name: 'fullName', label: 'Full Name' },
                        { name: 'email', label: 'Email', type: 'email' },
                        { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password' },
                        { name: 'confirmPassword', label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password' },
                        { name: 'phoneNumber', label: 'Phone Number' },
                        { name: 'qualification', label: 'Qualification' },
                        { name: 'internshipMonths', label: 'Internship Duration (months)', type: 'select' },
                    ].map((field, index) => (
                        <Grid item xs={12} md={field.name === 'internshipMonths' ? 6 : 4} key={index}>
                            {field.type === 'select' ? (
                                <TextField
                                    fullWidth
                                    select
                                    label={field.label}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={field.name === 'internshipMonths'}
                                >
                                    {[1, 2, 3, 4, 5, 6].map((month) => (
                                        <MenuItem key={month} value={month}>
                                            {month} Month{month !== 1 && 's'}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <TextField
                                    fullWidth
                                    label={field.label}
                                    name={field.name}
                                    type={field.type || 'text'}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    required={['fullName', 'email', 'password', 'confirmPassword', 'qualification'].includes(field.name)}
                                    InputProps={{
                                        endAdornment: (field.name === 'password' || field.name === 'confirmPassword') && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={field.name === 'password' ? handleTogglePasswordVisibility : handleToggleConfirmPasswordVisibility}
                                                    edge="end"
                                                >
                                                    {field.name === 'password' ? (showPassword ? <VisibilityOff /> : <Visibility />) : (showConfirmPassword ? <VisibilityOff /> : <Visibility />)}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <ToastContainer />
        </div>
    );
};

export default InternForm;
