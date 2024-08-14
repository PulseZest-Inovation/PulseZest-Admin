import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'; // Import Firebase Auth functions
import { db } from '../../Firebase/Firebase'; // Import your Firestore db instance
import { setDoc, doc } from 'firebase/firestore'; // Import Firestore functions
import { toast, ToastContainer } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css'; // CSS for toast notifications
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function AddUserForm() {
  const [serviceType, setServiceType] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    description: '',
    purpose: '',
    websiteName: '',
    adminDomain: '',
    domain: '',
    host: '',
    reference: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phoneNumber') {
      const regex = /^[0-9]*$/;
      if (regex.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleServiceTypeChange = (e) => {
    setServiceType(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate domain and adminDomain fields
    if (!isValidDomain(formData.domain)) {
      toast.error('Invalid Domain. Please enter a valid domain.');
      return;
    }

    if (!isValidDomain(formData.adminDomain)) {
      toast.error('Invalid Admin Domain. Please enter a valid domain.');
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please enter matching passwords.');
      return;
    }

    setLoading(true);

    try {
      const auth = getAuth(); // Initialize Firebase Auth instance
      const { email, password } = formData;

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Prepare data to save in Firestore
      const completeFormData = {
        ...formData,
        registrationDate: new Date().toISOString(),
        projectLive: false,
        projectLiveDate: '',
        renewDate: '',
        userProfile: '',
        userId: user.uid, // Save Firebase Authentication UID in Firestore
        userType: serviceType // Save serviceType as userType in Firestore
      };

      // Determine collection based on service type
      let collectionName = '';
      switch (serviceType) {
        case 'appDev':
          collectionName = 'appDevelopment';
          break;
        case 'webDev':
          collectionName = 'webDevelopment';
          break;
        case 'software':
          collectionName = 'softwareDevelopment'; // Assuming 'softwareDevelopment' collection name
          break;
        default:
          break;
      }

      // Explicitly set document ID to user.uid
      await setDoc(doc(db, collectionName, user.uid), completeFormData);

      toast.success('User added successfully');
      console.log('User added successfully:', completeFormData);
      resetForm();
    } catch (error) {
      console.error('Error adding user: ', error);
      toast.error('Error adding user. Please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      description: '',
      purpose: '',
      websiteName: '',
      adminDomain: '',
      domain: '',
      host: '',
      reference: ''
    });
    setServiceType('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const isValidDomain = (domain) => {
    // Basic domain validation logic
    // You can implement more strict validation if needed
    return domain && domain.includes('.');
  };

  return (
    <div>
      <h1>Client Form</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="service-type-label">Service Type</InputLabel>
              <Select
                labelId="service-type-label"
                id="service-type"
                value={serviceType}
                onChange={handleServiceTypeChange}
                label="Service Type"
                fullWidth
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="appDev">App</MenuItem>
                <MenuItem value="webDev">Web</MenuItem>
                <MenuItem value="software">Software</MenuItem> {/* Added Software as a service type */}
              </Select>
            </FormControl>
          </Grid>
          {[
            { name: 'fullName', label: 'Full Name' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password' },
            { name: 'confirmPassword', label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password' },
            { name: 'phoneNumber', label: 'Phone Number' },
            { name: 'purpose', label: 'Purpose' },
            { name: 'websiteName', label: 'Website Name' },
            { name: 'adminDomain', label: 'Admin Domain' },
            { name: 'domain', label: 'Domain' },
            { name: 'host', label: 'Host' },
            { name: 'reference', label: 'Reference' },
          ].map((field, index) => (
            <Grid item xs={12} md={4} key={index}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name]}
                onChange={handleChange}
                required={['fullName', 'email', 'password', 'confirmPassword'].includes(field.name)}
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
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer /> {/* Toast notifications container */}
    </div>
  );
}
