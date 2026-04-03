const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Analyst', 'Viewer']
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive']
  },
  balance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
