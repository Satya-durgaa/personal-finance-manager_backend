const express = require('express');
const router = express.Router();
const sharedExpenseController = require('../controllers/sharedExpenseController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/groups', sharedExpenseController.getAllGroups);
router.post('/groups', sharedExpenseController.createGroup);
router.post('/groups/:groupId/expenses', sharedExpenseController.addExpenseToGroup);

module.exports = router;
