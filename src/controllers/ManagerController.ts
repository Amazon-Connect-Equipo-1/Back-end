/*
ManagerController.ts
Authors:
- Israel Sánchez Miranda
- Erick Hernández Silva
- Ariadna Huesca Coronado
- David Rodríguez Fragoso

Creation date: 03/05/2022
Last modification date: 01/06/2022

Program that defines the controller for the Manager, its routes and functionalities
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import {Request, Response} from 'express';
import sequelize from 'sequelize';
import db from '../models/index';
import RecordingsModel from '../modelsNoSQL/recordings';
import UserConfigModel from '../modelsNoSQL/user_configurations';
import AbstractController from './AbstractController';
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
    protected validateBody(type:|'createManager'|'createAgent'|'postComment'|'filterRecordings'|'updateProfilePicture'|'filterByDate'){
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
                    agent_email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
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
            case 'updateProfilePicture':
                return checkSchema({
                    user_email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    },
                    profile_picture: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
            case 'filterByDate':
                return checkSchema({
                    date: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes(): void {
        this.router.post('/createManagers', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.validateBody('createManager'), this.handleErrors, this.postCreateManagers.bind(this));  
        this.router.post('/createAgents', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.validateBody('createAgent'), this.handleErrors, this.postCreateAgents.bind(this));
        this.router.get('/agentList', this.authMiddleware.verifyToken, this.handleErrors, this.agentList.bind(this)); 
        this.router.get('/agentProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getAgentProfile.bind(this));
        this.router.get('/managerProfile', this.authMiddleware.verifyToken, this.handleErrors, this.getManagerProfile.bind(this));
        this.router.get('/showRecording', this.authMiddleware.verifyToken, this.handleErrors, this.showRecording.bind(this));
        this.router.get('/agentRecordings', this.authMiddleware.verifyToken, this.handleErrors, this.showAgentRecordings.bind(this));
        this.router.post('/filterRecordings', this.authMiddleware.verifyToken, this.validateBody('filterRecordings'), this.handleErrors, this.filterRecordings.bind(this));
        this.router.post('/showLastRecordings', this.authMiddleware.verifyToken, this.handleErrors, this.showLastRecordings.bind(this));
        this.router.post('/postComment', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsQuality, this.validateBody('postComment'), this.handleErrors, this.postComment.bind(this));
        this.router.post('/updateProfilePicture', this.authMiddleware.verifyToken, this.validateBody('updateProfilePicture'), this.handleErrors, this.updateProfilePicture.bind(this));
        this.router.post('/filterRecordingsByDate', this.authMiddleware.verifyToken, this.validateBody('filterByDate'), this.handleErrors, this.filterRecordingsByDate.bind(this));
    }

    //Controllers
    private async postCreateManagers(req:Request, res:Response){
        /*
        Lets managers create more managers, route used only for testing

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const encryption = new cryptoService();

        try{
            //Hashing managers's password
            var hashedPassword = encryption.hash(req.body.password);

            //Registering manager in RDS
            await db["Manager"].create({
                manager_id: req.body.manager_id,
                manager_name: req.body.manager_name,
                password: hashedPassword,
                email: req.body.email,
                is_quality: req.body.is_quality
            });

            //Registering manager's configurations in DynamoDB
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
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postCreateAgents(req:Request, res:Response){
        /*
        Lets managers create more agents, route used only for testing

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const encryption = new cryptoService();
        try{
            //Hashing manager's password
            var hashedPassword = encryption.hash(req.body.password);

            //Registering the agent in RDS
            await db["Agent"].create({
                agent_id: req.body.agent_id,
                super_id: req.body.super_id,
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email
            });

            //Registering agent's configuration in DynamoDB
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
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async agentList(req:Request, res:Response){
        /*
        Method that returns a list of all the agents registered in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Retrieving all the agents
            let agents = await db["Agent"].findAll();
            res.status(200).send({agents: agents});
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getAgentProfile(req:Request, res:Response){
        /*
        Method that returns the profile of an agent given his email as query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const email = req.query.email?.toString();

        try{
            //Finding the agent by his email
            let result:any = await db["Agent"].findAll({
                where: {
                    email: email
                },
                raw: true
            });

            if(result.length > 0){
                //If agent was found, return it
                console.log(result);
                res.status(200).send(result);
            }else{
                //If not, return an agent not found exception
                console.log(`No agent with email: ${email} found`);
                res.status(500).send({message: `No agent with email: ${email} found`});
            }
        }catch(err:any){
            //If exception occurs inform
            console.log(err);
            res.status(500).send({code: err.code, message: err.message});
        }
    }

    private async getManagerProfile(req:Request, res:Response){
        /*
        Method that returns a manager profile by it email given as a query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Finding the manager
            let result:any = await db["Manager"].findAll({
                where: {
                    email: req.query.email?.toString()
                },
                raw: true
            });

            if(result.length > 0){
                //If manager was found, return it
                console.log(result);
                res.status(200).send(result[0]);
            }else{
                //If not, return a manager not found exception
                console.log(`No manger with email: ${req.body.email} found`);
                res.status(500).send({message: `No manager with email: ${req.body.email} found`});
            }
        }catch(err:any){
            //If an exception occurs inform
            console.log(err);
            res.status(500).send({code: err.code, message: err.message});
        }
    }    

    private async showRecording(req:Request, res:Response){
        /*
        Method that returns all the information of a recording given its ID as a query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        var recording_id:any = req.query.recording_id?.toString();

        try{
            //Obtaining recording data
            const recording = await RecordingsModel
                .query(recording_id)
                .usingIndex('callId')
                .exec()
                .promise();
            
            //Obtaining RDS Agent data
            const call_data = await db["Agent"].findAll({
                attributes: ["email"],
                where: {
                    agent_id: recording[0].Items[0].attrs.agentId
                },
                raw: true
            });
                  
            res.status(200).send({agent_email: call_data[0].email, recording: recording[0].Items[0]});
        }catch(error:any){
            //If an exception occurs inform
            console.log(error);
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async showAgentRecordings(req:Request, res:Response){
        /*
        Method that returns all the records of an agent given his email by query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        var email = req.query.email?.toString();

        try {
            //Finding agent's ID in RDS
            let agent_id = await db["Agent"].findAll({
                attributes: ["agent_id"],
                where: {
                    email: email
                },
                raw: true
            });
    
            //Using agent's ID to find all his recordings
            const agent_recordings = await RecordingsModel
                .query(agent_id[0].agent_id)
                .usingIndex('agentId')
                .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                .exec()
                .promise();
            
            res.status(200).send({agent_email: email, recordings: agent_recordings[0].Items});
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async filterRecordings(req:Request, res:Response){
        /*
        Method that returns a list of videos that match the given filters

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const user_email = req.body.user_email;
        var body_tags = req.body.tags
        var result = [];

        try{
            if(user_email){
                //Filtering calls by date
                const user_id = await db["Agent"].findAll({
                    attributes: ["agent_id"],
                    where: {
                        email: user_email 
                    }
                });

                //Obtaining the first 50 videos
                const recordings = await RecordingsModel
                    .query(user_id[0].dataValues.agent_id)
                    .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                    .usingIndex('agentId')
                    .limit(50)
                    .exec()
                    .promise();

                for(const recording of recordings[0].Items){
                    if(recording.attrs.tags){
                        for(const tag of recording.attrs.tags){
                            //Finding if the video tags include the tags specified by the filter
                            if(body_tags.includes(tag)){
                                //If tags match, push the corresponding recording to the array
                                result.push({recording_data: recording.attrs});
                                break;
                            }
                        }
                    }
                }    
            }else{
                //Obtaining the first 50 videos
                const recordings = await RecordingsModel
                    .scan()
                    .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                    .limit(50)
                    .exec()
                    .promise();

                for(const recording of recordings[0].Items){
                    if(recording.attrs.tags){
                        for(const tag of recording.attrs.tags){
                            //Finding if the video tags include the tags specified by the filter
                            if(body_tags.includes(tag)){
                                //If tags match, push the corresponding recording to the array
                                result.push({recording_data: recording.attrs});
                                break;
                            }
                        }
                    }
                }
            }

            res.status(200).send({recordings: result});
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async showLastRecordings(req:Request, res:Response){
        /*
        Method that returns the last recordings made in ascendent or descendent order

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {order} = req.body //ASC for ascendent order, DESC for descendent
        const result = [];

        try{
            //Retrieving call ID's ordered by date ascendent or descendent
            let recordings = await db["Calls"].findAll({
                attributes: ["call_id"],
                order: [
                    ['time_start', order]
                ],
                limit: 50
            });

            for(const recording of recordings){
                //Retrieving the corresponding recordings using their ID's
                let dynamo_recording = await RecordingsModel
                    .query(recording.dataValues.call_id)
                    .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                    .exec()
                    .promise();
                
                //Pushing the recordings to a final array
                result.push(dynamo_recording[0].Items[0]);
            }

            res.status(200).send({recordings: result})
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message})
        }
    }

    private async postComment(req:Request, res:Response){
        /*
        Method that lets managers post comments to agents

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {super_id, agent_email, comment, rating} = req.body;

        try{
            //Obtain agent's ID using his email
            let agent_id = await db["Agent"].findAll({
                attributes: ["agent_id"],
                where: {
                    email: req.body.agent_email
                }
            });

            //Register the comment in the database            
            await db["Comments"].create({
                super_id: super_id,
                agent_id: agent_id[0].agent_id,
                comment: comment,
                rating: rating
            });

            //Calculate and update the new rating of the agent
            let comments = await db["Comments"].findAll({
                attributes: [
                    sequelize.fn('sum', sequelize.col('rating')),
                    sequelize.fn('count', sequelize.col('rating'))
                ],
                where: {
                    agent_id: agent_id[0].agent_id
                },
                raw: true
            });

            const new_rating = comments[0]['sum(`rating`)'] / comments[0]['count(`rating`)'];

            await db["Agent"].update({rating: new_rating.toFixed(1)}, {
                where: {
                    agent_id: agent_id[0].agent_id
                }
            });

            res.status(200).send({message: `Comment posted to ${agent_email}`});
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async updateProfilePicture(req:Request, res:Response){
        /*
        Method that lets a Manager update his profile picture

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {user_email, profile_picture} = req.body

        try{
            const image_id = profile_picture.split('/')[5];

            //Update the profile picture of the manager in the database
            await db["Manager"].update({profile_picture: `https://drive.google.com/uc?export=view&id=${image_id}`}, {
                where: {
                    email: user_email
                }
            });

            res.status(200).send({message: "Profile picture updated!"});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async filterRecordingsByDate(req:Request, res:Response){
        /*
        Method that lets a Manager to filter recordings by date and agent

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const user_email = req.body.user_email;
        const date = req.body.date
        var result = []
        
        try{
            if(user_email){
                //Filtering calls by date
                const call_ids = await db["Calls"].findAll({
                    attributes: ["call_id"],
                    include: [
                        {
                            model: db["Agent"],
                            required: true
                        }
                    ],
                    where: {
                        "$Agent.email$": user_email,
                        date: date
                    }
                });

                //Obtaining every recording from that date
                for(const call_id of call_ids){
                    let dynamo_recording = await RecordingsModel
                        .query(call_id.dataValues.call_id)
                        .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                        .exec()
                        .promise();
                    
                    result.push(dynamo_recording[0].Items[0]);
                }

                res.status(200).send({recordings: result});
            }else{
                //Filtering calls by date
                const call_ids = await db["Calls"].findAll({
                    attributes: ["call_id"],
                    where: {
                        date: date
                    }
                });

                //Obtaining every recording from that date
                for(const call_id of call_ids){
                    let dynamo_recording = await RecordingsModel
                        .query(call_id.dataValues.call_id)
                        .attributes(["RecordingId", "agentId", "agentName", "initialTimestamp", "thumbnail", "tags", "subtitles"])
                        .exec()
                        .promise();
                    
                    result.push(dynamo_recording[0].Items[0]);
                }

                res.status(200).send({recordings: result});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default ManagerController;