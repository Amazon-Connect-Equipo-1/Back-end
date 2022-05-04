"use strict";
/*
dynamoService.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 01/05/2022

Service that contains the configurations of the AWS SDK
*/
exports.__esModule = true;
/* import dynamodb from 'dynamodb';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION } from '../config'; */
var dynamodb = require('dynamodb');
var AWS_ACCESS_KEY = require('../config');
var AWS_SECRET_ACCESS_KEY = require('../config');
var AWS_REGION = require('../config');
//SDK configuration in Node.js to work with the cloud
dynamodb.AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});
exports["default"] = dynamodb;
