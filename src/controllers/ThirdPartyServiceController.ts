/*
AgentController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 20/05/2022

Program that defines the controller for the Third Party Services, its routes and functionalities
*/

import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import fetch from "node-fetch";
import axios from 'axios';
import ThirdPartyServicesModel from "../modelsNoSQL/third_party_services";
import { checkSchema } from 'express-validator';

class ThirdPartyServicesController extends AbstractController{
    //Singleton
    private static instance:ThirdPartyServicesController;

    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new ThirdPartyServicesController("tps");
            return this.instance;
    }

    //Body validation
    protected validateBody(type:|'askService'|'sendService'){
        switch(type){
            case 'askService':
                return checkSchema({
                    serivce: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    service_data: {
                        isObject: {
                            options: {
                                strict: true
                            },
                            errorMessage: 'Must be a JSON object'
                        }
                    }
                });
            case 'sendService': 
                return checkSchema({
                    serivce: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    service_data: {
                        isObject: {
                            options: {
                                strict: true
                            },
                            errorMessage: 'Must be a JSON object'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/askService', this.authMiddleware.verifyToken, this.validateBody('askService'), this.handleErrors, this.postAskService.bind(this));
        this.router.post('/sendService', this.authMiddleware.verifyToken, this.validateBody('sendService'), this.handleErrors, this.sendEmail.bind(this));
    }

    private async sendEmail(req:Request, res:Response){
        var message = "";
        if(req.body.service === "Uber"){
            message = `Here's your service data, ${req.body.service_data.client}:<br/>Your rider is ${req.body.service_data.rider}, he will arrive to ${req.body.service_data.client_location} in a ${req.body.service_data.car.model} color ${req.body.service_data.car.color} with the plates ${req.body.service_data.car.plate} to take you to ${req.body.service_data.destination}.<br/>Your ride will arrive in approximately ${req.body.service_data.arrival_time} minutes and it will last ${req.body.service_data.ride_time} minutes.<br/>Here's a link to your ride: ${req.body.service_data.url}.`;
        }else if(req.body.service === "UberEats"){
            message = `Here's your service data, ${req.body.service_data.client}: <br/>Your order:<br/> `;
            const order = req.body.service_data.order;
            for(const key in order){
                message = message + order[key].quantity + " " + key + " x $" + order[key].price + "" + "<br/>";
            }
            message = message + `Your order will be delivered at ${req.body.service_data.client_location} by ${req.body.service_data.delivery_name} in ${req.body.service_data.delivery_time} minutes. <br/> The total price of your order is $${req.body.service_data.total}`;
        }else if(req.body.service === "Oxxo"){
            message = `Here's your service data, ${req.body.service_data.client}:<br/>Oxxo address to retire your money:<br/>Street ${req.body.service_data.oxxo_address.street}, ${req.body.service_data.oxxo_address.colony}, ${req.body.service_data.oxxo_address.state}, ${req.body.service_data.oxxo_address.country}, ${req.body.service_data.oxxo_address.zip_code}.<br/>You will retire $${req.body.service_data.quantity} from your account ${req.body.service_data.account_number} with the reference ${req.body.service_data.reference} and the token ${req.body.service_data.security_token}.`;
        }else if(req.body.service === "Report"){
            message = `Here's your service data, ${req.body.service_data.client}:<br/>You placed a report with the following description:<br/>${req.body.service_data.client_statement}.<br/>The statement was reported at ${req.body.service_data.client_location}. ${req.body.service_data.client_location_reference} at ${req.body.service_data.timestamp}.<br/>Your report will continue its process with the folio ${req.body.service_data.folio}, you will be contacted by your email (${req.body.service_data.client_email}) to continue the process.`;
        }

        const payload ={
            "recipient": req.body.service_data.client_email,  //For testing, when deployed it will be req.body.email
            "message": message,
            "subject": `Your ${req.body.service} information.`
        };
        console.log(payload);

        try{
            await fetch('https://y63tjetjmb.execute-api.us-west-2.amazonaws.com/default/emailMessaging', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            res.status(200).send({message: "Email sent!"});
        }catch(err:any){
            res.status(500).send({code: err.code, message: err.message});
        }
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
        }else if(service === "Report"){
            service_api = ' https://gt5y43i317.execute-api.us-west-2.amazonaws.com/default/AnonymousReporting'
        }else{
            res.status(500).send({message: "Service doesn't exist"});
        }

        try{
            axios.post(service_api,req.body.service_data)
                .then(async response=>{
                    console.log(response.data);
                    //Store in noSQL database
                    const object = {
                        "callId": req.body.callId,
                        "service": service,
                        "serviceData": req.body.service_data
                    }
                    await ThirdPartyServicesModel.create(object);
                    res.status(200).send({message: "Service asked!", body: response.data})
                });
        }catch(err:any){
            console.log(err);
            res.status(500).send({code: err.code, message: err.message});
        }
    }
};

export default ThirdPartyServicesController;