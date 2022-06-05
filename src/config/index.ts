/*
index.ts
Authors:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 28/04/2022
Last modification date: 01/06/2022

Index that defines all the sensitive and confidential data within the project
*/

export const PORT:number = process.env.PORT ? + process.env.PORT: 8080;
export const HTTPS_PORT:number = process.env.HTTPS_PORT ? + process.env.HTTPS_PORT: 8080;
export const NODE_ENV:string = process.env.NODE_ENV ? process.env.NODE_ENV as string : 'development';
export const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : 'test';
export const DB_DIALECT = process.env.DB_DIALECT ? process.env.DB_DIALECT : 'mysql';
export const DB_USER = process.env.DB_USER ? process.env.DB_USER : 'root';
export const DB_PASSWORD = process.env.DB_PASSWORD ? process.env.DB_PASSWORD : 'root';
export const DB_HOST = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
export const AWS_REGION = process.env.AWS_REGION ? process.env.AWS_REGION : 'us-east-1';
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY ? process.env.AWS_ACCESS_KEY : "";
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY : "";
export const PREFIX_TABLE = NODE_ENV === 'production' ? '' : '-DEV';
export const COGNITO_APP_CLIENT_ID = process.env.COGNITO_APP_CLIENT_ID ? process.env.COGNITO_APP_CLIENT_ID : "";
export const COGNITO_APP_SECRET_HASH = process.env.COGNITO_APP_SECRET_HASH ? process.env.COGNITO_APP_SECRET_HASH : "";
export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID ? process.env.COGNITO_USER_POOL_ID : "";  
export const HASH_ALGORITHM = process.env.HASH_ALGORITHM ? process.env.HASH_ALGORITHM : "";
export const CONNECT_INSTANCE_ID = process.env.CONNECT_INSTANCE_ID ? process.env.CONNECT_INSTANCE_ID : "";
export const CONNECT_ROUTING_PROFILE_ID = process.env.CONNECT_ROUTING_PROFILE_ID ? process.env.CONNECT_ROUTING_PROFILE_ID : "";
export const CONNECT_MANAGER_PROFILE_ID = process.env.CONNECT_MANAGER_PROFILE_ID ? process.env.CONNECT_MANAGER_PROFILE_ID : "";
export const CONNECT_QUALITY_ANALYST_PROFILE_ID = process.env.CONNECT_QUALITY_ANALYST_PROFILE_ID ? process.env.CONNECT_QUALITY_ANALYST_PROFILE_ID : "";
export const CONNECT_AGENT_PROFILE_ID = process.env.CONNECT_AGENT_PROFILE_ID ? process.env.CONNECT_AGENT_PROFILE_ID : "";
export const NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED ? process.env.NODE_TLS_REJECT_UNAUTHORIZED : 1;
export const S3_CLICK_KEY_BUCKET = process.env.S3_CLICK_KEY_BUCKET ? process.env.S3_CLICK_KEY_BUCKET : "";