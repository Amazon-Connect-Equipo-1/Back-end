/*
validationError.ts
Authors:
- Israel Sánchez Miranda

Creation date: 12/05/2022
Last modification date: 12/05/2022

Program that handles all the error validation within the app
*/

//Libraries that will be used
import { validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class ValidationErrorMiddleware{
    //Methods
    public static handleErrors(req:Request, res:Response, next:NextFunction){
        /*
        Method that returns the profile of an agent given his email as query parameter

        Parameters:
        req - request sent to the route
        res - response the route will give
        next - next function to execute
        Returns:
        res - status and response of the route
        */
        //Validating the result
        const result = validationResult(req);

        if(!result.isEmpty()){
            //If result has errors inform
            return res.status(422).json({errors: result.array()});
        }
        //If not, next function executes
        return next();
    }
}

export default ValidationErrorMiddleware;