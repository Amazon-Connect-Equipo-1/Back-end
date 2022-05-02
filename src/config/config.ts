/*
config.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 28/04/2022

Program that stores all of the credentials related to AWS and the RDS database
*/

import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } from './index';

export default{
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "mysql"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
