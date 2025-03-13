import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import { 
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const RecentMovements = ({ movements }) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/movements');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <Box>
      {movements.length === 0 ? (
        <Typography variant="body2" color="textSecondary" align="center" sx={{ py: 4 }}>
          No recent transactions
        </Typography>
      ) : (
        <List disablePadding>
          {movements.map((movement, index) => (
            <React.Fragment key={movement._id}>
              {index > 0 && <Divider component="li" />}
              <ListItem sx={{ px: 0, py: 2 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: movement.type === 'income' ? 'success.light' : 'error.light',
                      color: movement.type === 'income' ? 'success.contrastText' : 'error.contrastText'
                    }}
                  >
                    {movement.type === 'income' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={movement.description}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {movement.category}
                      </Typography>
                      <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                        {format(new Date(movement.date), 'dd MMM yyyy')}
                      </Typography>
                    </>
                  }
                />
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: movement.type === 'income' ? 'success.main' : 'error.main'
                  }}
                >
                  {movement.type === 'income' ? '+' : '-'}{formatCurrency(movement.amount)}
                </Typography>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
      
      <Button 
        variant="outlined" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={handleViewAll}
      >
        View All Transactions
      </Button>
    </Box>
  );
};

export default RecentMovements;