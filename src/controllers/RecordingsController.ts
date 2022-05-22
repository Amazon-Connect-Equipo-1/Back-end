/*
RecordingsControllers.ts
Author:
- Ariadna Huesca Coronado
- Israel Sánchez Miranda
- Claudia Sarahí Armenta Maya

Creation date: 15/05/2022
Last modification date: 20/05/2022

Program that defines the controller for the Recordings, its routes and functionalities
*/
import { Request, Response } from 'express';
import { checkSchema } from 'express-validator';
import AbstractController from './AbstractController';

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

    //Body validation
    protected validateBody(type:|'addKeystroke'|'addClick'){
        switch(type){
            case 'addKeystroke': 
                return checkSchema({
                    key: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
                case 'addClick': 
                return checkSchema({
                    button: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    },
                    agent_id: {
                        isString: {
                            errorMessage: 'Must be a string'
                        }
                    }
                });
        }
    }

    //Route configuration
    protected initRoutes():void{
        this.router.post('/addKeystroke', this.authMiddleware.verifyToken, this.validateBody('addKeystroke'), this.handleErrors, this.postAddKeystroke.bind(this));  
        this.router.post('/addClick', this.authMiddleware.verifyToken, this.validateBody('addClick'), this.handleErrors, this.postAddClick.bind(this));              
    }
    
    private async postAddKeystroke(req:Request, res:Response){
        const key:string = req.body.key;
        const agent_id:string = req.body.agent_id;
        
        res.send("writing "+key+" "+agent_id+" "+" on a document");
    }

    private async postAddClick(req:Request, res:Response){
        const button:string = req.body.button;
        const agent_id:string = req.body.agent_id;
        
        res.send("writing "+button+" "+agent_id+" "+" on a document");
    }

    /*async uploadFilesToS3(file,fileName) {
        return new Promise(async (resolve, reject) => {
          const bucket = new S3(
            {
              accessKeyId: "*your accesskey*",
              secretAccessKey: "*your s3SecretAccessKey*",
              region: "*your awsRegion *"
            }
          );
          const params = {
            //Bucket: environment.bucketName,
            Key: path+ "/" + fileName
            Body: file
          };
          bucket.upload(params,async(err,data)=>{
                 if(data){
                      console.log("Video uploaded")
                   }
                   if(err){
                      console.log("Video uploaded failed")
                   }
             })
        })
      }*/
};

export default RecordingsController;
