const Movement = require('../models/Movement');

exports.getOverview = async (req, res) => {
  try {
    // Ottieni l'ID utente dal token
    const userId = req.user.userId;
    
    // Converti l'ID utente da stringa a oggetto MongoDB ObjectId
    const ObjectId = require('mongoose').Types.ObjectId;
    const userObjectId = new ObjectId(userId);
    
    console.log('Esecuzione query overview per userId:', userId);
    
    // Panoramica dei guadagni e delle spese totali con maggiori controlli
    const overview = await Movement.aggregate([
      { 
        $match: { 
          userId: userObjectId  // Usa l'ObjectId invece della stringa
        } 
      },
      { 
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      }
    ]);

    console.log('Risultati query overview:', overview);
    
    res.json(overview.length > 0 ? overview[0] : { totalIncome: 0, totalExpense: 0 });
  } catch (err) {
    console.error('Errore in analytics/overview:', err);
    res.status(500).json({ message: err.message });
  }
};

// Ottieni le tendenze finanziarie nel tempo
exports.getTrends = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Tendenze mensili di entrate e spese
    const trends = await Movement.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Confronta le spese e le entrate tra diversi periodi
exports.getComparison = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;

    // Confronto tra entrate e spese per un intervallo di date specificato
    const comparison = await Movement.aggregate([
      { 
        $match: {
          userId,
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(comparison);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
