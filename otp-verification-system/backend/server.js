const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api', authRoutes);

// Root
app.get('/', (req, res) => {
    res.send('OTP Verification API is running');
});

// Run Server
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
