const express = require('express');
const router = express.Router();
const { getPoints, addPoints, spendPoints, getTransactions } = require('../controller');

router.get('/', (req, res) => {
  res.send('Please provide a User ID');
});

// Get list of point balances for a user by userId
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  try {
    const response = getPoints(userId);
    res.send(response);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

// Get list of transactions for a user by userId
router.get('/transactions/:userId', (req, res) => {
  const userId = req.params.userId;
  try {
    const response = getTransactions(userId);
    res.send(response);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

// Add a transaction for a user by userId
router.post('/add/:userId', (req, res) => {
  const userId = req.params.userId;
  const transaction = req.body;

  try {
    const response = addPoints(userId, transaction);
    res.send(response);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

// Spend points for a user by userId
router.post('/spend/:userId', (req, res) => {
  const userId = req.params.userId;
  const pointsToSpend = req.body.points;

  try {
    const response = spendPoints(userId, pointsToSpend);
    res.send(response);
  } catch (e) {
    res.status(200).send(e.message);
  }
});

module.exports = router;
