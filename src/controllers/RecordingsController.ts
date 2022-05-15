/*
RecordingsControllers.ts
Author:
- Ariadna Huesca Coronado

Creation date: 15/05/2022
Last modification date: 15/05/2022

Program that handles the recordings in no relational database
*/
import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import fetch from "node-fetch";
import axios from 'axios';
import WrittenTutorialsModel from "../modelsNoSQL/recordings";

class RecordingsController extends AbstractController{
    //Singleton
    private static instance:RecordingsController;

    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new RecordingsController("recordings");
            return this.instance;
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/addKeystroke', this.postAddKeystroke.bind(this));  
        this.router.post('/addClick', this.postAddClick.bind(this));              
    }
    
    private async postAddKeystroke(req:Request, res:Response){
        const key:string = req.body.key;
        const agent_id:string = req.body.agent_id;
        const description:string = req.body.description;
        
        res.send("writing "+key+" "+agent_id+" "+description+" on a document");
    }

    private async postAddClick(req:Request, res:Response){
        const button:string = req.body.button;
        const agent_id:string = req.body.agent_id;
        
        res.send("writing "+button+" "+agent_id+" "+" on a document");
    }

    
};

export default RecordingsController;
