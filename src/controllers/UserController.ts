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
        //Here add all routes the user controller has
    }

    //Controllers
    //Here add al the functions every route needs
}

export default UserController;