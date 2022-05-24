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
    protected validateBody(type:'acceptFeedback'){
        switch(type){
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
        this.router.get('/agentProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getAgentProfile.bind(this));
        this.router.post('/acceptFeedback', this.authMiddleware.verifyToken, this.validateBody('acceptFeedback'), this.handleErrors, this.acceptFeedback.bind(this)); 
        this.router.get('/getFeedback', this.authMiddleware.verifyToken, this.handleErrors, this.getFeedback.bind(this)); 
    }

    //Controllers
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