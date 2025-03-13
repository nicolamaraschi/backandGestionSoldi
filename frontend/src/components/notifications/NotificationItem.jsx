import React from 'react';
import {
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const formattedDate = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : '';
  
  const tooltipDate = notification.createdAt
    ? format(new Date(notification.createdAt), 'PPpp')
    : '';

  return (
    <ListItem
      sx={{
        py: 2,
        px: 3,
        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.04)'
        }
      }}
      secondaryAction={
        <Box>
          {!notification.isRead && (
            <Tooltip title="Mark as read">
              <IconButton edge="end" onClick={onMarkAsRead} sx={{ mr: 1 }}>
                <MarkEmailReadIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Delete">
            <IconButton edge="end" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      }
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'flex-start',
        width: 'calc(100% - 110px)' // make room for action buttons
      }}>
        <NotificationsIcon 
          sx={{ 
            mr: 2, 
            mt: 0.5,
            color: notification.isRead ? 'action.disabled' : 'primary.main'
          }} 
        />
        <ListItemText
          primary={
            <Typography 
              variant="subtitle1" 
              component="div" 
              sx={{ 
                fontWeight: notification.isRead ? 400 : 600,
                mb: 0.5
              }}
            >
              {notification.message}
            </Typography>
          }
          secondary={
            <Tooltip title={tooltipDate} arrow>
              <Typography 
                variant="body2" 
                color="textSecondary"
              >
                {formattedDate}
              </Typography>
            </Tooltip>
          }
        />
      </Box>
    </ListItem>
  );
};

export default NotificationItem;