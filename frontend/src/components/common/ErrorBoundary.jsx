// src/components/common/ErrorBoundary.jsx
// Questo componente catturerà gli errori nei componenti figli e mostrerà un'interfaccia utente di fallback

import React, { Component } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Aggiorna lo stato in modo che il prossimo render mostri l'UI di fallback
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Puoi anche registrare l'errore in un servizio di reporting errori
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRetry = () => {
    // Tentativo di reset dello stato e ricarica del componente
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  handleReload = () => {
    // Ricarica la pagina
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      // Puoi renderizzare qualsiasi UI di fallback
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '60vh' }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              maxWidth: 500,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2
            }}
          >
            <ErrorOutline sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Qualcosa è andato storto
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              Si è verificato un errore nell'applicazione. Questo potrebbe essere un problema temporaneo.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                onClick={this.handleRetry} 
                sx={{ mr: 2 }}
              >
                Riprova
              </Button>
              <Button 
                variant="outlined" 
                onClick={this.handleReload}
              >
                Ricarica la pagina
              </Button>
            </Box>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;