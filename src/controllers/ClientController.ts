/*
AuthenticationController.ts
Author:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 18/05/2022
Last modification date: 20/05/2022

Program that defines the controller for the Client, its routes and functionalities
*/

import { Request, Response } from 'express';
import cryptoService from '../services/cryptoService';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';
import db from '../models';

class ClientController extends AbstractController{
    //Singleton
    private static instance: ClientController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
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
                                max: 4
                            },
                            errorMessage: 'Pin must be 4 characters long'
                        }
                    }
                });
        }
    }

    //Methods
    protected initRoutes():void {
        //Routes fot his controller
        this.router.post('/clientLogin', this.validateBody('clientLogin'), this.handleErrors, this.clientLogin.bind(this));
        this.router.post('/clientRegister', this.validateBody('clientRegister'), this.handleErrors, this.clientRegister.bind(this));
    }

    private async clientLogin(req:Request, res:Response){
        try{
            let result = await db["Client"].findAll({
                where: {
                    email: req.body.email,
                    password: req.body.password
                }
            });

            if(result.length > 0){
                res.status(200).send({message: "Logged in", body: result[0]});
            }else{
                res.status(404).send({message: "Incorrect email or password"});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async clientRegister(req:Request, res:Response){
        const encryption = new cryptoService();
        try{
            //Hashing client's password and pin
            var hashedPasswordObject = encryption.encrypt(req.body.password);
            var hashedPassword = hashedPasswordObject.iv + "$" + hashedPasswordObject.content;
            var hashedPinObject = encryption.encrypt(req.body.client_pin);
            var hashedPin = hashedPinObject.iv + "$" + hashedPinObject.content;

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
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default ClientController;