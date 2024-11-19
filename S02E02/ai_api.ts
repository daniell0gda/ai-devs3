import express from 'express';
import { askForImage } from "./ai";
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const corsOptions = {
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all methods
    allowedHeaders: '*', // Allow all headers
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
const path = require('path');

// app.options('*', cors()); // Enable pre-flight across-the-board


const port = 3030;
const host = "192.168.5.16";

const options = {
    key: fs.readFileSync(path.join(__dirname, 'privkey.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cacert.pem')),
    ca: fs.readFileSync(path.join(__dirname, 'web-cert/web-cert.pem')),
    requestCert: true,
    rejectUnauthorized: true 
};

https.createServer(options, app).listen(3031, () => {
    console.log(`Listening on https://${host}:3031`);
});

app.listen(port,host, () => console.log(`Server running at http://${host}:${port}. Listening for POST /api/chat requests`));


app.post('/api/image', async (req, res) => {
  const { image } = req.body;
  try {

    console.log('incomming api..', image);
    let result = await askForImage(image);

    console.log(result)

    return res.json({ result });
  } catch (error) {
    console.error('Error in chat processing:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.get('/', (req, res) => {
    res.json({ message: 'CORS is enabled!' });
});



async function sendImageToAPI(base64Image:string) {
    try {
        const response = await fetch('http://juszkowo:3030/api/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image: base64Image
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data.result);
        return data.result;
    } catch (error) {
        console.error('Error sending image:', error);
        throw error;
    }
}


// sendImageToAPI(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA
// AAAACAIAAAD2nQ8EAAAAHHRFWHRDcmVhdGlvbiBUaW1lIDExLzEyLzIwMTQgMTI6MTA6MjYgUE0g
// MTAwMDAwMAAAACXBIWXMAAB7CAAAewgFu0HU+AAABGklEQVR42mJ8//8/AwAIgJcA2gVIAAAAABJRU5ErkJggg==`);