import React, { useState } from 'react';
import { TextField, Button, Grid, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InternForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    school: '',
    major: ''
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
    // Add your submit logic here
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
            { name: 'school', label: 'School' },
            { name: 'major', label: 'Major' },
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
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
}
