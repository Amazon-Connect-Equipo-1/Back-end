/*
AuthenticationController.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that handles the Authentication methods for every user (Agent, Quality agent and Administrators)
*/

import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';
import cryptoService from '../services/cryptoService';
import db from '../models';
import UserConfigModel from '../modelsNoSQL/user_configurations';

class AuthenticationController extends AbstractController{
    //Singleton
    private static instance: AuthenticationController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new AuthenticationController("auth");
        return this.instance;
    }

    //Methods
    protected initRoutes():void {
        //Routes fot his controller
        this.router.post('/signupAgent', this.validateBody('signupAgent'), this.handleErrors, this.signupAgent.bind(this));
        this.router.post('/signupManager', this.validateBody('signupManager'), this.handleErrors, this.signupManager.bind(this));
        this.router.post('/signin', this.validateBody('signin'), this.handleErrors, this.signin.bind(this));
        this.router.post('/verify', this.validateBody('verify'), this.handleErrors, this.verify.bind(this));
        this.router.get('/readUsers', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.handleErrors, this.getReadUsers.bind(this));
    }

    private async signupAgent(req:Request, res:Response){
        /*Verify if make different route for agent signup or add value here*/
        const{super_id, name, password, email, phone_number} = req.body;
        const encryption = new cryptoService();

        try{
            //Create Cognito user
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'phone_number',
                    Value: phone_number
                }
            ]);
            console.log('Cognito user created!', user);

            //Hashing managers's password
            var hashedPasswordObject = encryption.encrypt(password);
            var hashedPassword = hashedPasswordObject.iv + "$" + hashedPasswordObject.content;

            //Save user in RDS database
            await db["Agent"].create({
                agent_id: user.UserSub,
                super_id: super_id,
                name: name,
                password: hashedPassword,
                email: email
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

            console.log("Agent created");
            res.status(201).send({message: 'Agent signed up', body: req.body});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async signupManager(req:Request, res:Response){
        /*Verify if make different route for agent signup or add value here*/
        const{name, password, email, role, phone_number} = req.body;
        const encryption = new cryptoService();

        try{
            //Create Cognito user
            const user = await this.cognitoService.signUpUser(email, password, [
                {
                    Name: 'email',
                    Value: email
                },
                {
                    Name: 'name',
                    Value: name
                },
                {
                    Name: 'phone_number',
                    Value: phone_number
                }
            ]);
            console.log('Cognito user created!', user);

            //Hashing managers's password
            var hashedPasswordObject = encryption.encrypt(password);
            var hashedPassword = hashedPasswordObject.iv + "$" + hashedPasswordObject.content;

            //Save user in RDS database
            await db["Manager"].create({
                manager_id: user.UserSub,
                manager_name: name, 
                password: hashedPassword,
                email: email,
                is_quality: role
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

            console.log("Admin created");
            res.status(201).send({message: 'Admin signed up', body: req.body});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async verify(req:Request, res:Response){
        const {email, code} = req.body;
        try{
            await this.cognitoService.verifyUser(email, code);
            //await this.emailService.emailNotificationSignUp(email,email);
            return res.status(200).send({message: `User ${email} verified`});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async signin(req:Request, res:Response){
        const {email, password} = req.body;
        var role:string;
        try{
            const login = await this.cognitoService.signInUser(email, password);
            
            //const userDB = await UserModel.query(email).usingIndex('EmailIndex').exec().promise()
            //Updating agent's status
            let agentResult =  await db["Agent"].findAll({
                where: {
                    email: email
                }
            });

            if(agentResult.length > 0){
                await db["Agent"].update({status: "Active"}, {
                    where: {
                        email: email
                    }
                });
                role = "Agent";
                res.status(200).send({...login.AuthenticationResult, role: role, body: agentResult[0]});
            }

            let managerResult = await db["Manager"].findAll({
                where: {
                    email: email
                }
            });
            if(managerResult.length > 0 && managerResult[0].is_quality){
                role = "Quality-agent";
                res.status(200).send({...login.AuthenticationResult, role: role, body: agentResult[0]});
            }else if(managerResult.length > 0){
                role = "Admin";
                res.status(200).send({...login.AuthenticationResult, role: role, body: agentResult[0]});
            }else{
                res.status(404).send({code: 'UserNotFound', message: 'User not found in the database'});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getReadUsers(req:Request, res:Response){
        try{
            //Deploy users
            let agents = await db["Agent"].findAll();
            console.log(agents)
            let managers = await db["Manager"].findAll();


            res.status(200).send({agents: agents, managers: managers});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    protected validateBody(type:|'signupAgent'|'signupManager'|'signin'|'verify'){
        switch(type){
            case 'signupAgent':
                return checkSchema({
                    email: {
                        in: 'body',
                        isEmail: {
                            errorMessage: 'Must be a valid email address'
                        }
                    },
                    password:{
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min:8
                            },
                            errorMessage: 'Must be at least 8 characters long'
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
                    super_id: {
                        isString:{
                            errorMessage: 'Must be a string'
                        }
                    }
                });
            case 'signupManager':
                return checkSchema({
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
                                min:8
                            },
                            errorMessage: 'Must be at least 8 characters long'
                        }
                    },
                    email:{
                        in: 'body',
                        isEmail: {
                            errorMessage: 'Must be a valid email address'
                        }
                    },
                    role:{
                        isBoolean: {
                            errorMessage: 'Must be boolean'
                        }
                    }
                });
            case 'signin':
                return checkSchema({
                    email: {
						in: 'body',
						isEmail: {
							errorMessage: 'Must be a valid email',
						},
					},
					password: {
						isString: {
							errorMessage: 'Must be a string',
						},
						isLength: {
							options: {
								min: 8,
							},
							errorMessage: 'Must be at least 8 characters',
						},
					},
                });
            case 'verify':
                return checkSchema({
                    email: {
                        in: 'body',
                        isEmail: {
                            errorMessage: 'Must be a valid email',
                        },
                    },
                    code: {
                        isString: {
                            errorMessage: 'Must be a string',
                        },
                        isLength: {
                            options: {
                                min: 6,
                                max: 8,
                            },
                            errorMessage: 'Must be between 6 and 8 characters',
                        },
                    },
                });
        }
    }
}

export default AuthenticationController;