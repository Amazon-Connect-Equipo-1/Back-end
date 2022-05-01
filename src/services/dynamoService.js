"use strict";
exports.__esModule = true;
var dynamodb_1 = require("dynamodb");
var config_1 = require("../config");
//SDK configutation in Node.js to work with the cloud
dynamodb_1["default"].AWS.config.update({
    accessKeyId: config_1.AWS_ACCESS_KEY,
    secretAccessKey: config_1.AWS_SECRET_ACCESS_KEY,
    region: config_1.AWS_REGION
});
exports["default"] = dynamodb_1["default"];
