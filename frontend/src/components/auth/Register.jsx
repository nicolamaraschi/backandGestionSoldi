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
  Grid,
  Alert
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAlert } from '../../contexts/AlertContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Pulisci gli errori quando l'utente modifica un campo
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  // Validazione dell'email
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validazione della password
  const isStrongPassword = (password) => {
    return password.length >= 8;
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Il nome è obbligatorio';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email è obbligatoria';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
      isValid = false;
    }

    if (!formData.password) {
      errors.password = 'La password è obbligatoria';
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      errors.password = 'La password deve contenere almeno 8 caratteri';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Le password non coincidono';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset degli errori precedenti
    setFormError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password 
      });
      showAlert('Registrazione completata con successo', 'success');
      navigate('/');
    } catch (error) {
      console.error('Dettagli errore registrazione:', error);
      
      let errorMessage = 'Si è verificato un errore durante la registrazione.';
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
          
          // Gestione specifica per "User already exists"
          if (error.response.data.msg === 'Un utente con questa email esiste già' || 
              error.response.data.msg === 'User already exists') {
            newFieldErrors.email = 'Email già registrata';
          }
        } else if (error.response.status === 500) {
          errorMessage = 'Errore del server. Riprova più tardi.';
        }
      } else if (error.request) {
        // La richiesta è stata effettuata ma non è stata ricevuta alcuna risposta
        errorMessage = 'Impossibile contattare il server. Verifica la tua connessione.';
      }
      
      setFormError(errorMessage);
      setFieldErrors({...fieldErrors, ...newFieldErrors});
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
            Crea il tuo account
          </Typography>
        </Box>
        
        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome completo"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Indirizzo Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || 'Minimo 8 caratteri'}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Conferma Password"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 1 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Registrati'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Hai già un account? Accedi"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;