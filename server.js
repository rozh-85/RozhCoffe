
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(__dirname));

// Route for admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Any other routes handled by frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
🚀 Lokmada Frontend running on http://localhost:${PORT}
🌐 Connected to Supabase Cloud
    `);
});
