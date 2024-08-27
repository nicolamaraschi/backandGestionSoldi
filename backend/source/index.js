require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Inizializza Express
const app = express();
app.use(express.json());

// Connessione a MongoDB
const connectDB = require('./config/db');
connectDB();

// Importa le rotte
const authRoutes = require('./routes/authRoutes');
const movementRoutes = require('./routes/movementRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const goalRoutes = require('./routes/goalRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const testRoutes = require('./routes/testRoutes');

// Usa le rotte
app.use('/api/auth', authRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/test', testRoutes);

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
