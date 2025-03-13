import React from 'react';
import { Alert, Slide } from '@mui/material';
import { useAlert } from '../../contexts/AlertContext';

const AlertMessage = ({ message, severity }) => {
  const { hideAlert } = useAlert();

  return (
    <Slide direction="down" in={true} mountOnEnter unmountOnExit>
      <Alert 
        severity={severity} 
        onClose={hideAlert}
        sx={{ 
          mb: 2,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}
      >
        {message}
      </Alert>
    </Slide>
  );
};

export default AlertMessage;