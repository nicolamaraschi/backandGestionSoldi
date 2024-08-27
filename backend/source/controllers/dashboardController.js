const Movement = require('../models/Movement');
const Category = require('../models/Category');

// Ottieni tutti i movimenti
exports.getMovements = async (req, res) => {
  try {
    const movements = await Movement.find({ userId: req.user.userId });
    res.json(movements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Statistiche dei movimenti
exports.getStats = async (req, res) => {
  try {
    const stats = await Movement.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Statistiche per categoria
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Movement.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Saldo del portafoglio
exports.getBalance = async (req, res) => {
  try {
    const balance = await Movement.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: null,
          balance: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", { $multiply: ["$amount", -1] }] } }
        }
      }
    ]);
    res.json(balance.length > 0 ? balance[0] : { balance: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Previsioni finanziarie
exports.getForecast = async (req, res) => {
  try {
    const movements = await Movement.find({ userId: req.user.userId });
    const totalIncome = movements.filter(m => m.type === 'income').reduce((acc, m) => acc + m.amount, 0);
    const totalExpense = movements.filter(m => m.type === 'expense').reduce((acc, m) => acc + m.amount, 0);
    const forecast = {
      estimatedSavings: totalIncome - totalExpense
    };
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Report mensile/annuale
exports.getReports = async (req, res) => {
  try {
    const monthlyReport = await Movement.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    const annualReport = await Movement.aggregate([
      {
        $match: { userId: req.user.userId }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y", date: "$date" } },
          totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    res.json({ monthlyReport, annualReport });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Esportazione dei dati
exports.exportData = async (req, res) => {
  try {
    const movements = await Movement.find({ userId: req.user.userId });
    const csv = movements.map(m => `${m.date},${m.description},${m.amount},${m.category},${m.type}`).join('\n');
    res.setHeader('Content-disposition', 'attachment; filename=movements.csv');
    res.setHeader('Content-type', 'text/csv');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Analisi Avanzata
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.userId;
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

exports.getTrends = async (req, res) => {
  try {
    const userId = req.user.userId;
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

exports.getComparison = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { startDate, endDate } = req.query;
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


// Ottieni tutte le notifiche
exports.getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.user.userId });
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Ottieni tutti gli obiettivi
  exports.getGoals = async (req, res) => {
    try {
      const goals = await Goal.find({ userId: req.user.userId });
      res.json(goals);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  // Ottieni tutti i budget
  exports.getBudgets = async (req, res) => {
    try {
      const budgets = await Budget.find({ userId: req.user.userId });
      res.json(budgets);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };