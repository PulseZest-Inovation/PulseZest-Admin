import React, { useState } from 'react';
import { TextField, Input, Button, Grid, IconButton, InputAdornment, MenuItem, Select, FormControl, InputLabel, Checkbox, ListItemText } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, storage, db } from '../../Firebase/Firebase'; // Adjust the path as per your Firebase setup
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp for date of registration

const workingDepartments = [
  'Android Developer',
  'Web Developer',
  'Server Management',
  'Cyber Security',
  'Tester',
  'HR',
  'Project Manager'
];

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    alternativePhoneNumber: '',
    address: '',
    teamsId: '',
    department: [],
    passportPhoto: null,
    resume: null,
    aadharCard: null,
    panCard: null,
    bankAccountNumber: '',
    bankName: '',
    ifscCode: '',
    accountHolderName: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDepartmentChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, department: value });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      // 1. Register user in authentication service (Firebase Auth)
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const userId = userCredential.user.uid;

      // 2. Upload documents to Firebase Storage
      const uploadTasks = [];
      if (formData.passportPhoto) {
        uploadTasks.push(uploadFileToStorage(formData.passportPhoto, `passportPhotos/${userId}`));
      }
      if (formData.resume) {
        uploadTasks.push(uploadFileToStorage(formData.resume, `resumes/${userId}`));
      }
      if (formData.aadharCard) {
        uploadTasks.push(uploadFileToStorage(formData.aadharCard, `aadharCards/${userId}`));
      }
      if (formData.panCard) {
        uploadTasks.push(uploadFileToStorage(formData.panCard, `panCards/${userId}`));
      }

      // Wait for all file uploads to complete
      await Promise.all(uploadTasks);

      // 3. Save employee details including file URLs to Firestore
      const employeeData = {
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        alternativePhoneNumber: formData.alternativePhoneNumber,
        address: formData.address,
        teamsId: formData.teamsId,
        department: formData.department,
        passportPhotoUrl: formData.passportPhoto ? await getFileDownloadUrl(`passportPhotos/${userId}`) : null,
        resumeUrl: formData.resume ? await getFileDownloadUrl(`resumes/${userId}`) : null,
        aadharCardUrl: formData.aadharCard ? await getFileDownloadUrl(`aadharCards/${userId}`) : null,
        panCardUrl: formData.panCard ? await getFileDownloadUrl(`panCards/${userId}`) : null,
        bankAccountNumber: formData.bankAccountNumber,
        bankName: formData.bankName,
        ifscCode: formData.ifscCode,
        accountHolderName: formData.accountHolderName,
        userType: 'employee', // Added userType
        dateOfRegistration: serverTimestamp(), // Added dateOfRegistration with current timestamp
        userId: userId
      };

      await saveEmployeeDetailsToFirestore(employeeData);

      // Reset form after successful submission
      resetForm();

      toast.success("Employee details saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save employee details. Please try again later.");
    }
  };

  // Function to upload a file to Firebase Storage
  const uploadFileToStorage = (file, path) => {
    const storageRef = ref(storage, path);
    return uploadBytes(storageRef, file);
  };

  // Function to get download URL of a file from Firebase Storage
  const getFileDownloadUrl = async (path) => {
    const storageRef = ref(storage, path);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  };

  // Function to save employee details to Firestore
  const saveEmployeeDetailsToFirestore = async (employeeData) => {
    await setDoc(doc(db, "employeeDetails", employeeData.userId), employeeData);
  };

  // Function to reset form after successful submission
  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phoneNumber: '',
      alternativePhoneNumber: '',
      address: '',
      teamsId: '',
      department: [],
      passportPhoto: null,
      resume: null,
      aadharCard: null,
      panCard: null,
      bankAccountNumber: '',
      bankName: '',
      ifscCode: '',
      accountHolderName: ''
    });
  };

  return (
    <div>
      <h1>Employee Form</h1>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Grid container spacing={2}>
          {/* Personal Details */}
          <Grid item xs={12}>
            <h2>Personal Details</h2>
          </Grid>
          {[
            { name: 'fullName', label: 'Full Name' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: showPassword ? 'text' : 'password' },
            { name: 'confirmPassword', label: 'Confirm Password', type: showConfirmPassword ? 'text' : 'password' },
            { name: 'phoneNumber', label: 'Phone Number' },
            { name: 'alternativePhoneNumber', label: 'Alternative Phone Number' },
            { name: 'address', label: 'Address' },
            { name: 'teamsId', label: 'Microsoft Teams Id' }
          ].map((field, index) => (
            <Grid item xs={12} md={4} key={index}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || 'text'}
                value={formData[field.name]}
                onChange={handleChange}
                required={true}
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

          {/* Working Department */}
          <Grid item xs={12}>
            <h2>Working Department</h2>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                multiple
                value={formData.department}
                onChange={handleDepartmentChange}
                input={<Input />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {workingDepartments.map((department) => (
                  <MenuItem key={department} value={department}>
                    <Checkbox checked={formData.department.includes(department)} />
                    <ListItemText primary={department} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Documents */}
          <Grid item xs={12}>
            <h2>Documents</h2>
          </Grid>
          {[
            { name: 'passportPhoto', label: 'Upload Passport Size Photo' },
            { name: 'resume', label: 'Upload Resume' },
            { name: 'aadharCard', label: 'Upload Aadhar Card' },
            { name: 'panCard', label: 'Upload Pan Card' }
          ].map((field, index) => (
            <Grid item xs={12} md={6} key={index}>
            <Button
              variant="contained"
              component="label"
              fullWidth
            >
              {field.label}
              <input
                type="file"
                name={field.name}
                hidden
                onChange={handleChange}
              />
            </Button>
          </Grid>
        ))}

        {/* Bank Details */}
        <Grid item xs={12}>
          <h2>Bank Details</h2>
        </Grid>
        {[
          { name: 'bankAccountNumber', label: 'Bank Account Number' },
          { name: 'bankName', label: 'Bank Name' },
          { name: 'ifscCode', label: 'IFSC Code' },
          { name: 'accountHolderName', label: 'Account Holder Name' }
        ].map((field, index) => (
          <Grid item xs={12} md={4} key={index}>
            <TextField
              fullWidth
              label={field.label}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={true}
            />
          </Grid>
        ))}

        {/* Submit Button */}
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

export default EmployeeForm;

