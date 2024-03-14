import express from 'express';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const APP = express();
const PORT = 5000;

APP.use('/script', express.static(__dirname + '/script'));

APP.get('/', (req, res) => {
    fs.readFile('main.html', (error, data) => {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(data);
    });
});;

APP.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});