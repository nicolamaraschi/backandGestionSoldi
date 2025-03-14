const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrazione dell'utente
exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  
  // Validazione dei dati
  if (!email || !password || !name) {
    return res.status(400).json({ 
      msg: 'Tutti i campi sono obbligatori',
      details: {
        email: !email ? 'Email obbligatoria' : null,
        password: !password ? 'Password obbligatoria' : null,
        name: !name ? 'Nome obbligatorio' : null
      }
    });
  }
  
  // Validazione formato email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      msg: 'Formato email non valido',
      field: 'email' 
    });
  }
  
  // Validazione lunghezza password
  if (password.length < 8) {
    return res.status(400).json({ 
      msg: 'La password deve contenere almeno 8 caratteri',
      field: 'password' 
    });
  }
  
  try {
    // Verifica se l'utente esiste già
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        msg: 'Un utente con questa email esiste già',
        field: 'email'
      });
    }
    
    // Crea nuovo utente
    user = new User({ email, password, name });
    await user.save();
    
    // Genera token JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Risposta di successo
    res.status(201).json({ 
      token,
      msg: 'Utente registrato con successo',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Errore durante la registrazione:', err);
    
    // Gestione errori specifici di MongoDB/Mongoose
    if (err.name === 'ValidationError') {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err.errors[field].message;
      }
      return res.status(400).json({ 
        msg: 'Errore di validazione',
        errors 
      });
    }
    
    res.status(500).json({ 
      msg: 'Errore del server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Login dell'utente
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validazione dei dati
  if (!email || !password) {
    return res.status(400).json({ 
      msg: 'Email e password sono obbligatorie',
      details: {
        email: !email ? 'Email obbligatoria' : null,
        password: !password ? 'Password obbligatoria' : null
      }
    });
  }
  
  try {
    // Verifica se l'utente esiste
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        msg: 'Credenziali non valide',
        field: 'email'
      });
    }
    
    // Verifica password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        msg: 'Credenziali non valide', 
        field: 'password'
      });
    }
    
    // Genera token JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Risposta di successo
    res.json({ 
      token,
      msg: 'Login effettuato con successo',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Errore durante il login:', err);
    res.status(500).json({ 
      msg: 'Errore del server',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Ottenere informazioni utente
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'Utente non trovato' });
    }
    res.json(user);
  } catch (err) {
    console.error('Errore nel recupero dati utente:', err);
    res.status(500).json({ msg: 'Errore del server' });
  }
};

// Logout dell'utente (gestito principalmente dal lato client)
exports.logout = (req, res) => {
  // Il client rimuove il token, ma possiamo fornire una risposta informativa
  res.json({ 
    msg: 'Logout effettuato con successo',
    info: 'Il token è stato invalidato'
  });
};