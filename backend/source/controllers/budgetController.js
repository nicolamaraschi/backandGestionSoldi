const Budget = require('../models/Budget');

// Recupera tutti i budget dell'utente
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user.userId }).populate('category');
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recupera un budget specifico
exports.getBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id).populate('category');
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crea un nuovo budget
exports.addBudget = async (req, res) => {
  const { category, amount, startDate, endDate } = req.body;
  const userId = req.user.userId;

  const budget = new Budget({
    category,
    amount,
    startDate,
    endDate,
    userId
  });

  try {
    const newBudget = await budget.save();
    res.status(201).json(newBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Aggiorna un budget esistente
exports.updateBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    budget.category = req.body.category !== undefined ? req.body.category : budget.category;
    budget.amount = req.body.amount !== undefined ? req.body.amount : budget.amount;
    budget.startDate = req.body.startDate !== undefined ? req.body.startDate : budget.startDate;
    budget.endDate = req.body.endDate !== undefined ? req.body.endDate : budget.endDate;

    await budget.save();

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Elimina un budget
exports.deleteBudget = async (req, res) => {
  try {
    const result = await Budget.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Budget not found' });

    res.json({ message: 'Budget deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
