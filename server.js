require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');


const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));
app.use('/records', require('./routes/records'));
app.use('/dashboard', require('./routes/dashboard'));

// Error Handler Middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
