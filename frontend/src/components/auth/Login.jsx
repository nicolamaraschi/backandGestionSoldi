import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Container,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showAlert } = useAlert();

  // Validazione semplice dell'email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset degli errori precedenti
    setFormError('');
    setFieldErrors({});
    
    // Validazione lato client
    let hasErrors = false;
    const errors = {};
    
    if (!email.trim()) {
      errors.email = 'Email obbligatoria';
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      errors.email = 'Formato email non valido';
      hasErrors = true;
    }
    
    if (!password) {
      errors.password = 'Password obbligatoria';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFieldErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
      showAlert('Login effettuato con successo', 'success');
      navigate('/');
    } catch (error) {
      console.error('Dettagli errore login:', error);
      
      let errorMessage = 'Si è verificato un errore durante il login.';
      const newFieldErrors = {};
      
      if (error.response) {
        // Il server ha risposto con un codice di stato diverso da 2xx
        if (error.response.status === 400) {
          errorMessage = error.response.data.msg || 'Dati non validi';
          
          // Gestione errori specifici per campo
          if (error.response.data.field) {
            newFieldErrors[error.response.data.field] = error.response.data.msg;
          }
          
          // Gestione dettagli errori multipli
          if (error.response.data.details) {
            Object.entries(error.response.data.details).forEach(([field, msg]) => {
              if (msg) newFieldErrors[field] = msg;
            });
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Errore del server. Riprova più tardi.';
        }
      } else if (error.request) {
        // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
        errorMessage = 'Impossibile contattare il server. Verifica la tua connessione.';
      }
      
      setFormError(errorMessage);
      setFieldErrors(newFieldErrors);
      showAlert(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ fontWeight: 'bold', color: 'primary.main' }}
          >
            Money Manager
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
            Accedi al tuo account
          </Typography>
        </Box>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Indirizzo Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!fieldErrors.email}
            helperText={fieldErrors.email}
            disabled={isSubmitting}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!fieldErrors.password}
            helperText={fieldErrors.password}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 1 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Accedi'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Non hai un account? Registrati"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;