/*
AgentController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado

Creation date: 28/04/2022
Last modification date: 20/05/2022

Program that defines the controller for the Agent, its routes and functionalities
*/

import AbstractController from './AbstractController';
import {Request, Response} from 'express';
import db from '../models';
import fetch from 'node-fetch';
import { checkSchema } from 'express-validator';
import cryptoService from '../services/cryptoService';

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

    //Body validation
    protected validateBody(type:|'agentForgotPassword'|/*'agentResetPassword'|*/'acceptFeedback'){
        switch(type){
            case 'agentForgotPassword':
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            /*case 'agentResetPassword': 
                return checkSchema({
                    token: {
                        isString: {
                            errorMessage: 'Invalid token. Token is not a string'
                        }
                    },
                    password: {
                        isString: {
                            errorMessage: 'Password must be a string'
                        },
                        isLength: {
                            options: {
                                min: 8
                            },
                            errorMessage: 'Must be at least 8 characters long'
                        }
                    }
                });*/
            case 'acceptFeedback':
                return checkSchema({
                    comment_id: {
                        isString: {
                            errorMessage: 'Comment ID must be a string'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes(): void {
        /*this.router.post('/agentLogin', this.postAgentLogin.bind(this)); 
        this.router.post('/createAgents', this.postCreateAgents.bind(this)); */ 
        this.router.get('/agentProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getAgentProfile.bind(this));
        this.router.post('/agentForgotPassword', this.authMiddleware.verifyToken, this.validateBody('agentForgotPassword'), this.handleErrors, this.postAgentForgotPassword.bind(this));
        this.router.get('/agentResetPassword', this.authMiddleware.verifyToken, /*this.validateBody('agentResetPassword'),*/ this.handleErrors, this.getAgentResetPassword.bind(this));  
        this.router.post('/acceptFeedback', this.authMiddleware.verifyToken, this.validateBody('acceptFeedback'), this.handleErrors, this.acceptFeedback.bind(this)); 
        this.router.get('/getFeedback', this.authMiddleware.verifyToken, this.handleErrors, this.getFeedback.bind(this)); 
    }

    //Controllers
    /* private async postAgentLogin(req:Request, res:Response){
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
    } */  
    
    /* private async postCreateAgents(req:Request, res:Response){
        try{
            await db["Agent"].create(req.body);
            console.log("Agent registered");
            res.status(200).send("Agent registered")
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error")
        }
    } */

    private async getAgentProfile(req:Request, res:Response){
        try{
            let result:any = await db["Agent"].findAll({
                where: {
                    email: req.query.email?.toString()
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
        //Encription service
        const encryption = new cryptoService();

        //Creating and encrypting the token
        var token = req.body.email + "$" + Date.now();
        var encryptedToken = encryption.encrypt(token);
        
        //Updating the token at the database
        await db["Agent"].update({security_token: token}, {
            where: {
                email: req.body.email
            }
        });
         
        //Building the message
        const message = "Click the following link to reset your password:"
        const link = "http://localhost:8080/agent/agentResetPassword?token=" + encryptedToken.iv + "$" + encryptedToken.content;

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
         //Encrypting service
         const encryption = new cryptoService();

         //Parsing data within the token query
         var query_data:any = req.query.token?.toString().split("$");
 
         //Encrypted token and its keys to be dencrypted
         const cipher_data = {
             iv: Buffer.from(query_data[0], 'hex'), 
             content: Buffer.from(query_data[1], 'hex'),
         };
 
         const token = encryption.dencrypt(cipher_data);

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

    private async acceptFeedback(req:Request, res:Response){
        try{
            await db["Comments"].update({seen: true}, {
                where:{
                    comment_id: req.body.comment_id
                }
            });
            res.status(200).send({message: `Comment ${req.body.comment_id} has been updated`});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getFeedback(req:Request, res:Response){
        const email = req.query.email?.toString();
        try{
            let agent = await db["Agent"].findAll({
                attributes: ['agent_id', 'name'],
                where: {
                    email: email
                }
            });

            let feedback = await db["Comments"].findAll({
                attributes: ['super_id', 'comment', 'rating', 'date'],
                where: {
                    agent_id: agent[0].agent_id
                }
            });

            res.status(200).send({agent_name: agent[0].name, agent_email: email, comments: feedback});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default AgentController;