/*
AuthenticationController.ts
Authors:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that handles the Authentication methods for every user (Agent, Quality agent and Administrators)
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import { Request, Response } from 'express';
import db from '../models';
import UserConfigModel from '../modelsNoSQL/user_configurations';
import AbstractController from './AbstractController';
import cryptoService from '../services/cryptoService';


class AuthenticationController extends AbstractController{
    //Singleton
    private static instance: AuthenticationController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created 
            return this.instance;
        }
        //If instance is not created we create it
        this.instance = new AuthenticationController("auth");
        return this.instance;
    }

    //Route configuration
    protected initRoutes():void {
        //Routes fot his controller
        this.router.post('/signupAgent', this.validateBody('signupAgent'), this.handleErrors, this.signupAgent.bind(this));
        this.router.post('/signupManager', this.validateBody('signupManager'), this.handleErrors, this.signupManager.bind(this));
        this.router.post('/signin', this.validateBody('signin'), this.handleErrors, this.signin.bind(this));
        this.router.post('/signout', this.validateBody('signout'), this.handleErrors, this.signout.bind(this));
        this.router.post('/forgotPassword', this.validateBody('forgotPassword'), this.handleErrors, this.forgotPassword.bind(this));
        this.router.post('/confirmPassword', this.validateBody('confirmPassword'), this.handleErrors, this.confirmPassword.bind(this));
        this.router.post('/verify', this.validateBody('verify'), this.handleErrors, this.verify.bind(this));
        this.router.get('/readUsers', this.authMiddleware.verifyToken, this.permissionMiddleware.checkIsAdmin, this.handleErrors, this.getReadUsers.bind(this));
        this.router.post('/refreshToken', this.validateBody('refreshToken'), this.handleErrors, this.refreshToken.bind(this));
        this.router.get('/getUserEmail', this.authMiddleware.verifyToken, this.handleErrors, this.getUserEmail.bind(this));
        this.router.get('/test', this.test.bind(this));
    }

    //Controllers
    private async test(req:Request, res:Response){
        res.status(200).send({message: "EL LAIM XD"});
    }

    private async signupAgent(req:Request, res:Response){
        /*
        Method that lets an agent to sign up in our application

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const{super_email, name, password, email, phone_number} = req.body;
        const encryption = new cryptoService();

        try{
            //Create a Connect user
            const c_user = await this.connectService.createUser(email, "Agent", name.split(" ").join(""), password, name.split(" ")[0], name.split(" ")[1]);
            console.log('Connect user created!', c_user);

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

            //Find the user's manager
            const super_id = await db["Manager"].findAll({
                attributes: ["manager_id"],
                where: {
                    email: super_email
                }
            });

            //Hashing user's password
            var hashedPassword = encryption.hash(password);

            //Save user in RDS database
            await db["Agent"].create({
                agent_id: c_user.UserId,
                super_id: super_id[0].dataValues.manager_id,
                name: name,
                password: hashedPassword,
                email: email
            });

            //Save user's default configurations in DynamoDB
            await UserConfigModel.create(
                {
                userId: c_user.UserId,
                color: "Dark",
                textSize: "medium",
                language: "EN"
                },
                {overwrite: false}
            );

            console.log("Agent created");
            res.status(201).send({message: 'Agent signed up', body: {super_id: super_id[0].dataValues.manager_id, name: name, pasword: hashedPassword, email: email, phone_number: phone_number}});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async signupManager(req:Request, res:Response){
        /*
        Method that lets a manager to sign up in our application

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const{name, password, email, role, phone_number} = req.body;
        const encryption = new cryptoService();
        var role_name = "";

        //Assign a role to the manager depending on the parameter sent
        if(role){
            role_name = "QualityAnalyst";
        }else{
            role_name = "Manager"
        }

        try{
            //Create a Connect user
            const c_user = await this.connectService.createUser(email, role_name, name.split(" ").join(""), password, name.split(" ")[0], name.split(" ")[1]);
            console.log('Connect user created!', c_user)

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
            var hashedPassword = encryption.hash(password);

            //Save user in RDS database
            await db["Manager"].create({
                manager_id: c_user.UserId,
                manager_name: name, 
                password: hashedPassword,
                email: email,
                is_quality: role
            });

            //Save user's configurations in DynamoDB
            await UserConfigModel.create(
                {
                userId: c_user.UserId,
                color: "Dark",
                textSize: "medium",
                language: "EN"
                },
                {overwrite: false}
            );

            console.log("Admin created");
            res.status(201).send({message: 'Admin signed up', body: {name: name, password: hashedPassword, email: email, role: role, phone_number: phone_number}});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async verify(req:Request, res:Response){
        /*
        Method that lets a user (agent, manager or quality analyst) to verify his email to formaly register in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {email, code} = req.body;

        try{
            //Verify user using Cognito
            await this.cognitoService.verifyUser(email, code);

            return res.status(200).send({message: `User ${email} verified`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async signin(req:Request, res:Response){
        /*
        Method that lets a user (agent, manager or quality analyst) to sign in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {email, password} = req.body;
        var role:string;

        try{
            //Sign user in using Cognito
            const login = await this.cognitoService.signInUser(email, password);
            
            //Updating agent's status
            let agentResult =  await db["Agent"].findAll({
                where: {
                    email: email
                }
            });

            if(agentResult.length > 0){
                //If user is found in the agent database change his status and send the corresponding information
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
                //If user found in Manager table and user is a quality analyst send the corresponding information
                role = "Quality-agent";
                res.status(200).send({...login.AuthenticationResult, role: role, body: agentResult[0]});
            }else if(managerResult.length > 0){
                //If user is just a manager send the corresponding information
                role = "Admin";
                res.status(200).send({...login.AuthenticationResult, role: role, body: agentResult[0]});
            }else{
                //If user wasn't found inform
                res.status(404).send({code: 'UserNotFound', message: 'User not found in the database'});
            }
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async signout(req:Request, res:Response){
        /*
        Method that lets an agent to sign out from our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const token = req.token
        const email = req.body.email

        try{
            //Sign out using Cognito
            await this.cognitoService.signOut(token);

            //Find if current user is an agent
            let agentResult =  await db["Agent"].findAll({
                where: {
                    email: email
                }
            });

            if(agentResult.length > 0){
                //If user is an agent changehis status 
                await db["Agent"].update({status: "Inactive"}, {
                    where: {
                        email: email
                    }
                });
            }

            res.status(200).send({message: `User ${email} signed out`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async forgotPassword(req:Request, res:Response){
        /*
        Method that sends an email to a user (agent, manager or quality analyst) if they forgot their password to reset it

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {email} = req.body;

        try{
            //Send password resetting email using Cognito
            await this.cognitoService.forgotPassword(email);

            res.status(200).send({message: `Password resetting email sent to ${email}`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async confirmPassword(req:Request, res:Response){
        /*
        Method that lets a user (agent, manager or quality analyst) to change and confirm their password using the code sent on an email

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const encryption = new cryptoService();
        const {email, confirmation_code, password} = req.body;

        try{
            //Confirm new password using Cognito
            await this.cognitoService.confirmForgotPassword(email, confirmation_code, password);

            //Find out if user is agent or manager
            let agent = await db["Agent"].findAll({
                where: {
                    email: email
                }
            });

            let manager = await db["Manager"].findAll({
                where: {
                    email: email
                }
            })

            //Hashing the password
            const hashedPassword = encryption.hash(password);

            if(agent.length > 0){
                //If user is agent update the corresponding tuple
                await db["Agent"].update({password: hashedPassword}, {
                    where: {
                        email: email
                    }
                });

                res.status(200).send({message: `Agent ${email} password changed`});
            }else if(manager.length > 0){
                //If user is manager update the corresponding tuple
                await db["Manager"].update({password: hashedPassword}, {
                    where: {
                        email: email
                    }
                });

                res.status(200).send({message: `Manager ${email} password changed, Cognito and Connect passwords aren't linked, to change your Connect password follow this tutorial: https://docs.aws.amazon.com/connect/latest/adminguide/password-reset.html#password-reset-aws`});
            }else{
                //If user wasn't found inform
                res.status(404).send({code: 'UserNotFound', message: 'User not found in the database'});
            }
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getReadUsers(req:Request, res:Response){
        /*
        Method that returns a list of all the users (agents, managers and quality analysts) signed in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Deploy users
            let agents = await db["Agent"].findAll();
            let managers = await db["Manager"].findAll();

            res.status(200).send({agents: agents, managers: managers});
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async refreshToken(req:Request, res:Response){
        /*
        Method that uses a user's refresh token to update the access tokens

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const refreshToken = req.body.refresh_token;

        try{
            //Update tokens using Cognito
            let tokens = await this.cognitoService.refreshToken(refreshToken);

            res.status(200).send(tokens.AuthenticationResult);
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async getUserEmail(req:Request, res:Response){
        /*
        Method that return the active user's email address

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const token = req.token;

        try {
            //Obtaining the user's email address using Cognito
            let userEmail = await this.cognitoService.getUserEmail(token);

            res.status(200).send({user_email: userEmail}); 
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    //Body validation
    protected validateBody(type:|'signupAgent'|'signupManager'|'signin'|'verify'|'signout'|'forgotPassword'|'confirmPassword'|'refreshToken'){
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
                    super_email: {
                        isEmail:{
                            errorMessage: 'Must be a valid email'
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
					}
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
                    }
                });
            case 'signout':
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            case 'forgotPassword': 
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    }
                });
            case 'confirmPassword':
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    },
                    confirmation_code: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
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
                    }
                });
            case 'refreshToken':
                return checkSchema({
                    refresh_token: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
        }
    }
}

export default AuthenticationController;