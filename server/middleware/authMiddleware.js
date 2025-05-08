const jwt = require('jsonwebtoken');
const { users } = require('../data'); // For fetching user details if needed, though JWT should contain role

const JWT_SECRET = 'your-very-secret-key'; // Store this in an environment variable in a real app

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Token is not valid' });
        }
        req.user = user; // Contains { id, role }
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin role required.' });
    }
};

const isInstitutionOwnerOrAdmin = (req, res, next) => {
    const institutionId = req.params.institutionId || req.body.institutionId;
    if (req.user && (req.user.role === 'admin' || (req.user.role === 'institution' && req.user.id === institutionId))) {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Not authorized for this institution.' });
    }
};


module.exports = {
    authenticateToken,
    isAdmin,
    isInstitutionOwnerOrAdmin,
    JWT_SECRET,
};
