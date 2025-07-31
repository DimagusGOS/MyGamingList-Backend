const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');

dotenv.config();

const users = [
  { username: 'JohnDoe', email: 'johndoe@mail.com', password: '123123' },
  { username: 'LuisFer', email: 'luisfer@mail.com', password: '098098' },
  { username: 'Salazuh', email: 'salazuh@mail.com', password: 'oioioki' },
  { username: 'Ciscokid', email: 'ciscokid@mail.com', password: 'ciscok' }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const saltRounds = 10;
    const usersWithHashedPasswords = await Promise.all(
      users.map(async ({ username, email, password }) => ({
        username,
        email,
        passwordHash: await bcrypt.hash(password, saltRounds)
      }))
    );

    await User.insertMany(usersWithHashedPasswords);
    console.log('🌱 Users seeded successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

seedUsers();
