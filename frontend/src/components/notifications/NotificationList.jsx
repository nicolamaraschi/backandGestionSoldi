import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  Divider,
  CircularProgress,
  Button
} from '@mui/material';
import NotificationItem from './NotificationItem';
import { getNotifications, updateNotification, deleteNotification } from '../../services/notificationService';
import { useAlert } from '../../contexts/AlertContext';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { showAlert } = useAlert();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      showAlert('Failed to load notifications', 'error');
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await updateNotification(id, { isRead: true });
      setNotifications(notifications.map(notif => 
        notif._id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (error) {
      showAlert('Failed to update notification', 'error');
      console.error('Error updating notification:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(notif => notif._id !== id));
      showAlert('Notification deleted successfully', 'success');
    } catch (error) {
      showAlert('Failed to delete notification', 'error');
      console.error('Error deleting notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.isRead);
      await Promise.all(unreadNotifications.map(notif => 
        updateNotification(notif._id, { isRead: true })
      ));
      
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      showAlert('All notifications marked as read', 'success');
    } catch (error) {
      showAlert('Failed to update notifications', 'error');
      console.error('Error updating notifications:', error);
    }
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Notifications {unreadCount > 0 && <Box component="span" sx={{ ml: 1, fontSize: '1rem', bgcolor: 'primary.main', color: 'white', px: 1.5, py: 0.5, borderRadius: 10 }}>{unreadCount}</Box>}
        </Typography>
        {unreadCount > 0 && (
          <Button variant="outlined" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Box>
      
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: '1px solid rgba(0, 0, 0, 0.08)'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You're all caught up! There are no notifications at the moment.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                {index > 0 && <Divider />}
                <NotificationItem
                  notification={notification}
                  onMarkAsRead={() => handleMarkAsRead(notification._id)}
                  onDelete={() => handleDelete(notification._id)}
                />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationList;