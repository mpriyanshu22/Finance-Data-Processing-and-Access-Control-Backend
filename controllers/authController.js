const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    let status = 'active';
    if (role === 'Analyst') {
      status = 'inactive';
    }

    const newUser = new User({
      username,
      email,
      password: password_hash,
      role,
      status,
      balance: 0
    });

    await newUser.save();
    const payload = {
      id: newUser._id,
      role: newUser.role,
      status: newUser.status
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username, role: newUser.role, status: newUser.status }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ message: "Pending Admin Approval" });
    }

    const payload = {
      id: user._id,
      role: user.role,
      status: user.status
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ user: payload });
  } catch (err) {
    next(err);
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
