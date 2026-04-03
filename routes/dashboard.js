const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);


router.get('/summary', authorizeRole('Admin', 'Analyst'), getSummary);

module.exports = router;
