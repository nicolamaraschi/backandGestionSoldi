const express = require('express');
const router = express.Router();

// Route di esempio
router.get('/', (req, res) => {
  res.send('Test route is working!');
});

module.exports = router;
