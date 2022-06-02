/*
index.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Erick Alberto Bustos Cruz
- Liam Garay Monroy

Creation date: 28/04/2022
Last modification date: 02/06/2022

Program that creates the Server and initializes it
*/

//Libraries that will be used
import { PORT, NODE_ENV } from './config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import Server from './providers/Server';
import AgentController from './controllers/AgentController';
import ManagerController from './controllers/ManagerController';
import ThirdPartyServicesController from './controllers/ThirdPartyServiceController';
import AuthenticationController from './controllers/AuthenticationController';
import KeyClickController from './controllers/KeyClickController';
import ClientController from './controllers/ClientController';
import UserConfigController from './controllers/UserConfigurations';

const app = new Server({
    //Parameters of the server
    port: PORT,
    middlewares: [
        //Middlewares that will be used
        express.json(),
        express.urlencoded({extended: true}),
        cors()
    ],
    controllers: [
        //Controllers that will be loaded
        AgentController.getInstance(),
        KeyClickController.getInstance(),
        ManagerController.getInstance(),
        ThirdPartyServicesController.getInstance(),
        AuthenticationController.getInstance(),
        ClientController.getInstance(),
        UserConfigController.getInstance(),
    ],
    env: NODE_ENV,
    //Reading the certificates and keys
    privateKey: fs.readFileSync('dist/sslcert/privatekey.pem',{encoding:'utf8'}),
    certificate: fs.readFileSync('dist/sslcert/server.crt',{encoding:'utf8'})
});

//Extending the Request interface from the Express module
declare global{
    namespace Express{
        interface Request{
            user:string;
            token:string;
        }
    }
}

//Initializing the server
app.init();