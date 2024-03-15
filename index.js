import express from 'express';
import fileupload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.resolve();

const APP = express();
const PORT = 5000;

const S3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: '',
        secretAccessKey: ''
    }
});

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

APP.post('/upload', async (req, res) => {
    let file = req.files.upload;

    const command = new PutObjectCommand({
        Bucket: 'kyu0-test',
        Key: 'public/image/sample.jpg', // 경로+파일명
        Body: file.data
    });

    try {
        const response = await S3.send(command);
        if (response.$metadata.httpStatusCode == 200) {
            res.send({success: true, path: getSavedPath('public/image/sample.jpg')});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, data: error});
    }
});

function getSavedPath(filePath) {
    const bucketname = 'kyu0-test';
    const region = 'ap-northeast-2';
    return `https://${bucketname}.s3.${region}.amazonaws.com/${filePath}`;
}

APP.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});