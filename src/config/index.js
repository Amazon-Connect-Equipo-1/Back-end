"use strict";
/*
index.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 29/04/2022

Index that defines all the sensitive and confidential data within the project
*/
exports.__esModule = true;
exports.PREFIX_TABLE = exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY = exports.AWS_REGION = exports.DB_HOST = exports.DB_PASSWORD = exports.DB_USER = exports.DB_DIALECT = exports.DB_NAME = exports.NODE_ENV = exports.PORT = void 0;
exports.PORT = process.env.PORT ? +process.env.PORT : 8080;
exports.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
exports.DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'test';
exports.DB_DIALECT = process.env.DB_DIALECT ? process.env.DB_DIALECT : 'mysql';
exports.DB_USER = process.env.DB_USER ? process.env.DB_USER : 'root';
exports.DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'root';
exports.DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
exports.AWS_REGION = process.env.AWS_REGION ? process.env.AWS_REGION : 'us-east-1';
exports.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : "";
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : "";
exports.PREFIX_TABLE = exports.NODE_ENV === 'production' ? '' : '-DEV';
