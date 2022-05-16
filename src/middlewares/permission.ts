import { Response, Request, NextFunction } from 'express';
import db from '../models';

export default class PermissionMiddleware{
    //Singleton
    private static instance: PermissionMiddleware;

    //Getter 
    public static getInstance(): PermissionMiddleware{
        if(this.instance){
            return this.instance;
        }
        this.instance = new PermissionMiddleware();
        return this.instance;
    }

    //Methods
    public async checkIsAdmin(req:Request, res:Response, next:NextFunction):Promise<void>{
        //Verify if user is admin
        try{
            const user = await db["Manager"].findAll({
                where: {
                    email: req.body.email
                }, 
                raw: true
            });
            if(user.length > 0){
                next();
            } else {
                res.status(401).send({code: 'UserNotAdminException', message: 'The logged account is not an administrator'});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }

    public async checkIsQuality(req:Request, res:Response, next:NextFunction):Promise<void>{
        //Verify if user is quality agent
        try{
            const user = await db["Manager"].findAll({
                where: {
                    email: req.body.email
                },
                raw: true
            });
            if(user.length > 0 && user.is_quality){
                next();
            }else{
                res.status(401).send({code: 'UserNotQualityException', message: 'The logged account is not a quality agent'});
            }
        }catch(error:any){
            res.status(500).send({code: error.code, message: error.message});
        }
    }
}