const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', goalController.getAllGoals);
router.post('/', goalController.createGoal);

module.exports = router;
