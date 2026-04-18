const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventCleanupJob = require('./jobs/eventCleanup');

const app = express();

// ✅ FIXED CORS (use your Vercel URL)
app.use(cors({
  origin: "https://event-registration-system-2qvk.vercel.app",
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    
    // Start cron job
    eventCleanupJob.startJob();
    
    // Initial cleanup
    eventCleanupJob.cleanupExpiredEvents();
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));