const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());


const port = 3050;
const host = "192.168.5.16";

app.listen(port,host, () => console.log(`Server running at http://${host}:${port}. Listening for POST /api/chat requests`));


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});