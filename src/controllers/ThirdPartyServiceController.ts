import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import fetch from "node-fetch";

class ThirdPartyServiceController extends AbstractController{
    //Singleton
    private static instance:ThirdPartyServiceController;

    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new ThirdPartyServiceController("tps");
            return this.instance;
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/askService', this.postAskService.bind(this));
    }

    private async postAskService(req:Request, res:Response){
        const service:string = req.body.service;
        var service_api:string = "";
        if(service === "Uber"){
            service_api = 'https://zpdzfn1jqg.execute-api.us-west-2.amazonaws.com/default/UberService'
        }else if(service === "UberEats"){
            service_api = 'https://p0pkc05on4.execute-api.us-west-2.amazonaws.com/default/UberEatsService'
        }else if(service === "Oxxo"){
            service_api = 'https://358ylrjr87.execute-api.us-west-2.amazonaws.com/default/OxxoService'            
        }else{
            res.status(500).send("Service doesn't exist");
        }
        try{
            const result:any = await fetch(service_api, {
                method: 'POST',
                body: JSON.stringify(req.body.service_data)
            });
                
            console.log(result);
            res.status(200).send(result.body);
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error retreiving service");
        }
    }
};

export default ThirdPartyServiceController;