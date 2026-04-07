const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  const User = require('../models/User');
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await User.create({
      firstName: 'Admin',
      lastName: 'KJEI',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      isVerified: true,
    });
    console.log(`🌱 Admin account seeded: ${adminEmail}`);
  }
};

module.exports = connectDB;
