require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const connectDB = require('./config/db');

const authRoutes      = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',       authRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: '✅ KJEI Hostel Tracker API is running.' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
