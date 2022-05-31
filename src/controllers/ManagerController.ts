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
import { checkSchema } from 'express-validator';
import cryptoService from '../services/cryptoService';

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
    protected validateBody(type:|'createManager'|'createAgent'|'postComment'|'filterRecordings'){
        switch(type){
            case 'createManager':
                return checkSchema({
                    manager_id: {
                        isString: {
                            errorMessage: 'Must be a string'
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
            case 'filterRecordings':
                return checkSchema({
                    tags: {
                        isArray: {
                            errorMessage: 'Tags must be an array'
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
        this.router.get('/managerProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getManagerProfile.bind(this));
        this.router.get('/showRecording', this.authMiddleware.verifyToken, this.handleErrors, this.showRecording.bind(this));
        this.router.get('/topRecordings', this.authMiddleware.verifyToken, this.handleErrors, this.showTopRecordings.bind(this));
        this.router.get('/agentRecordings', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.showAgentRecordings.bind(this));
        this.router.post('/filterRecordings', this.authMiddleware.verifyToken, this.validateBody('filterRecordings'), this.handleErrors, this.filterRecordings.bind(this));
        this.router.post('/showRecordingsByDate', this.authMiddleware.verifyToken, this.handleErrors, this.showRecordingsByDate.bind(this));
        this.router.post('/postComment', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsQuality, this.validateBody('postComment'), this.handleErrors, this.postComment.bind(this));
    }

    //Controllers
    private async postCreateManagers(req:Request, res:Response){
        const encryption = new cryptoService();
        try{
            //Hashing managers's password
            var hashedPassword = encryption.hash(req.body.password);

            await db["Manager"].create({
                manager_id: req.body.manager_id,
                manager_name: req.body.manager_name,
                password: hashedPassword,
                email: req.body.email,
                is_quality: req.body.is_quality
            });
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
            res.status(200).send({message: "Manager registered"});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postCreateAgents(req:Request, res:Response){
        const encryption = new cryptoService();
        try{
            //Hashing manager's password
            var hashedPassword = encryption.hash(req.body.password);

            await db["Agent"].create({
                agent_id: req.body.agent_id,
                super_id: req.body.super_id,
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email
            });

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
            res.status(200).send({message: "Agent registered"});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
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

    private async getManagerProfile(req:Request, res:Response){
        try{
            let result:any = await db["Manager"].findAll({
                where: {
                    email: req.query.email?.toString()
                },
                raw: true
            });
            if(result.length > 0){
                console.log(result);
                res.status(200).send(result[0]);
            }else{
                console.log(`No manger with email: ${req.body.email} found`);
                res.status(500).send({message: `No manager with email: ${req.body.email} found`});
            }
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error retrieving agent data")
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
                
                if(data.length > 0){
                    result.push({agent_name: data[0].name, recording_data: recording.attrs});
                }
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
        //Check how to send more videos after clicking a button
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

    private async showRecordingsByDate(req:Request, res:Response){
        const {order} = req.body //true for ascendent order, false for descendent
        const result = [];

        try{
            let recordings = await db["Calls"].findAll({
                attributes: ["call_id"],
                order: [
                    ['date', order]
                ]
            });

            for(const recording of recordings){
                let dynamo_recording = await RecordingsModel
                    .query(recording.dataValues.call_id)
                    .exec()
                    .promise();
                
                console.log(recording.dataValues.call_id);
                result.push(dynamo_recording[0].Items[0]);
            }

            res.status(200).send({recordings: result})

        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message})
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