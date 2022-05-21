/*
ManagerController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado

Creation date: 03/05/2022
Last modification date: 03/05/2022

Program that defines the controller for the Manager, its routes and functionalities
*/

import AbstractController from './AbstractController';
import {Request, Response} from 'express';
import db from '../models/index';
import RecordingsModel from '../modelsNoSQL/recordings';
import UserConfigModel from '../modelsNoSQL/user_configurations';
import fetch from 'node-fetch';
import crypto from 'crypto';
import { checkSchema } from 'express-validator';

class ManagerController extends AbstractController{
    //Singleton
    private static instance:ManagerController;

    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new ManagerController("manager");
        return this.instance;
    }

    //Body validation
    protected validateBody(type:|'createManager'|'createAgent'|'managerForgotPassword'|'managerResetPassword'|'postComment'){
        switch(type){
            case 'createManager':
                return checkSchema({
                    manager_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isAlphanumeric: {
                            errorMessage: 'Manager ID must be alphanumeric'
                        }
                    },
                    manager_name: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min: 2,
                                max: 40
                            },
                            errorMessage: 'Must be between 2 and 40 characters long'
                        }
                    },
                    password: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min: 8
                            },
                            errorMessage: 'Must be at least 8 characters long'
                        }
                    },
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            case 'createAgent': 
                return checkSchema({
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isAlphanumeric: {
                            errorMessage: 'Manager ID must be alphanumeric'
                        }
                    },
                    super_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    name: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min: 2,
                                max: 40
                            },
                            errorMessage: 'Must be between 2 and 40 characters long'
                        }
                    },
                    password: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min: 8
                            },
                            errorMessage: 'Must be at least 8 characters long'
                        }
                    },
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            case 'managerForgotPassword': 
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            case 'managerResetPassword':
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
                });
            case 'postComment': 
                return checkSchema({
                    super_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    comment: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    rating: {
                        isNumeric: {
                            errorMessage: 'Rating must be numeric and between 1 and 5'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes(): void {
        this.router.post('/createManagers', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.validateBody('createManager'), this.handleErrors, this.postCreateManagers.bind(this));  
        this.router.post('/createAgents', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.validateBody('createAgent'), this.handleErrors, this.postCreateAgents.bind(this));
        this.router.get('/agentList', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.handleErrors, this.agentList.bind(this)); 
        this.router.get('/agentProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getAgentProfile.bind(this));
        this.router.post('/managerForgotPassword', this.authMiddleware.verifyToken, this.validateBody('managerForgotPassword'), this.handleErrors, this.postManagerForgotPassword.bind(this));
        this.router.get('/managerResetPassword', this.authMiddleware.verifyToken, this.validateBody('managerResetPassword'), this.handleErrors, this.getManagerResetPassword.bind(this));  //* 
        this.router.get('/showRecording', this.authMiddleware.verifyToken, this.handleErrors, this.showRecording.bind(this));
        this.router.get('/topRecordings', this.authMiddleware.verifyToken, this.handleErrors, this.showTopRecordings.bind(this));
        this.router.get('/agentRecordings', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.showAgentRecordings.bind(this));
        this.router.post('/filterRecordings', this.filterRecordings.bind(this));
        this.router.post('/postComment', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsQuality, this.validateBody('postComment'), this.handleErrors, this.postComment.bind(this));
    }

    //Controllers
    private async postCreateManagers(req:Request, res:Response){
        try{
            await db["Manager"].create(req.body);
            await UserConfigModel.create(
                {
                userId: req.body.manager_id,
                color: "Dark",
                textSize: "medium",
                language: "EN"
                },
                {overwrite: false}
            );
            console.log("Manager registered");
            res.status(200).send("Manager registered")
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error")
        }
    }

    private async postCreateAgents(req:Request, res:Response){
        try{
            await db["Agent"].create(req.body);
            await UserConfigModel.create(
                {
                userId: req.body.agent_id,
                color: "Dark",
                textSize: "medium",
                language: "EN"
                },
                {overwrite: false}
            );
            console.log("Agent registered");
            res.status(200).send("Agent registered")
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error")
        }
    }

    private async agentList(req:Request, res:Response){
        //Check if show only manager's agents or all agents
        try{
            let agents = await db["Agent"].findAll();
            res.status(200).send({agents: agents});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

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

    private async postManagerForgotPassword(req:Request, res:Response){
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

    private async getManagerResetPassword(req:Request, res:Response){
        //Parsing data within the token query(FRONT)
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

    private async showRecording(req:Request, res:Response){
        var recording_id:any = req.query.recording_id?.toString();

        try{
            //Obtaining recording data
            const recording = await RecordingsModel
                .query(recording_id)
                .usingIndex('callId')
                .exec()
                .promise();
            
            //Obtaining RDS call data
            const call_data = await db["Agent"].findAll({
                attributes: ["name", "email"],
                where: {
                    agent_id: recording[0].Items[0].attrs.agentId
                },
                raw: true
            });
                  
            res.status(200).send({agent: call_data[0].name, agent_email: call_data[0].email, recording: recording[0].Items[0]});
        }catch(error:any){
            console.log(error);
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async showTopRecordings(req:Request, res:Response){
        //Falta sortear el arreglo xd
        var result = [];
        try {
            const recordings = await RecordingsModel
                .scan()
                .attributes(["recordingDate", "thumbnail", "tags", "agentId", "RecordingId", "satisfaction"])
                .limit(50)
                .exec()
                .promise();
            
            for(const recording of recordings[0].Items){
                var data = await db["Agent"].findAll({
                    attributes: ["name"],
                    where: {
                        agent_id: recording.attrs.agentId
                    },
                    raw: true
                });

                result.push({agent_name: data[0].name, recording_data: recording.attrs});
            }

           result = result.sort((sat1, sat2) => {
                if(sat1.recording_data.satisfaction > sat2.recording_data.satisfaction){
                    return -1;
                } 
                if(sat1.recording_data.satisfaction < sat2.recording_data.satisfaction){
                    return 1;
                }
                return 0;
            });

            res.status(200).send({recordings: result});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async showAgentRecordings(req:Request, res:Response){
        var email = req.query.email?.toString();
        try {
            let agent_id = await db["Agent"].findAll({
                attributes: ["agent_id", "name"],
                where: {
                    email: email
                },
                raw: true
            });
    
            const agent_recordings = await RecordingsModel
                .query(agent_id[0].agent_id)
                .usingIndex('agentId')
                .exec()
                .promise();
            
            res.status(200).send({agent_name: agent_id[0].name, agent_email: email, recordings: agent_recordings[0].Items});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async filterRecordings(req:Request, res:Response){
        var body_tags = req.body.tags
        var result = [];
        try{
            const recordings = await RecordingsModel
                .scan()
                .attributes(["recordingDate", "thumbnail", "tags", "agentId", "RecordingId", "satisfaction"])
                .limit(50)
                .exec()
                .promise();

            for(const recording of recordings[0].Items){
                for(const tag of recording.attrs.tags){
                    if(body_tags.includes(tag)){
                        var data = await db["Agent"].findAll({
                            attributes: ["name"],
                            where: {
                                agent_id: recording.attrs.agentId
                            },
                            raw: true
                        });

                        result.push({agent_name: data[0].name, recording_data: recording.attrs});
                        break;
                    }
                }
            }

            res.status(200).send({recordings: result});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postComment(req:Request, res:Response){
        try{
            await db["Comments"].create(req.body);

            let agent_email = await db["Agent"].findAll({
                attributes: ['email'],
                where: {
                    agent_id: req.body.agent_id
                }
            });

            res.status(200).send({message: `Comment posted to ${agent_email[0].email}`});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default ManagerController;