import express from 'express';
import fs from 'fs';

const APP = express();
const PORT = 5000;

APP.get('/', (req, res) => {
    fs.readFile('index.html', (error, data) => {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(data);
    });
});;

APP.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});