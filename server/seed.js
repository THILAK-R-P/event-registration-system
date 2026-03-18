require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const User = require('./models/User'); // Need a user to assign as organizer

const seedEvents = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected for Seeding");

        // Find an admin user to be the organizer
        const adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.error("❌ No admin user found to assign as organizer. Please register an admin first.");
            process.exit(1);
        }

        console.log(`Using admin ${adminUser.username} as organizer.`);

        const eventTypes = ['Workshop', 'Seminar', 'Hackathon', 'Conference', 'Meetup', 'Webinar', 'Bootcamp'];
        const topics = ['AI & Machine Learning', 'Web Development', 'Cloud Computing', 'Cybersecurity', 'Data Science', 'Blockchain', 'IoT', 'UI/UX Design', 'Mobile Dev', 'DevOps'];
        const locations = ['Main Auditorium', 'Seminar Hall A', 'Lab 101', 'Virtual (Zoom)', 'Library', 'Tech Park', 'Innovation Center', 'Lab 204'];

        const newEvents = [];

        for (let i = 1; i <= 50; i++) {
            const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const randomTopic = topics[Math.floor(Math.random() * topics.length)];
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];

            // Random date between today and 60 days from now
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 60) + 1);

            // Random time (e.g., 09:00, 14:30)
            const hours = Math.floor(Math.random() * (18 - 9 + 1)) + 9; // 9 AM to 6 PM
            const minutes = Math.random() < 0.5 ? '00' : '30';
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`;

            newEvents.push({
                organizer: adminUser._id,
                title: `${randomType} on ${randomTopic}`,
                description: `Join us for an exciting ${randomType.toLowerCase()} covering the latest trends in ${randomTopic}. This is event #${i} in our special series designed to boost your skills. Don't miss out on insights from industry experts.`,
                date: futureDate,
                time: formattedTime,
                location: randomLocation,
                brochureUrl: Math.random() > 0.3 ? 'https://example.com/brochure.pdf' : '', // 70% chance to have a brochure
            });
        }

        await Event.insertMany(newEvents);
        console.log(`✅ Successfully seeded 50 mock events!`);

        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedEvents();
