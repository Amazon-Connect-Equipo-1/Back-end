/*
AgentController.ts
Authors:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado
- David Rodriguez Fragoso

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the controller for the Agent, its routes and functionalities
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import {Request, Response} from 'express';
import db from '../models';
import AbstractController from './AbstractController';

class AgentController extends AbstractController{
    //Singleton
    private static instance:AgentController;

    //Getter
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
    protected validateBody(type:|'acceptFeedback'|'updateProfilePicture'){
        switch(type){
            case 'acceptFeedback':
                return checkSchema({
                    comment_id: {
                        isString: {
                            errorMessage: 'Comment ID must be a string'
                        }
                    }
                });
            case 'updateProfilePicture':
                return checkSchema({
                    profile_picture: {
                        isString: {
                            errorMessage: 'Must be a string'
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
        this.router.post('/updateProfilePicture', this.authMiddleware.verifyToken, this.validateBody('updateProfilePicture'), this.handleErrors, this.updateProfilePicture.bind(this)); 
    }

    //Controllers
    private async getAgentProfile(req:Request, res:Response){
        /*
        Method that returns the profile of an agent given his email as query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Finding the agent profile
            let result:any = await db["Agent"].findAll({
                where: {
                    email: req.query.email?.toString()
                },
                raw: true
            });

            if(result.length > 0){
                //If found, return it
                console.log(result);
                res.status(200).send(result[0]);
            }else{
                //If not return an agent not found exception
                console.log(`No agent with email: ${req.body.email} found`);
                res.status(500).send({message: `No agent with email: ${req.body.email} found`});
            }
        }catch(err:any){
            //If exception occurs inform 
            console.log(err);
            res.status(500).send({code: err.code, message: err.message});
        }
    }

    private async acceptFeedback(req:Request, res:Response){
        /*
        Method that lets agents to accept feedback given by their supervisors

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Search the comment that will be accepted in the database and update its state
            await db["Comments"].update({seen: true}, {
                where:{
                    comment_id: req.body.comment_id
                }
            });

            res.status(200).send({message: `Comment ${req.body.comment_id} has been updated`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getFeedback(req:Request, res:Response){
        /*
        Method that returns the feedbkac given by supervisors to an agent by query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const email = req.query.email?.toString();
        try{
            //Find agenby his email
            let agent = await db["Agent"].findAll({
                attributes: ['agent_id', 'name'],
                where: {
                    email: email
                }
            });

            //Find relevant data of the comment using the agent id
            let feedback = await db["Comments"].findAll({
                attributes: ['super_id', 'comment', 'rating', 'date'],
                where: {
                    agent_id: agent[0].agent_id
                }
            });

            res.status(200).send({agent_name: agent[0].name, agent_email: email, comments: feedback});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async updateProfilePicture(req:Request, res:Response){
        const {user_id, profile_picture} = req.body

        try{
            await db["Agent"].update({profile_picture: profile_picture}, {
                where: {
                    agent_id: user_id
                }
            });

            res.status(200).send({message: "Profile picture updated!"});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default AgentController;