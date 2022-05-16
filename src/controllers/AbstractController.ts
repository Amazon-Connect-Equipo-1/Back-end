/*
AbstractController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 28/04/2022

Class that stores the abstract implementation of the controllers
*/

import { Router } from 'express';
import ValidationErrorMiddleware from '../middlewares/validationError';
import CognitoService from '../services/cognitoService';

export default abstract class AbstractController{
    /*
    Class that defines an abstract model for the controllers
    */

    //Attributes
    private _router: Router = Router();
    private _prefix: string;

    //Middlewares
    protected handleErrors = ValidationErrorMiddleware.handleErrors;
    protected cognitoService = CognitoService.getInstance();

    //Getters
    public get prefix(): string {
        return this._prefix;
    }
    public get router(): Router {
        return this._router;
    }

    //Constructor
    constructor(prefix:string){
        this._prefix=prefix;
        this.initRoutes();
    }

    //Class methods
    //Abstract method that initializes the routes of the controller
    protected abstract initRoutes():void;

    //Abstract method that validates the body of the requests
    protected abstract validateBody(type:any):any;
}