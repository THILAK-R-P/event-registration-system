const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/events (Protected: Must be logged in)
router.post('/', authMiddleware, createEvent);

// GET /api/events (Public: Anyone can see events)
router.get('/', getEvents);

module.exports = router;