const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', budgetController.getAllBudgets);
router.post('/', budgetController.upsertBudget);

module.exports = router;
