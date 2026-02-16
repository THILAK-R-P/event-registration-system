const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const email = "admin@example.com";
        const password = "adminpassword";
        const username = "adminUser";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log(`User ${email} already exists. Updating role to admin.`);
            existingUser.role = 'admin';
            existingUser.password = await bcrypt.hash(password, 10); // Reset password to ensure access
            await existingUser.save();
            console.log("Admin user updated successfully.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                username,
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log("Admin user created successfully.");
        }

        console.log("-----------------------------------");
        console.log("Login Credentials:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log("-----------------------------------");

        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
