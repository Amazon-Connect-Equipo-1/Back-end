/*
Server.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Erick Alberto Bustos Cruz
- Liam Garay Monroy

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that handles the server, controllers and middlewares of the project
*/

//Libraries that will be used
import { HTTPS_PORT } from '../config';
import express, { Response } from 'express';
import https from 'https';
import db from '../models';
import AbstractController from '../controllers/AbstractController';

class Server{
    //Attributes
    private app:express.Application;
    private port:number;
    private httpsPort:number ;
    private env:string;
    private credentials:any;
    private httpsServer:any;

    //Constructor
    constructor(appInit:{port:number;middlewares:any[];controllers:AbstractController[];env:string;privateKey:any;certificate:any}){
        this.app = express();
        this.credentials = {key: appInit.privateKey, cert: appInit.certificate}
        this.port = appInit.port;
        this.httpsPort = HTTPS_PORT;
        this.env = appInit.env;
        this.loadMiddlewares(appInit.middlewares);
        this.routes(appInit.controllers);
        this.httpsServer = https.createServer(this.credentials,this.app)
    }

    //Methods
    private loadMiddlewares(middlewares:any):void{
        /*
        Method that loads the middlewares into the server

        Parameters:
        middlewares - array of middlewares that will be loaded
        Returns:
        Nothing, but the method loads the middlewares into the app
        */
        middlewares.forEach((middleware:any) => {
            //Iteration over the middlewares array to load them
            this.app.use(middleware);
        });
    }

    private routes(controllers:AbstractController[]):void{
        /*
        Method that adds the routes defined by the controllers to the app

        Parameters:
        controllers - array of AbstractController objects that contains all the controllers and its routes
        Returns:
        Nothing, but adds all the routes to the app
        */
        //Auxiliar route to verify app is functioning
        this.app.get('/', (_:any, res:Response) => 
                    res.status(200).send({
                        message: "The backend module is working",
                        documentation: "https://github.com/Amazon-Connect-Equipo-1"
                    })         
        )
        //Add controllers
        controllers.forEach((controller:AbstractController) => {
            this.app.use(`/${controller.prefix}`, controller.router);
        });
    }

    private async databases(){
        /*
        Method that syncs the RDS databases defined with the app
        */
        await db.sequelize.sync();
    }

    public async init(){
        /*
        Method that initializes the app
        */
       //Loading databases
        await this.databases();
        this.app.listen(this.port, () => {
            //Running the server
            console.log(`Server: Running @'http://localhost:${this.port}'`);
        });
        this.httpsServer.listen(this.httpsPort, () => {
            //Runing https server
            console.log(`Server HTTPS: Running @'https://localhost:${this.httpsPort}'`);
        });
    }
}

export default Server;