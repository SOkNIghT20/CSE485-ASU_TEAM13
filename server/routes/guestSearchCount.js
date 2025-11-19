"use strict";
const express = require('express');
const router = express.Router();
const db = require('../routes/dbconnect.js');

// GET /guestSearchCount - Returns how many searches a guest user has left
router.get('/guestSearchCount', function(req, res) {
    // Get the client's IP address
    const clientIP = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.connection.remoteAddress;
    
    // Max searches allowed for guest users
    const MAX_GUEST_SEARCHES = 5;
    
    const connection = db.getPool();
    
    // Get the current search count for this IP
    connection.query(
        'SELECT search_count FROM dc.guest_searches WHERE ip_address = ?',
        [clientIP],
        function(err, results) {
            if (err) {
                console.error('Error getting guest search count:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            // If no record found, they have all searches available
            if (!results || results.length === 0) {
                return res.json({ searchesLeft: MAX_GUEST_SEARCHES });
            }
            
            // Calculate searches left
            const searchCount = results[0].search_count;
            const searchesLeft = Math.max(0, MAX_GUEST_SEARCHES - searchCount);
            
            res.json({ searchesLeft: searchesLeft });
        }
    );
});

// POST /resetGuestSearches - Resets all guest search counts
router.post('/resetGuestSearches', function(req, res) {
    console.log('Received request to reset all guest searches');
    
    const connection = db.getPool();
    
    // Truncate the guest_searches table to reset all counts
    connection.query(
        'TRUNCATE TABLE dc.guest_searches',
        function(err, result) {
            if (err) {
                console.error('Error resetting guest search counts:', err);
                return res.status(500).json({ 
                    success: false, 
                    message: 'Failed to reset guest searches',
                    error: err.message
                });
            }
            
            console.log('All guest search counts have been reset at ' + new Date().toISOString());
            res.status(200).json({ 
                success: true, 
                message: 'All guest searches have been reset successfully' 
            });
        }
    );
});

module.exports = router;
