import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import fetch from "node-fetch";
import axios from 'axios';
import ThirdPartyServicesModel from "../modelsNoSQL/third_party_services";

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

    //Route configuration
    protected initRoutes():void{
        this.router.post('/askService', this.postAskService.bind(this));
    }

    private async sendEmail(service:string, service_response:any){
        var message = "";
        if(service === "Uber"){
            message = `Here's your service data, ${service_response.client}:<br/>Your rider is ${service_response.rider}, he will arrive to ${service_response.client_location} in a ${service_response.car.model} color ${service_response.car.color} with the plates ${service_response.car.plate} to take you to ${service_response.destination}.<br/>Your ride will arrive in approximately ${service_response.arrival_time} minutes and it will last ${service_response.ride_time} minutes.<br/>Here's a link to your ride: ${service_response.url}.`;
        }else if(service === "UberEats"){
            message = `Here's your service data, ${service_response.client}: <br/>Your order:<br/> `;
            const order = service_response.order;
            for(const key in order){
                message = message + order[key].quantity + " " + key + " x $" + order[key].price + "" + "<br/>";
            }
            message = message + `Your order will be delivered at ${service_response.client_location} by ${service_response.delivery_name} in ${service_response.delivery_time} minutes. <br/> The total price of your order is $${service_response.total}`;
        }else if(service === "Oxxo"){
            message = `Here's your service data, ${service_response.client}:<br/>Oxxo address to retire your money:<br/>Street ${service_response.oxxo_address.street}, ${service_response.oxxo_address.colony}, ${service_response.oxxo_address.state}, ${service_response.oxxo_address.country}, ${service_response.oxxo_address.zip_code}.<br/>You will retire $${service_response.quantity} from your account ${service_response.account_number} with the reference ${service_response.reference} and the token ${service_response.security_token}.`;
        }

        const payload ={
            "recipient": "israelsanchez0109@outlook.com",  //For testing, when deployed it will be req.body.email
            "message": message,
            "subject": `Your ${service} information.`
        };
        console.log(payload);
        try{
            await fetch('https://y63tjetjmb.execute-api.us-west-2.amazonaws.com/default/emailMessaging', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            return 200;
        }catch(err:any){
            console.log(err);
            return 500;
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
        }else{
            res.status(500).send("Service doesn't exist");
        }
        try{
            axios.post(service_api,req.body.service_data)
                .then(async response=>{
                    console.log(response.data);
                    const result = await this.sendEmail(service, response.data);
                    if(result === 200){
                        //Store in noSQL database
                        const object = {
                            "callId": req.body.callId,
                            "service": service,
                            "serviceData": req.body.service_data
                        }
                        await ThirdPartyServicesModel.create(object);
                        res.status(result).send("Email sent!")
                    }else if(result === 500){
                        res.status(result).send("Error sending the email");
                    }
                });
        }catch(err:any){
            console.log(err);
            res.status(500).send("Error retreiving service");
        }
    }
};

export default ThirdPartyServicesController;