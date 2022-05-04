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
import crypto from 'crypto';
import fetch from 'node-fetch';

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
        this.router.post('/agentForgotPassword', this.postAgentForgotPassword.bind(this));
        this.router.get('/agentResetPassword', this.getAgentResetPassword.bind(this));    
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

    private async postAgentForgotPassword(req:Request, res:Response){
        //const token = crypto.createCipheriv('aes-256-ocb', 'owo', crypto.randomBytes(16));
        const token = "12345"
        await db["Agent"].update({security_token: token}, {
            where: {
                email: req.body.email
            }
        });

        const payload ={
            "recipient": "israelsanchez0109@outlook.com",  //For testing, when deployed it will bbe req.body.mail
            "message": "Click the following link to reset your password: http://localhost:8080/agent/agentResetPassword?token=" + token,
            "subject": "Request to change your password."
        }

        try{
            await fetch('https://y63tjetjmb.execute-api.us-west-2.amazonaws.com/default/emailMessaging', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            res.status(200).send("Password resseting email sent!");
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error sending the mail");
        }
    }

    private async getAgentResetPassword(req:Request, res:Response){
        const query_result = await db["Agent"].findAll({
            where: {
                security_token: req.query.token
            }, 
            raw: true
        });
        if(query_result.length > 0){
            await db["Agent"].update({password: "WebiWabo"}, {
                where: {
                    security_token: req.query.token
                }
            });
            res.status(200).send("Password changed succesfully!");
        }else{
            res.status(500).send("Requested token has expired.")
        }
    }
}

export default AgentController;