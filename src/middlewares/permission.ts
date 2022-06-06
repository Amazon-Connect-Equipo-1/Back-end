/*
permission.ts
Authors:
- Israel Sánchez Miranda

Creation date: 12/05/2022
Last modification date: 12/05/2022

Program that handles all the permissions within the app
*/

//Libraries that will be used
import { Response, Request, NextFunction } from 'express';
import CognitoService from '../services/cognitoService';
import db from '../models';

export default class PermissionMiddleware{

    //Singleton
    private static instance: PermissionMiddleware;

    //Getter 
    public static getInstance(): PermissionMiddleware{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance wasn't created we create it
        this.instance = new PermissionMiddleware();
        return this.instance;
    }

    //Methods
    public async checkIsAdmin(req:Request, res:Response, next:NextFunction):Promise<void>{
        /*
        Method that verifies if a user is an administrator

        Parameters:
        req - request sent to the route
        res - response the route will give
        next - next function to execute
        Returns:
        res - status and response of the route
        */
        try{
            //Search for the user in the Manager table
            const cognitoService = CognitoService.getInstance();
            const user_email = await cognitoService.getUserEmail(req.token);
            const user = await db["Manager"].findAll({
                where: {
                    email: user_email
                }, 
                raw: true
            });

            if(user.length > 0 && !user[0].is_quality){
                //If user is a manager the next function executes
                next();
            }else{
                //If not inform
                res.status(401).send({code: 'UserNotAdminException', message: 'The logged account is not an administrator'});
            }
        }catch(error:any){
            //If exception occurs, inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    public async checkIsQuality(req:Request, res:Response, next:NextFunction):Promise<void>{
        /*
        Method that verifies if the user is a quality analyst

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        try{
            //Search for the user in the Manager table
            const cognitoService = CognitoService.getInstance();
            const user_email = await cognitoService.getUserEmail(req.token);
            const user = await db["Manager"].findAll({
                where: {
                    email: user_email
                },
                raw: true
            });

            if(user.length > 0 && user[0].is_quality){
                //If user is a quality analyst the next function executes
                next();
            }else{
                //If not inform
                res.status(401).send({code: 'UserNotQualityException', message: 'The logged account is not a quality agent'});
            }
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}