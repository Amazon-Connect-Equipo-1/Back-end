/*
AuthenticationController.ts
Author:
- Israel Sánchez Miranda
- David Rodríguez Fragoso
- Erick Hernández Silva

Creation date: 21/05/2022
Last modification date: 01/06/2022

Program that handles the Configurations of the users (agents, administrators and quality agents)
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import { Request, Response } from 'express';
import UserConfigModel from '../modelsNoSQL/user_configurations';
import AbstractController from './AbstractController';

class UserConfigController extends AbstractController{
    //Singleton
    private static instance: UserConfigController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new UserConfigController("userConfig");
        return this.instance;
    }

    //Body validation
    protected validateBody() {
        return checkSchema({
            user_id: {
                isString: {
                    errorMessage: 'Must be a string'
                }
            },
            color: {
                isString: {
                    errorMessage: 'Must be a string'
                }
            },
            textSize: {
                isString: {
                    errorMessage: 'Must be a string'
                }
            },
            language: {
                isString: {
                    errorMessage: 'Must be a string'
                }
            }
        });
    }

    //Route configuration
    protected initRoutes():void {
        this.router.get('/getUserConfig', this.authMiddleware.verifyToken, this.handleErrors, this.getUserConfig.bind(this));
        this.router.post('/updateUserConfig', this.authMiddleware.verifyToken, this.handleErrors, this.postUserConfig.bind(this));
    }

    //Controllers
    private async getUserConfig(req:Request, res:Response){
        /*
        Method that returns the configurations of a user (agent, manager or quality analyst) given his ID as a query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        var user_id:any = req.query.id?.toString();

        try{
            //Retreiving user's configurations
            const config = await UserConfigModel
                .query(user_id)
                .usingIndex('userConfig')
                .exec()
                .promise();

            res.status(200).send(config[0].Items[0]);
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postUserConfig(req:Request, res:Response){
        /*
        Method that lets a user (agent, manager or quality analyst) to update his configurations

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const {user_id, color, text_size, language} = req.body;

        try{
            //Obtaining configurations ID
             let config_id = await UserConfigModel
                .query(user_id)
                .usingIndex('userConfig')
                .attributes(["UserConfigId"])
                .exec()
                .promise();
            
            //Updating user's configurations
            await UserConfigModel.update({
                UserConfigId: config_id[0].Items[0].attrs.UserConfigId,
                color: color,
                textSize: text_size,
                language: language
            });
             
            res.status(200).send({message: `User ${user_id} configurations updated`});
        }catch(error:any){
            //If exception occurs inform
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}

export default UserConfigController;