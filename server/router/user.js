const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const secretKey = process.env.SECRET_KEY; // Replace with a strong secret key
const bcrypt = require('bcrypt')

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'User already exists' });

    // Hash the password before saving to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: "User registration successful" });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    // console.log(isPasswordValid);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });
    console.log("before token");
    // Create a JWT token and send it back to the client
    const token = jwt.sign({ user: user._id }, secretKey, { expiresIn: '7d' });
    console.log(token);
    res.json({ message: "Login successful", token, user });
  } catch (err) {
    console.error('Error in login route:', err);
    res.status(500).json({ message: `Internal server error ${err}`,});
  }
});



module.exports = router