const cron = require('node-cron');
const Event = require('../models/Event');

// Function to parse the date and time strings and return a timestamp
const getEventEndTime = (date, time) => {
    try {
        // Assume date is a Date object or valid date string from the DB (e.g. '2023-11-20T00:00:00.000Z')
        const eventDate = new Date(date);
        
        // Assume time is a string like "14:30"
        const [hours, minutes] = time.split(':').map(Number);
        
        eventDate.setHours(hours, minutes, 0, 0);
        return eventDate.getTime();
    } catch (err) {
        console.error("Error parsing event date/time:", err);
        return null; // Return null if parsing fails
    }
};

const cleanupExpiredEvents = async () => {
    try {
        const events = await Event.find({});
        const now = Date.now();
        let deletedCount = 0;

        for (const event of events) {
            const eventEndTime = getEventEndTime(event.date, event.time);
            
            // If the event end time is valid and in the past, delete it
            if (eventEndTime && eventEndTime < now) {
                await Event.findByIdAndDelete(event._id);
                deletedCount++;
                console.log(`Deleted expired event: ${event.title} (Ended: ${new Date(eventEndTime).toLocaleString()})`);
            }
        }
        
        if (deletedCount > 0) {
            console.log(`Cron Job: Deleted ${deletedCount} expired event(s).`);
        }
    } catch (error) {
        console.error('Error during scheduled event cleanup:', error);
    }
};

// Start the cron job
const startJob = () => {
    // Run the cleanup job every minute
    cron.schedule('* * * * *', () => {
        // console.log('Running event cleanup cron job...'); // Optional debug log
        cleanupExpiredEvents();
    });
    console.log('Event cleanup cron job scheduled to run every minute.');
};

module.exports = { startJob, cleanupExpiredEvents };
