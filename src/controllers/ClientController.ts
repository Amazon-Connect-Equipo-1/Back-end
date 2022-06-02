/*
AuthenticationController.ts
Authors:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 18/05/2022
Last modification date: 20/05/2022

Program that defines the controller for the Client, its routes and functionalities
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import { Request, Response } from 'express';
import db from '../models';
import AbstractController from './AbstractController';
import cryptoService from '../services/cryptoService';

class ClientController extends AbstractController{
    //Singleton
    private static instance: ClientController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new ClientController("client");
        return this.instance;
    }

    //Body validation
    protected validateBody(type: |'clientLogin'|'clientRegister'){
        switch(type){
            case 'clientLogin':
                return checkSchema({
                    email: {
                        isEmail: {
                            errorMessage: 'Must be a valid email'
                        }
                    },
                    password: {
                        isString: {
                            errorMessage: 'Password must be a string'
                        } 
                    }
                });
            case 'clientRegister':
                return checkSchema({
                    client_name: {
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
                            errorMessage: 'Password must be a string'
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
                    },
                    phone_number: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isMobilePhone: {
                            errorMessage: 'Must be a valid phone number'
                        }
                    },
                    client_pin: {
                        isString: {
                            errorMessage: 'Must be a string'
                        },
                        isLength: {
                            options: {
                                min: 4,
                                max: 4
                            },
                            errorMessage: 'Pin must be only 4 characters long'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes():void {
        this.router.post('/clientLogin', this.validateBody('clientLogin'), this.handleErrors, this.clientLogin.bind(this));
        this.router.post('/clientRegister', this.validateBody('clientRegister'), this.handleErrors, this.clientRegister.bind(this));
    }

    //Controllers
    private async clientLogin(req:Request, res:Response){
        /*
        Method that lets clients to log in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const encryption = new cryptoService();

        try{
            //Obtaining client's password
            let result = await db["Client"].findAll({
                attributes: ["password"],
                where: {
                    email: req.body.email,
                }
            });
            const password = result[0].password;

            if(result.length > 0 && password === encryption.hash(req.body.password)){
                //If password hashes mathc the client is logged in
                res.status(200).send({message: "Logged in", body: result[0]});
            }else{
                //If not inform
                res.status(404).send({message: "Incorrect email or password"});
            }
        }catch(error:any){
            //If an exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async clientRegister(req:Request, res:Response){
        /*
        Method that lets a client to be registered in our app

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const encryption = new cryptoService();

        try{
            //Hashing client's password and pin
            var hashedPassword = encryption.hash(req.body.password);
            var hashedPin = encryption.hash(req.body.client_pin);

            //Registering client in RDS
            let register = await db["Client"].create({
                client_name: req.body.client_name,
                password: hashedPassword,
                email: req.body.email,
                phone_number: req.body.phone_number,
                client_pin: hashedPin
            });

            console.log("Client registered");
            res.status(200).send({message: "Client registered", body: register});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default ClientController;