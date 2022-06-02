import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_REGION, CONNECT_INSTANCE_ID, CONNECT_ROUTING_PROFILE_ID, CONNECT_MANAGER_PROFILE_ID, CONNECT_AGENT_PROFILE_ID, CONNECT_QUALITY_ANALYST_PROFILE_ID } from '../config';

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
            return this.instance;
        }
        this.instance = new ConnectService();
        return this.instance;
    }

    private constructor(){
        this.config = {
            region: AWS_REGION,
            accessKeyId: AWS_ACCESS_KEY,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        };

        this.connectIdentity = new AWS.Connect(this.config);
    }

    public async createUser(email:string, role:string, username:string, password:string, firstname:string, lastname:string){
        var role_id = "";
        if(role === "Manager"){
            role_id = CONNECT_MANAGER_PROFILE_ID;
        }else if(role === "QualityAnalyst"){
            role_id = CONNECT_QUALITY_ANALYST_PROFILE_ID;
        }else if(role === "Agent"){
            role_id = CONNECT_AGENT_PROFILE_ID;
        }

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

        return await this.connectIdentity.createUser(params).promise();
    }
}

export default ConnectService;