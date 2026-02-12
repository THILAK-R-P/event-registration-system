const express = require('express');
const router = express.Router();
const { createEvent, getEvents, joinEvent, getMyEvents, deleteEvent } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', getEvents);


router.get('/myevents', authMiddleware, getMyEvents);
router.post('/:id/join', authMiddleware, joinEvent);

router.post('/', createEvent);
router.delete('/:id', authMiddleware, deleteEvent);

module.exports = router;