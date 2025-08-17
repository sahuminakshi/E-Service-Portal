
import React, { useState, SyntheticEvent, FormEvent } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/ui/Icon';
import { Role } from '../../types/index';
import { SERVICE_CATEGORIES } from '../../constants/index';
import {
  Box, Paper, Typography, Tabs, Tab, TextField, Button, CircularProgress,
  FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem,
  InputLabel, Alert, Link, Container
} from '@mui/material';
import { VerifiedUserOutlined, EmailOutlined } from '@mui/icons-material';

const AuthForm: React.FC = () => {
  const { login, signup } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [forgotView, setForgotView] = useState(false);
  const [forgotConfirmation, setForgotConfirmation] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>(Role.User);
  const [specialty, setSpecialty] = useState(SERVICE_CATEGORIES[0]);

  const handleTabChange = (event: SyntheticEvent, newValue: 'login' | 'signup') => {
    setError('');
    setForgotView(false);
    setForgotConfirmation(false);
    setAuthView(newValue);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const success = login(email);
    if (!success) {
      setError('Invalid credentials. Please check your email.');
    }
    setLoading(false);
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    const result = signup({ name, email, role, specialty: role === Role.Technician ? specialty : undefined });
    if (!result.success) {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise(res => setTimeout(res, 1000));
    setLoading(false);
    setForgotConfirmation(true);
  };

  const renderContent = () => {
    if (forgotView) {
      return (
        <Box component="form" onSubmit={handleForgotPassword} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom align="center">Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email to receive a reset link.
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
          </Button>
           <Box textAlign="center" mt={2}>
              <Link href="#" onClick={(e) => { e.preventDefault(); setForgotView(false); }} variant="body2">
                  &larr; Back to Login
              </Link>
           </Box>
        </Box>
      );
    }
    
    if (forgotConfirmation) {
        return (
             <Box sx={{ p: 3, textAlign: 'center' }}>
                <EmailOutlined sx={{ fontSize: 60, color: 'success.main', mb: 2 }}/>
                <Typography variant="h6" gutterBottom>Check your inbox</Typography>
                <Typography variant="body2" color="text.secondary">
                    If an account exists, we've sent a link to <Typography component="span" fontWeight="bold">{email}</Typography>.
                </Typography>
                 <Box textAlign="center" mt={3}>
                  <Link href="#" onClick={(e) => { e.preventDefault(); setForgotView(false); setForgotConfirmation(false); }} variant="body2">
                      &larr; Back to Login
                  </Link>
               </Box>
             </Box>
        )
    }

    return (
      <>
        <Tabs value={authView} onChange={handleTabChange} variant="fullWidth">
          <Tab label="Login" value="login" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>
        <Box p={3} component="form" onSubmit={authView === 'login' ? handleLogin : handleSignup}>
          {authView === 'login' && (
            <>
              <TextField fullWidth margin="normal" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Typography variant="caption" color="text.secondary">Any password works for demo.</Typography>
                <Link href="#" onClick={(e) => { e.preventDefault(); setForgotView(true); }} variant="body2">Forgot password?</Link>
              </Box>
            </>
          )}
          {authView === 'signup' && (
            <>
              <TextField fullWidth margin="normal" label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <TextField fullWidth margin="normal" label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              <TextField fullWidth margin="normal" label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">I am a...</FormLabel>
                <RadioGroup row value={role} onChange={(e) => setRole(e.target.value as Role)}>
                  <FormControlLabel value={Role.User} control={<Radio />} label="Customer" />
                  <FormControlLabel value={Role.Technician} control={<Radio />} label="Technician" />
                </RadioGroup>
              </FormControl>
              {role === Role.Technician && (
                <FormControl fullWidth margin="normal">
                  <InputLabel id="specialty-label">Specialty</InputLabel>
                  <Select labelId="specialty-label" value={specialty} label="Specialty" onChange={e => setSpecialty(e.target.value)}>
                    {SERVICE_CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
            </>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : (authView === 'login' ? 'Sign In' : 'Create Account')}
          </Button>
        </Box>
      </>
    );
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ display: 'flex', alignItems: 'center', minHeight: '100vh' }}>
      <Paper elevation={12} sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <VerifiedUserOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography component="h1" variant="h5" fontWeight="bold">E-Service Pro</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mx: 3, mb: 2 }}>{error}</Alert>}
        {renderContent()}
      </Paper>
    </Container>
  );
};

export default AuthForm;