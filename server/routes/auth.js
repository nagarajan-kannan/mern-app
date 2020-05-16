const path = require('path');
const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const ROUTE_CONFIG = require('../config/route-config');

// App login request
router.post('/login', (req, res) => {

    if (req.body.username === 'admin' && req.body.password === 'admin') {
        const payload = { username: req.body.username };
        const token = jwt.sign(payload, ROUTE_CONFIG.JWT_SECRET_CONFIG, { expiresIn: '2d' });

        return res.json({ success: true, name: 'Admin', token: token });
    } else {
        return res.json({ success: false });
    }

});

// Get request with token
router.get('/home', (req, res) => {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, ROUTE_CONFIG.JWT_SECRET_CONFIG, (err, decoded) => {
            if (err) {
                return res.json({ success: false, message: 'Invalid token key' });
            } else {
                return res.json({ success: true, message: 'Verified' });
            }
        });
    } else {
        return res.status(403).send({ success: false, message: 'No token provided' });
    }

});

/* GET api listing. */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

module.exports = router;
