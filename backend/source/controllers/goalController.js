const Goal = require('../models/Goal');

// Recupera tutti gli obiettivi dell'utente
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Recupera un obiettivo specifico
exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crea un nuovo obiettivo
exports.addGoal = async (req, res) => {
  const { title, targetAmount, dueDate } = req.body;
  const userId = req.user.userId;

  const goal = new Goal({
    title,
    targetAmount,
    dueDate,
    userId
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Aggiorna un obiettivo esistente
exports.updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    goal.title = req.body.title !== undefined ? req.body.title : goal.title;
    goal.targetAmount = req.body.targetAmount !== undefined ? req.body.targetAmount : goal.targetAmount;
    goal.currentAmount = req.body.currentAmount !== undefined ? req.body.currentAmount : goal.currentAmount;
    goal.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : goal.dueDate;

    await goal.save();

    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Elimina un obiettivo
exports.deleteGoal = async (req, res) => {
  try {
    const result = await Goal.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Goal not found' });

    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
