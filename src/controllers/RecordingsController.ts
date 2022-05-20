/*
RecordingsControllers.ts
Author:
- Ariadna Huesca Coronado
- Israel Sánchez Miranda
- Claudia Sarahí Armenta Maya

Creation date: 15/05/2022
Last modification date: 20/05/2022

Program that defines the controller for the Recordings, its routes and functionalities
*/
import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';

class RecordingsController extends AbstractController{
    //Singleton
    private static instance:RecordingsController;

    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new RecordingsController("recordings");
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
        this.router.post('/addKeystroke', this.postAddKeystroke.bind(this));  
        this.router.post('/addClick', this.postAddClick.bind(this));              
    }
    
    private async postAddKeystroke(req:Request, res:Response){
        const key:string = req.body.key;
        const agent_id:string = req.body.agent_id;
        
        res.send("writing "+key+" "+agent_id+" "+" on a document");
    }

    private async postAddClick(req:Request, res:Response){
        const button:string = req.body.button;
        const agent_id:string = req.body.agent_id;
        
        res.send("writing "+button+" "+agent_id+" "+" on a document");
    }

    
};

export default RecordingsController;
