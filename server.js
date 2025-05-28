const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Callback endpoint for OAuth/API redirects
app.get('/callback', (req, res) => {
    console.log('Callback received!');
    console.log('Query parameters:', req.query);
    console.log('Headers:', req.headers);
    
    // Extract common OAuth parameters
    const { code, state, error, error_description } = req.query;
    
    if (error) {
        console.error('OAuth Error:', error, error_description);
        return res.status(400).json({
            success: false,
            error: error,
            error_description: error_description
        });
    }
    
    if (code) {
        console.log('Authorization code received:', code);
        // Here you would typically exchange the code for an access token
        
        res.json({
            success: true,
            message: 'Callback received successfully',
            code: code,
            state: state
        });
    } else {
        res.json({
            success: true,
            message: 'Callback endpoint is working',
            query: req.query
        });
    }
});

// POST callback endpoint (for webhooks)
app.post('/callback', (req, res) => {
    console.log('POST Callback received!');
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);
    
    res.json({
        success: true,
        message: 'POST callback received',
        received_data: req.body
    });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send(`
        <h1>MyApp Server</h1>
        <p>Callback endpoint is ready at: <a href="/callback">/callback</a></p>
        <p>Server running on port ${port}</p>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Callback URL: http://localhost:${port}/callback`);
});

module.exports = app;