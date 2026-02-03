const Event = require('../models/Event');

// 1. Create a New Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        // Create new event using the logged-in user's ID
        const newEvent = new Event({
            organizer: req.user.id, // Comes from the middleware!
            title,
            description,
            date,
            location
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'username');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};