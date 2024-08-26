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

// Usa le rotte
app.use('/api/auth', authRoutes);
app.use('/api/movements', movementRoutes);
app.use('/api/categories', categoryRoutes);
const testRoutes = require('./routes/testRoutes');
app.use('/api/test', testRoutes);

// Avvia il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
