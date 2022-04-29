import { Router } from 'express';

export default abstract class AbstractController{
    //Class attributes
    private _router: Router = Router();
    private _prefix: string;

    //Getters
    public get prefix(): string {
        return this._prefix;
    }
    public get router(): Router {
        return this._router;
    }

    //Constructor of the class
    constructor(prefix:string){
        this._prefix=prefix;
        this.initRoutes();
    }

    //Abstract methods
    protected abstract initRoutes():void;
}