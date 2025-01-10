const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const transactionRoutes = require('./src/routes/transactions');
require('dotenv').config();

const app = express();

// Connect to MongoDB silently
connectDB().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 