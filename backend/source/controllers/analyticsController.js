const Movement = require('../models/Movement');

// Ottieni una panoramica dell'analisi finanziaria dell'utente
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Panoramica dei guadagni e delle spese totali
    const overview = await Movement.aggregate([
      { $match: { userId } },
      { 
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      }
    ]);

    res.json(overview.length > 0 ? overview[0] : { totalIncome: 0, totalExpense: 0 });
  } catch (err) {
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
