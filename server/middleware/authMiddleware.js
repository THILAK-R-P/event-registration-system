const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Get the token from the header
    const token = req.header('Authorization');

    // 2. Check if token exists
    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        // 3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add user info to the request
        next(); // Move to the next step
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};