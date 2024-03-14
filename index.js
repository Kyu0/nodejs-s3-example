import express from 'express';
import fileupload from 'express-fileupload';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

const APP = express();
const PORT = 5000;

APP.use('/script', express.static(__dirname + '/script'));
APP.use('/upload', express.static(__dirname + '/upload'));
APP.use(express.json());
APP.use(fileupload());
APP.use(express.urlencoded({ extended: true }));

APP.get('/', (req, res) => {
    fs.readFile('main.html', (error, data) => {
        res.writeHead(200, { 'Content-Type' : 'text/html' });
        res.end(data);
    });
});

APP.post('/upload', (req, res) => {
    let file = req.files.upload;

    file.mv(`${__dirname}/upload/${file.name}`, (error) => {
        if (error) {
            return res.status(500).send(error);
        }

        res.json({ success: true, path: `/upload/${file.name}` });
    });
});

APP.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});