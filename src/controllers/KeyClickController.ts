/*
KeyClickControllers.ts
Authors:
- Ariadna Huesca Coronado
- Israel Sánchez Miranda
- Claudia Sarahí Armenta Maya

Creation date: 15/05/2022
Last modification date: 02/05/2022

Program that defines the controller for the Recordings, its routes and functionalities
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import { Request, Response } from 'express';
import AbstractController from './AbstractController';

class KeyClickController extends AbstractController{
    //Singleton
    private static instance:KeyClickController;

    //Getters
    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new KeyClickController("keyclick");
            return this.instance;
    }

    //Body validation
    protected validateBody(type:|'addKeystroke'|'addClick'){
        switch(type){
            case 'addKeystroke': 
                return checkSchema({
                    key: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
                case 'addClick': 
                return checkSchema({
                    button: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/addKeystroke', this.authMiddleware.verifyToken, this.validateBody('addKeystroke'), this.handleErrors, this.postAddKeystroke.bind(this));  
        this.router.post('/addClick', this.authMiddleware.verifyToken, this.validateBody('addClick'), this.handleErrors, this.postAddClick.bind(this));              
    }
    
    //Controllers
    private async postAddKeystroke(req:Request, res:Response){
        /*
        Method that registers the keys pressed by an agent

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            const key:string = req.body.key;
            const agent_id:string = req.body.agent_id;
            
            res.status(200).send({message: "writing " + key + " " + agent_id + " " + " on a document"});
        }catch(error:any){
           //If exception occurs inform
           res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postAddClick(req:Request, res:Response){

        /*
        Method that registers the clicks made by an agent

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{ 
            const button:string = req.body.button;
            const agent_id:string = req.body.agent_id;
            
            res.status(200).send({message: "writing " + button + " " + agent_id + " " + " on a document"});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message:error.message});
        }
    }
};

export default KeyClickController;
