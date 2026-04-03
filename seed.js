require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);


    const adminExists = await User.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await User.create({
      username: 'admin',
      email: process.env.ADMIN_EMAIL,
      password,
      role: 'Admin',
      status: 'active',
      balance: 0
    });

    console.log('Admin user seeded successfully. Username: admin, Email: email, Password: password');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
