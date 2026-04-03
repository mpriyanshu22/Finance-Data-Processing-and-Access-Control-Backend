const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const validate = require('../middleware/validate');
const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['Admin', 'Analyst', 'Viewer'])
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);

module.exports = router;
