/*
Server.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 29/04/2022

Program that handles the server, controllers and middlewares of the project
*/

import express, { Response } from 'express';
import AbstractController from '../controllers/AbstractController';
import db from '../models';

class Server{
    /*
    Class that defines and handles the server methods
    */

    //Attributes
    private app: express.Application;
    private port: number;
    private env: string;

    //Constructor
    constructor(appInit:{port:number;middlewares:any[];controllers:AbstractController[];env:string}){
        this.app = express();
        this.port = appInit.port;
        this.env = appInit.env;
        this.loadMiddlewares(appInit.middlewares);
        this.routes(appInit.controllers);
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
        middlewares.forEach((middlewares:any) => {
            //Iteration over the middlewares array to load them
            this.app.use(middlewares);
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
            this.app.use(`/${controller.prefix}`, controller.router)
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
            console.log(`Server:Running @'http://localhost:${this.port}'`);
        });
    }
}

export default Server;