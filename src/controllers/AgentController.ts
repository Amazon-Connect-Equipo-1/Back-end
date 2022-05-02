/*
AgentController.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the controller for the Agent, its routes and functionalities
*/

import AbstractController from './AbstractController';

class UserController extends AbstractController{
    //Singleton
    private static instance:UserController;

    public static getInstance():AbstractController{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance was not created we create it
        this.instance = new UserController("user");
        return this.instance;
    }

    //Route configuration
    protected initRoutes(): void {
        //this.router.get('/readUser', this.getReadUser.bind(this));        
    }

    //Controllers
    //Here add al the functions every route needs
}

export default UserController;