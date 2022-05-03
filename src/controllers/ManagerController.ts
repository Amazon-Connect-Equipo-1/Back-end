/*
ManagerController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado

Creation date: 03/05/2022
Last modification date: 03/05/2022

Program that defines the controller for the Manager, its routes and functionalities
*/

import AbstractController from './AbstractController';
import {Request, Response} from 'express';
import db from '../models/index';

class ManagerController extends AbstractController{
    //Singleton
    private static instance:ManagerController;

    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new ManagerController("manager");
        return this.instance;
    }

    //Route configuration
    protected initRoutes(): void {
        this.router.post('/createManagers', this.postCreateManagers.bind(this));     
    }

    //Controllers
    private async postCreateManagers(req:Request, res:Response){
        try{
            await db["Manager"].create(req.body);
            console.log("Manager registered");
            res.status(200).send("Manager registered")
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error")
        }
    }
}

export default ManagerController;