import dynamodb from 'dynamodb';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config';

//SDK configutation in Node.js to work with the cloud
dynamodb.AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

export default dynamodb;