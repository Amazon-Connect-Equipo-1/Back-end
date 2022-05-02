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

export default abstract class AbstractController{
    /*
    Class that defines an abstract model for the controllers
    */

    //Attributes
    private _router: Router = Router();
    private _prefix: string;

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
}