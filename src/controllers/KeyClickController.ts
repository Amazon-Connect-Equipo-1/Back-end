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
import { S3_CLICK_KEY_BUCKET } from '../config';
import fs from 'fs';
import path from 'path';

class KeyClickController extends AbstractController{
    //Attributes
    protected file_stack:string[] = [];

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
        this.router.get('/deleteObjects', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.deleteObjects.bind(this));        
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
            const date = new Date();
            const key_date = `${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))}-${(date.getDate() < 10 ? "0" + date.getDate() : date.getDate())}`;
            const s3_key:string = `${agent_id}-keystroke-${key_date}.txt`;

            fs.appendFile(s3_key, `${key}   ${agent_id}\n`, function(err) {
                if(err){
                    throw err;
                }
                console.log("File saved");
            });

            if(this.file_stack.indexOf(s3_key) === -1){
                this.file_stack.push(s3_key);
                console.log(this.file_stack);
            }

            const object = fs.readFileSync(`${path.dirname(s3_key)}/${s3_key}`);

            await this.s3Service.putObject(S3_CLICK_KEY_BUCKET, s3_key, object);
            
            res.status(200).send({message: `writing ${key} ${agent_id} on a document`});
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
            const button:string = req.body.key;
            const agent_id:string = req.body.agent_id;
            const date = new Date();
            const button_date = `${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))}-${(date.getDate() < 10 ? "0" + date.getDate() : date.getDate())}`;
            const s3_key:string = `${agent_id}-keystroke-${button_date}.txt`;

            fs.appendFile(s3_key, `${button}   ${agent_id}\n`, function(err) {
                if(err){
                    throw err;
                }
                console.log("File saved");
            });

            if(this.file_stack.indexOf(s3_key) === -1){
                this.file_stack.push(s3_key);
            }

            const object = fs.readFileSync(`${path.dirname(s3_key)}/${s3_key}`);

            await this.s3Service.putObject(S3_CLICK_KEY_BUCKET, s3_key, object);
            
            res.status(200).send({message: `writing ${button} ${agent_id} on a document`});
        }catch(error:any){
           //If exception occurs inform
           res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async deleteObjects(req:Request, res:Response){
        try{
            for(const object of this.file_stack){
                console.log(object);
                fs.unlink(`${path.dirname(object)}/${object}`, function(err){
                    if(err){
                        throw err;
                    }
                });

                this.file_stack.splice(this.file_stack.indexOf(object), 1);
            }

            res.status(200).send({message: `All files deleted ${this.file_stack}`});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }

    }
};

export default KeyClickController;
