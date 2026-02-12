const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const tokenHeader = req.header('Authorization');

    // Check if not token
    if (!tokenHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Remove 'Bearer ' if present
        consttoken = tokenHeader.replace('Bearer ', '');

        const decoded = jwt.verify(consttoken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};