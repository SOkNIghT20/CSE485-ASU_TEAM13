"use strict";
const express = require('express');
const router = express.Router();
const db = require('../routes/dbconnect.js');

// POST /requestDemo - Submit a demo request
router.post('/requestDemo', function(req, res) {
    const { email } = req.body;
    const clientIP = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;
    
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const connection = db.getPool();
    
    connection.query(
        'INSERT INTO dc.demo_requests (email, ip_address) VALUES (?, ?) ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP',
        [email, clientIP],
        function(err, result) {
            if (err) {
                console.error('Error submitting demo request:', err);
                return res.status(500).json({ success: false, message: 'Failed to submit request' });
            }
            
            console.log('Demo request submitted for email:', email, 'at', new Date().toISOString());
            res.status(200).json({ success: true, message: 'Demo request submitted successfully' });
        }
    );
});

// GET /checkDemoStatus - Check if IP has an approved demo
router.get('/checkDemoStatus', function(req, res) {
    const clientIP = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;
    
    const connection = db.getPool();
    
    connection.query(
        'SELECT * FROM dc.demo_requests WHERE ip_address = ? AND status = "approved"',
        [clientIP],
        function(err, results) {
            if (err) {
                console.error('Error checking demo status:', err);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            
            if (!results || results.length === 0) {
                return res.json({ approved: false });
            }
            
            res.json({ approved: true, email: results[0].email });
        }
    );
});

module.exports = router; 