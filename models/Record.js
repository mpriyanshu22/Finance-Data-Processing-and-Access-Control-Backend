const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['income', 'expense'] 
  },
  category: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  notes: { 
    type: String 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);
