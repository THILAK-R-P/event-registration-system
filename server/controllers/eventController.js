
const Event = require('../models/Event');


exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location } = req.body;

        const userId = req.user ? req.user.id : "65b2f9a1e8b2c3d4e5f6a7b8";

        const newEvent = new Event({
            organizer: userId,
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


exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('organizer', 'username');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.attendees.includes(req.user.id)) {
            return res.status(400).json({ message: "You already joined this event" });
        }

        event.attendees.push(req.user.id);
        await event.save();

        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMyEvents = async (req, res) => {
    try {

        const events = await Event.find({ attendees: req.user.id });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });


        // Check if user is admin or the event organizer
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied. You can only delete your own events." });
        }

        await event.deleteOne();
        res.json({ message: "Event removed" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};