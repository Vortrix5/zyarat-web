const express = require('express');
const jwt = require('jsonwebtoken');
const { users } = require('../data');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password); // Plain text password check (BAD for production)

    if (user) {
        const tokenPayload = { id: user.id, role: user.role, email: user.email };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
        res.json({
            success: true,
            data: {
                token,
                user: { id: user.id, role: user.role, name: user.name },
            },
        });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

module.exports = router;
