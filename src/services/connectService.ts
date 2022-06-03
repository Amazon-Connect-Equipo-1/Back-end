/*
connectService.ts
Authors:
- Israel Sánchez Miranda
- David Rodriguez Fragoso

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the services of Amazon Connect that the app will use
*/

//Libraries that will be used
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION, CONNECT_INSTANCE_ID, CONNECT_ROUTING_PROFILE_ID, CONNECT_MANAGER_PROFILE_ID, CONNECT_AGENT_PROFILE_ID, CONNECT_QUALITY_ANALYST_PROFILE_ID } from '../config';
import AWS from 'aws-sdk';

class ConnectService {
    //Attributes for connecting to Amazon Connect
    private config: AWS.Connect.ClientConfiguration;
    private connectIdentity: AWS.Connect;

    //Attributes
    private connectInstanceId = CONNECT_INSTANCE_ID;

    //Singleton
    private static instance: ConnectService;

    //Getter
    public static getInstance(): ConnectService{
        if(this.instance){
            //If instance was already created
            return this.instance;
        }
        //If instance wasn't created we create it
        this.instance = new ConnectService();
        return this.instance;
    }

    //Constructor
    private constructor(){
        this.config = {
            region: AWS_REGION,
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        };

        this.connectIdentity = new AWS.Connect(this.config);
    }

    //Methods
    public async createUser(email:string, role:string, username:string, password:string, firstname:string, lastname:string){
        /*
        Method that creates a Connect user with the given parameters

        Parameters:
        email - email address of the user
        role - role of the user (Agent|Manager|QualityAnalyst)
        username - username of the user
        password - password for the user's account
        firstname - firstname of the user
        lastname - lastname of the user
        Returns:
        A connect user
        */
        //Assigining a profile ID to the user
        var role_id = "";
        if(role === "Manager"){
            role_id = CONNECT_MANAGER_PROFILE_ID;
        }else if(role === "QualityAnalyst"){
            role_id = CONNECT_QUALITY_ANALYST_PROFILE_ID;
        }else if(role === "Agent"){
            role_id = CONNECT_AGENT_PROFILE_ID;
        }

        //Defining the user parameters
        const params = {
            InstanceId: this.connectInstanceId,
            PhoneConfig: {
                PhoneType: 'SOFT_PHONE',
                AfterContactWorkTimeLimit: 0,
                AutoAccept: false,
            },
            RoutingProfileId: CONNECT_ROUTING_PROFILE_ID,
            SecurityProfileIds: [role_id],
            Username: username,
            IdentityInfo: {
                Email: email,
                FirstName: firstname,
                LastName: lastname
            },
            Password: password
        };

        //Creating the user
        return await this.connectIdentity.createUser(params).promise();
    }
}

export default ConnectService;