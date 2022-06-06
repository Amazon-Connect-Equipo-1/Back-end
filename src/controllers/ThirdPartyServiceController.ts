/*
AgentController.ts
Authors:
- Israel Sánchez Miranda
- Erick Hernández Silva
- David Rodríguez Fragoso

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the controller for the Third Party Services, its routes and functionalities
*/

//Libraries that will be used
import { checkSchema } from 'express-validator';
import { Request, Response } from 'express';
import fetch from "node-fetch";
import axios from 'axios';
import ThirdPartyServicesModel from "../modelsNoSQL/third_party_services";
import AbstractController from './AbstractController';

class ThirdPartyServicesController extends AbstractController{
    //Singleton
    private static instance:ThirdPartyServicesController;

    //Getter
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
                    service: {
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
                    service: {
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

    //Controllers
    private async sendEmail(req:Request, res:Response){
        /*
        Method that sends an email with the third party service information to the client

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        var message = "";

        //Build the message depending on the type of service asked
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

        //Building the payload for the email messaging API
        const payload ={
            "recipient": req.body.service_data.client_email, 
            "message": message,
            "subject": `Your ${req.body.service} information.`
        };
        console.log(payload);

        try{
            //Making a post method to email messaging API
            await fetch('https://1q24bha2hj.execute-api.us-west-2.amazonaws.com/default/emailMessagingNode', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            res.status(200).send({message: "Email sent!"});
        }catch(err:any){
            //If exception occurs inform
            res.status(500).send({code: err.code, message: err.message});
        }
    }

    private async postAskService(req:Request, res:Response){
        /*
        Method that lets an agent to ask for a third party service using custom APIs

        Parameters:
        req - request sent to the route
        res - response the route will give
        Returns:
        res - status and response of the route
        */
        const service:string = req.body.service;
        var service_api:string = "";

        //Changing the third party service API depending on the service asked
        if(service === "Uber"){
            service_api = 'https://zpdzfn1jqg.execute-api.us-west-2.amazonaws.com/default/UberService'
        
        }else if(service === "UberEats"){
            service_api = 'https://p0pkc05on4.execute-api.us-west-2.amazonaws.com/default/UberEatsService'
       
        }else if(service === "Oxxo"){
            service_api = 'https://358ylrjr87.execute-api.us-west-2.amazonaws.com/default/OxxoService'            
        
        }else if(service === "Report"){
            service_api = ' https://gt5y43i317.execute-api.us-west-2.amazonaws.com/default/AnonymousReporting'
        
        }else{
            //If service doesn't exist, inform
            res.status(500).send({message: "Service doesn't exist"});
        }

        try{
            //Posting to the API
            axios.post(service_api,req.body.service_data)
                .then(async response => {
                    console.log(response.data);
                    //Store service in DynamoDB
                    const object = {
                        "callId": req.body.call_id,
                        "service": service,
                        "serviceData": req.body.service_data
                    }
                    await ThirdPartyServicesModel.create(object);

                    res.status(200).send({message: "Service asked!", body: response.data})
                });
        }catch(err:any){
            //If exception occurs inform
            console.log(err);
            res.status(500).send({code: err.code, message: err.message});
        }
    }
};

export default ThirdPartyServicesController;