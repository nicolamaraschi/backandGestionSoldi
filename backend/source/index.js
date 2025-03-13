require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Aggiungi questa riga per importare cors

// Inizializza Express
const app = express();


// Abilita CORS con origini multiple
app.use(cors({
  origin: ['http://localhost:3001', 'http://192.168.1.69:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-auth-token']
}));

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
