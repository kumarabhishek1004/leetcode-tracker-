const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const problemRoutes = require('./routes/problemRoutes');

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.use('/api/problems', problemRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
