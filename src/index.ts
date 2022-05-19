/*
index.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 15/05/2022

Program that creates the Server and initializes it
*/

import Server from './providers/Server';
import AgentController from './controllers/AgentController';
import ManagerController from './controllers/ManagerController';
import ThirdPartyServicesController from './controllers/ThirdPartyServiceController';
import WrittenTutorialsController from './controllers/WrittenTutorialsControllers';
import AuthenticationController from './controllers/AuthenticationController';
import { PORT, NODE_ENV } from './config';
import express from 'express';
import cors from 'cors';
import RecordingsController from './controllers/RecordingsController';
import ClientController from './controllers/ClientController';



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
        RecordingsController.getInstance(),
        ManagerController.getInstance(),
        ThirdPartyServicesController.getInstance(),
        WrittenTutorialsController.getInstance(),
        AuthenticationController.getInstance(),
        ClientController.getInstance()
    ],
    env: NODE_ENV
});

//Initializing the server
app.init();