const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  type: { type: String, required: true }, // ad esempio "entrata" o "uscita"
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // riferimento a un utente
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movement', MovementSchema);
