/*
AuthenticationController.ts
Author:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 18/05/2022
Last modification date: 18/05/2022

Program that handles all controllers used for the Client
*/

import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';
import db from '../models';

class ClientController extends AbstractController{
    //Singleton
    private static instance: ClientController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new ClientController("client");
        return this.instance;
    }

    //Methods
    protected initRoutes():void {
        //Routes fot his controller
        this.router.post('/clientLogin', this.clientLogin.bind(this));
        this.router.post('/clientRegister', this.clientRegister.bind(this));
    }

    private async clientLogin(req:Request, res:Response){
        try{
            let result = await db["Client"].findAll({
                where: {
                    email: req.body.email,
                    password: req.body.password
                }
            });

            if(result.length > 0){
                res.status(200).send({message: "Logged in", body: result[0]});
            }else{
                res.status(404).send({message: "Incorrect email or password"});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async clientRegister(req:Request, res:Response){
        try{
            let register = await db["Client"].create(req.body);
            console.log("Client registered");
            res.status(200).send({message: "Client registered", body: register});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    protected validateBody(type: any) {
        //To be implemented
    }

}

export default ClientController;