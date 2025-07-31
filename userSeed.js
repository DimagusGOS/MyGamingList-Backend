const mongoose = require('mongoose'); 
const dotenv = require('dotenv'); 
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas'); 
        return User.insertMany([
            {username: "JohnDoe", email: "johndoe@mail.com", passwordHash:"123123"},
            {username: "LuisFer", email: "luisfer@mail.com", passwordHash:"098098"},
            {username: "Salazuh", email: "salazuh@mail.com", passwordHash:"oioioki"},
            {username: "Ciscokid", email: "ciscokid@mail.com", passwordHash:"ciscok"}
        ]);
    })
    .then(() => { 
        console.log('Seeded user data'); 
        mongoose.disconnect(); 
    })
    .catch(err => { 
        console.error(err); 
        mongoose.disconnect(); 
    });