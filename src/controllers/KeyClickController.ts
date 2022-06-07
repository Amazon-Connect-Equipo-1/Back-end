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
import { S3_CLICK_KEY_BUCKET } from '../config';
import KeyClickModel from '../modelsNoSQL/key_click_recordings';
import AbstractController from './AbstractController';
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
            //Obtaining keystrokes and agent id
            const key:string = req.body.key;
            const agent_id:string = req.body.agent_id;
            const date = new Date();
            const key_date = `${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))}-${(date.getDate() < 10 ? "0" + date.getDate() : date.getDate())}`;
            
            //Generating the s3 key
            const s3_key:string = `${agent_id}-keystroke-${key_date}.txt`;

            //Creating a file with the keystrokes
            fs.appendFile(s3_key, `${key}   ${agent_id}\n`, function(err) {
                if(err){
                    throw err;
                }
                console.log("File saved");
            });

            //If file is new then append to file_stack
            if(this.file_stack.indexOf(s3_key) === -1){
                this.file_stack.push(s3_key);
                console.log(this.file_stack);
            }

            //Create an object that reads the new file created
            const object = fs.readFileSync(`${path.dirname(s3_key)}/${s3_key}`);

            //Upload file to S3
            await this.s3Service.putObject(S3_CLICK_KEY_BUCKET, s3_key, object);

            //Consult dynamodb
            const result = await KeyClickModel
                .query(agent_id)
                .usingIndex('agentId')
                .exec()
                .promise();

            console.log(result);

            //If agent is already registered just modify the array of keystroke recordings
            if(result[0].Count > 0 && result[0].Items[0].attrs.clickRecordings.indexOf(s3_key) === -1){
                var recording_arr = result[0].Items[0].attrs.keyRecordings;

                recording_arr.push(`https://click-keystroke-recording.s3.us-west-2.amazonaws.com/${s3_key}`);

                await KeyClickModel.update({
                    KeyClickRecordingId: result[0].Items[0].attrs.KeyClickRecordingId,
                    keyRecordings: recording_arr
                });
            }else{
                //If agent isn't registered create a new tuple with its data
                const db_object = {
                    "agentId": agent_id,
                    "keyRecordings": [`https://click-keystroke-recording.s3.us-west-2.amazonaws.com/${s3_key}`],
                    "clickRecordings": [" "]
                }
    
                await KeyClickModel.create(db_object);
            }

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
            //Obtaining the clicks and agent id 
            const button:string = req.body.button;
            const agent_id:string = req.body.agent_id;
            const date = new Date();
            const button_date = `${date.getFullYear()}-${(date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1))}-${(date.getDate() < 10 ? "0" + date.getDate() : date.getDate())}`;
            
            //Generating an s3 key 
            const s3_key:string = `${agent_id}-click-${button_date}.txt`;

            //Creating a file with the clicks 
            fs.appendFile(s3_key, `${button}   ${agent_id}\n`, function(err) {
                if(err){
                    throw err;
                }
                console.log("File saved");
            });

            //If file is new then append to file_stack 
            if(this.file_stack.indexOf(s3_key) === -1){
                this.file_stack.push(s3_key);
                console.log(this.file_stack);
            }

            //Create an object that reads the new file created 
            const object = fs.readFileSync(`${path.dirname(s3_key)}/${s3_key}`);

            //Upload file to S3
            await this.s3Service.putObject(S3_CLICK_KEY_BUCKET, s3_key, object);

            //Consult dynamodb
            const result = await KeyClickModel
                .query(agent_id)
                .usingIndex('agentId')
                .exec()
                .promise();

            console.log(result);

            //If agent is already registered just modify the array of keystroke recordings
            if(result[0].Count > 0 && result[0].Items[0].attrs.clickRecordings.indexOf(s3_key) === -1){
                var recording_arr = result[0].Items[0].attrs.clickRecordings;

                recording_arr.push(`https://click-keystroke-recording.s3.us-west-2.amazonaws.com/${s3_key}`);

                await KeyClickModel.update({
                    KeyClickRecordingId: result[0].Items[0].attrs.KeyClickRecordingId,
                    clickRecordings: recording_arr
                });
            }else{
                //If agent isn't registered create a new tuple with its data
                const db_object = {
                    "agentId": agent_id,
                    "keyRecordings": [" "],
                    "clickRecordings": [`https://click-keystroke-recording.s3.us-west-2.amazonaws.com/${s3_key}`]
                }
    
                await KeyClickModel.create(db_object);
            }
            
            res.status(200).send({message: `writing ${button} ${agent_id} on a document`});
        }catch(error:any){
           //If exception occurs inform
           res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async deleteObjects(req:Request, res:Response){
        /*
        Method that deletes all local files created by this controller

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Iterate over file_stack
            this.file_stack.forEach (object => {
                //Delete the file
                fs.unlink(`${path.dirname(object)}/${object}`, function(err){
                    if(err){
                        throw err;
                    }
                });
            });

            //Reset file_stack
            this.file_stack = [];

            res.status(200).send({message: `All files deleted ${this.file_stack}`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }
};

export default KeyClickController;