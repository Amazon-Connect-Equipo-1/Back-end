import express, { Response } from 'express';
import AbstractController from '../controllers/AbstractController';
import db from '../models';

class Server{
    //Class attributes
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

    //Load middlewares
    private loadMiddlewares(middlewares:any):void{
        middlewares.forEach((middlewares:any) => {
            this.app.use(middlewares);
        });
    }

    //Load routes
    private routes(controllers:AbstractController[]):void{
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

    //Add the connection to the database
    private async databases(){
        await db.sequelize.sync();
    }

    //Init the app
    public async init(){
        await this.databases();
        this.app.listen(this.port, () => {
            console.log(`Server:Running @'http://localhost:${this.port}'`);
        });
    }
}

export default Server;