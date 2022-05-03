/*
index.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that creates the Server and initializes it
*/

import Server from './providers/Server';
import AgentController from './controllers/AgentController';
import ManagerController from './controllers/ManagerController';
import ThirdPartyServiceController from './controllers/ThirdPartyServiceController';
import { PORT, NODE_ENV } from './config';
import express from 'express';
import cors from 'cors';


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
        ManagerController.getInstance(),
        ThirdPartyServiceController.getInstance()
    ],
    env: NODE_ENV
});

//Initializing the server
app.init();