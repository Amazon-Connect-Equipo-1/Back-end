/*
AuthenticationController.ts
Author:
- Israel Sánchez Miranda

Creation date: 21/05/2022
Last modification date: 21/05/2022

Program that handles the Configurations of the users (agents, administrators and quality agents)
*/

import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';
import UserConfigModel from '../modelsNoSQL/user_configurations';

class UserConfigController extends AbstractController{
    //Singleton
    private static instance: UserConfigController;

    //Getter
    public static getInstance():AbstractController{
        if(this.instance){
            return this.instance;
        }
        this.instance = new UserConfigController("userConfig");
        return this.instance;
    }

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

    //Methods
    protected initRoutes():void {
        //Routes fot his controller
        this.router.get('/getUserConfig', this.getUserConfig.bind(this));
        this.router.post('/updateUserConfig', this.postUserConfig.bind(this));
    }

    private async getUserConfig(req:Request, res:Response){
        var user_id:any = req.query.id?.toString();
        try{
            const config = await UserConfigModel
                .query(user_id)
                .usingIndex('userConfig')
                .exec()
                .promise();

            res.status(200).send({user_id: user_id, user_configuration: config[0].Items[0]});
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    private async postUserConfig(req:Request, res:Response){
        const {user_id, color, text_size, language} = req.body;
         try{
             let config_id = await UserConfigModel
                .query(user_id)
                .usingIndex('userConfig')
                .attributes(["UserConfigId"])
                .exec()
                .promise();
            
            await UserConfigModel.update({
                UserConfigId: config_id[0].Items[0].attrs.UserConfigId,
                color: color,
                textSize: text_size,
                language: language
            });
             
             res.status(200).send({message: `User ${user_id} configurations updated`});
         }catch(error:any){
             res.status(500).send({code: error.code, message: error.message});
         }
    }
}

export default UserConfigController;