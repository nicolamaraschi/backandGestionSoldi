const mongoose = require('mongoose');

const MovementSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware per aggiornare updatedAt prima del salvataggio
MovementSchema.pre('save', function(next) {
  // Aggiorna il campo updatedAt solo se il documento è stato modificato
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Middleware per convertire correttamente l'ID utente
MovementSchema.pre('find', function() {
  // Se viene passato una stringa per l'ID utente, prova a convertirla in ObjectId
  if (this._conditions.userId && typeof this._conditions.userId === 'string') {
    try {
      this._conditions.userId = mongoose.Types.ObjectId(this._conditions.userId);
    } catch (err) {
      console.warn('Impossibile convertire userId in ObjectId:', err.message);
    }
  }
});

module.exports = mongoose.model('Movement', MovementSchema);