import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase/Firebase';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const secretKey = 'bestofluckdivyansh';
  const [enteredKey, setEnteredKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false); // State for showing/hiding secret key
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isKeyValid) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login successful!');
      } else {
        toast.error('Invalid secret key!');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowSecretKey = () => {
    setShowSecretKey(!showSecretKey);
  };

  const handleSecretKeySubmit = (e) => {
    e.preventDefault();
    if (enteredKey === secretKey) {
      setIsKeyValid(true);
      toast.success('Secret key validated!');
    } else {
      setIsKeyValid(false);
      toast.error('Invalid secret key!');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Login
      </Typography>
      {!isKeyValid ? (
        <Box component="form" onSubmit={handleSecretKeySubmit} sx={{ mt: 2 }}>
          <TextField
            label="Enter Secret Key"
            type={showSecretKey ? 'text' : 'password'} // Toggle between text and password
            value={enteredKey}
            onChange={(e) => setEnteredKey(e.target.value)}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle secret key visibility"
                    onClick={handleClickShowSecretKey} // Toggle visibility
                    edge="end"
                  >
                    {showSecretKey ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      )}
      <ToastContainer />
    </Box>
  );
};

export default Login;
