import express from 'express';
import fileupload from 'express-fileupload';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __dirname = path.resolve();

const APP = express();
const PORT = 5000;

/**
 * 각자의 환경에 맞는 값을 S3Information 변수에 입력해주세요
 * !! 민감한 정보는 (예: secretAccessKey) 깃허브 원격 저장소에 노출되지 않도록 주의해주세요 !
 */
const S3Information = {
    region: '',
    bucketname: '',
    accessKeyId: '',
    secretAccessKey: '',
};

const S3 = new S3Client({
    region: S3Information.region,
    credentials: {
        accessKeyId: S3Information.accessKeyId,
        secretAccessKey: S3Information.secretAccessKey
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
        Bucket: S3Information.bucketname,
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
    return `https://${S3Information.bucketname}.s3.${S3Information.region}.amazonaws.com/${filePath}`;
}

APP.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`);
});