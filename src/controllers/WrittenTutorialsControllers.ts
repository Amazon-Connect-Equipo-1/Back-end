/*
WrittenTutorialsControllers.ts
Author:
- Ariadna Huesca Coronado

Creation date: 09/05/2022
Last modification date: 11/05/2022

Program that handles the written tutorials
*/
import { Request, Response } from 'express';
import AbstractController from './AbstractController';
import fetch from "node-fetch";
import axios from 'axios';
import WrittenTutorialsModel from "../modelsNoSQL/written_tutorials";

class WrittenTutorialsController extends AbstractController{
    //Singleton
    private static instance:WrittenTutorialsController;

    public static getInstance():AbstractController{
            if(this.instance){
                //If instance is already created
                return this.instance;
            }
            //If instance was not created we create it
            this.instance = new WrittenTutorialsController("tutorials");
            return this.instance;
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/getTutorials', this.postGetTutorials.bind(this));        
    }
    
    private async postGetTutorials(req:Request, res:Response){
        const tutorial:string = req.body.tutorial;
        //res.send("ni idea de que estoy haciendo");  
        try{
            const users = await WrittenTutorialsModel.scan().exec().promise();
            //res.send("adfads");
            res.status(200).send(users);
        }catch(err){
            res.status(500).send("Error fatal:"+err);
        }
    }

    
};

export default WrittenTutorialsController;