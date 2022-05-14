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
                //Return quality or not and data of agent
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
        //Token and its keys to be encrypted
        var token = req.body.email + "$" + Date.now();
        const iv = crypto.randomBytes(16);
        const key = crypto.randomBytes(32);

        //Creating the cypher for the token
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);

        //Encrypting the token
        var encrypted_token = cipher.update(token);
        encrypted_token = Buffer.concat([encrypted_token, cipher.final()]);
        
        //Updating the token at the database
        await db["Agent"].update({security_token: token}, {
            where: {
                email: req.body.email
            }
        });
         
        //Building the message
        const message = "Click the following link to reset your password:"
        const link = "http://localhost:8080/agent/agentResetPassword?token=" 
        + encrypted_token.toString('hex') + "$" + iv.toString('hex') + "$" + key.toString('hex');

        //Payload to fetch emailMessaging API
        const payload ={
            "recipient": "israelsanchez0109@outlook.com",  //For testing, when deployed it will be req.body.email
            "message": message,
            "link": link,
            "subject": "Request to change your password."
        }
         console.log(payload);
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
        //Parsing data within the token query
        var cipher_data:any = req.query.token?.toString().split("$");

        //Encrypted token and its keys to be dencrypted
        const encrypted_token = Buffer.from(cipher_data[0], 'hex');
        const iv = Buffer.from(cipher_data[1], 'hex');
        const key = Buffer.from(cipher_data[2], 'hex');

        //Creating the decipher for the token
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);

        //Dencrypting the token
        var decrypted_token = decipher.update(encrypted_token);
        decrypted_token = Buffer.concat([decrypted_token, decipher.final()]);

        //Original token
        const token = decrypted_token.toString();

        const query_result = await db["Agent"].findAll({
            where: {
                security_token: token
            }, 
            raw: true
        });

        if(query_result.length > 0){
            //Obtaining timestamp related to the token
            const timestamp = token.split("$")[1];
            if(Date.now() - parseInt(timestamp) < 300000){
                //If token is still valid the password changes *CHANGE PASSWORD IN COGNITO TOO*
                await db["Agent"].update({password: "WebiWabo", security_token: null}, {
                    where: {
                        security_token: token
                    }
                });
                res.status(200).send("Password changed succesfully!");
            } else {
                //If time exceeds 5 min the token expired
                res.status(500).send("Requested token has expired.");
            }
        }else{
            res.status(500).send("Invalid token.")
        }
    }
}

export default AgentController;