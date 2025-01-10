const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const transactionRoutes = require('./src/routes/transactions');
require('dotenv').config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

app.use('/api', transactionRoutes);

const PORT = process.env.PORT || 5000;

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 