/*
AgentController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado

Creation date: 28/04/2022
Last modification date: 03/05/2022

Program that defines the controller for the Agent, its routes and functionalities
*/

import AbstractController from './AbstractController';
import {Request, Response} from 'express';
import db from '../models/index';

class AgentController extends AbstractController{
    //Singleton
    private static instance:AgentController;

    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new AgentController("agent");
        return this.instance;
    }

    //Route configuration
    protected initRoutes(): void {
        this.router.post('/agentLogin', this.postAgentLogin.bind(this)); 
        this.router.post('/createAgents', this.postCreateAgents.bind(this));   
        this.router.get('/agentProfile', this.getAgentProfile.bind(this));
       /*  this.router.post('/agentForgotPassword', this.postAgentForgotPassword.bind(this)); 
        this.router.post('/agentResetPassword', this.postAgentResetPassword.bind(this));
         */     
    }

    //Controllers
    private async postAgentLogin(req:Request, res:Response){
        try {
            let result:any = await db["Agent"].findAll({
                where: {
                    email: req.body.email,
                    password: req.body.password
                },
                raw: true
            });

            if(result.length > 0){
                console.log("Logged in");
                res.status(200).send("Logged in");
            }else{
                console.log("Agent not found");
                res.status(404).send("Agent not found");
            }
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error");
        }
    }  
    
    private async postCreateAgents(req:Request, res:Response){
        try{
            await db["Agent"].create(req.body);
            console.log("Agent registered");
            res.status(200).send("Agent registered")
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error")
        }
    }

    private async getAgentProfile(req:Request, res:Response){
        try{
            let result:any = await db["Agent"].findAll({
                where: {
                    email: req.body.email
                },
                raw: true
            });
            if(result.length > 0){
                console.log(result);
                res.status(200).send(result);
            }else{
                console.log(`No agent with email: ${req.body.email} found`);
                res.status(500).send(console.log(`No agent with email: ${req.body.email} found`));
            }
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error retrieving agent data")
        }
    }
}

export default AgentController;