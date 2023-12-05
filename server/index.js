const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path:'./.env'})
const { authenticateUser } = require('./middleware/auth');
const userRoutes = require('./router/user')
const postRoutes = require('./router/post')


const PORT = process.env.PORT || 5001


// Set up middleware
app.use(express.json())
app.use(cors({
    origin:true,
    credentials: true,
}));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI; 
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));


// Define routes
app.get('/',(req,res) => res.send("hello World"))



// Routes
app.use('/auth', userRoutes); // Register and Login routes
app.use('/posts',  postRoutes); // Post-related routes
// Add other routes here


app.listen(PORT,() => console.log(`listening to ${PORT}`))