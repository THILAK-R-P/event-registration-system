const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const eventCleanupJob = require('./jobs/eventCleanup');

const app = express();
const cors = require("cors");

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    
    // Start the cron job
    eventCleanupJob.startJob();
    
    // Run an initial cleanup on startup
    eventCleanupJob.cleanupExpiredEvents();
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));