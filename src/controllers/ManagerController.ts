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
import RecordingsModel from '../modelsNoSQL/recordings';

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

    //Body validation
    protected validateBody(type:|'createAgent'|'updateAgent'|'deleteAgent'){
        //To be implemented
    }

    //Route configuration
    protected initRoutes(): void {
        this.router.post('/createManagers', this.postCreateManagers.bind(this));  
        this.router.post('/agentList', this.agentList.bind(this));   
        this.router.get('/showRecording', this.showRecording.bind(this));
        this.router.post('/postComment', this.postComment.bind(this));
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

    private async agentList(req:Request, res:Response){
        //Check if show only manager's agents or all agents
        try{
            let agents = await db["Agent"].findAll();
            res.status(200).send({agents: agents});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async showRecording(req:Request, res:Response){
        
    }

    private async postComment(req:Request, res:Response){
        try{
            await db["Comments"].create(req.body);

            let agent_email = await db["Agent"].findAll({
                attributes: ['email'],
                where: {
                    agent_id: req.body.agent_id
                }
            });

            res.status(200).send({message: `Comment to ${agent_email}`});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default ManagerController;