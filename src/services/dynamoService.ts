/*
dynamoService.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 01/05/2022

Service that contains the configurations of the AWS SDK
*/

/* import dynamodb from 'dynamodb';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config'; */
const dynamodb = require('dynamodb');
const AWS_ACCESS_KEY = require('../config');
const AWS_SECRET_ACCESS_KEY = require('../config');
const  AWS_REGION = require('../config');

//SDK configuration in Node.js to work with the cloud
dynamodb.AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

export default dynamodb;