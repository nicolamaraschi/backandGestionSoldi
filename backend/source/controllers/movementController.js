const Movement = require('../models/Movement'); // Importa il modello Movement

exports.getMovements = async (req, res) => {
    try {
      console.log('Fetching movements');
      const movements = await Movement.find();
      res.json(movements);
    } catch (err) {
      console.error('Error fetching movements:', err.message);
      res.status(500).json({ message: err.message });
    }
  };
  
  exports.addMovement = async (req, res) => {
    const { description, amount, date, category, type, userId } = req.body;
  
    const movement = new Movement({
      description,
      amount,
      date,
      category,  // Assicurati di includere la categoria
      type,      // Assicurati di includere il tipo
      userId     // Assicurati di includere l'ID dell'utente
    });
  
    try {
      console.log('Adding movement:', movement);
      const newMovement = await movement.save();
      res.status(201).json(newMovement);
    } catch (err) {
      console.error('Error adding movement:', err.message);
      res.status(400).json({ message: err.message });
    }
  };
  
  
  // Elimina un movimento
exports.deleteMovement = async (req, res) => {
    try {
      console.log('Deleting movement with id:', req.params.id);
      const result = await Movement.findByIdAndDelete(req.params.id);
      if (!result) return res.status(404).json({ message: 'Movement not found' });
  
      res.json({ message: 'Movement deleted' });
    } catch (err) {
      console.error('Error deleting movement:', err.message);
      res.status(500).json({ message: err.message });
    }
  };
  
  // Aggiorna un movimento
exports.updateMovement = async (req, res) => {
  const { description, amount, date, category, type } = req.body;

  try {
    // Trova e aggiorna il movimento
    const updatedMovement = await Movement.findByIdAndUpdate(
      req.params.id,
      {
        description,
        amount,
        date,
        category,
        type
      },
      { new: true } // Restituisce il documento aggiornato
    );

    // Verifica se il movimento esiste
    if (!updatedMovement) {
      return res.status(404).json({ message: 'Movement not found' });
    }

    res.json(updatedMovement);
  } catch (err) {
    console.error('Error updating movement:', err.message);
    res.status(500).json({ message: err.message });
  }
};