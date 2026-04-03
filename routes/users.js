const express = require('express');
const router = express.Router();
const { getUsers, approveUser } = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.use(authenticateToken);
router.use(authorizeRole('Admin'));

router.get('/', getUsers);
router.patch('/:id/approve', approveUser);

module.exports = router;
