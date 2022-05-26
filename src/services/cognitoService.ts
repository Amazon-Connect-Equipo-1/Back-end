/*
cognitoService.ts
Author:
- Israel Sánchez Miranda

Creation date: 14/05/2022
Last modification date: 16/05/2022

Program that handles all the services cognito offers
*/

import AWS from 'aws-sdk';
import crypto from 'crypto';
import { COGNITO_APP_CLIENT_ID, COGNITO_APP_SECRET_HASH, AWS_REGION } from '../config';

type CognitoAttributes = 'email' | 'name' | 'phone_number' ;

class CognitoService{
    //Attributes for connecting to Cognito
    private config: AWS.CognitoIdentityServiceProvider.ClientConfiguration;
    private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

    //Attributes for connecting the app to cognito
    private clientId = COGNITO_APP_CLIENT_ID;
    private secretHash = COGNITO_APP_SECRET_HASH;

    //Singleton
    private static instance: CognitoService;

    //Getter
    public static getInstance(): CognitoService{
        if(this.instance){
            return this.instance;
        }
        this.instance = new CognitoService();
        return this.instance;
    }

    //Constructor
    private constructor(){
        this.config = {
            region: AWS_REGION
        };
        this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
    }

    //Methods
    private hashSecret(username:string):string{
        return crypto
            .createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64');
    }

    public async signUpUser(email:string, password:string, userAttr:{Name:CognitoAttributes;Value:string}[]){
        const params = {
            ClientId: this.clientId, //Required from the app
            Password: password, //Required from the user
            Username: email, //Required from the user
            SecretHash: this.hashSecret(email), //Required from the app
            UserAttributes: userAttr, //User data
        };

        return await this.cognitoIdentity.signUp(params).promise();
    }

    public async verifyUser(email:string, code:string){
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            Username: email,
            SecretHash: this.hashSecret(email)
        };
        return await this.cognitoIdentity.confirmSignUp(params).promise();
    }

    public async signInUser(email:string, password:string){
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
                SECRET_HASH: this.hashSecret(email)
            }
        };
        return await this.cognitoIdentity.initiateAuth(params).promise();
    }

    public async signOut(accessToken:string){
        const params = {
            AccessToken: accessToken
        }

       return await this.cognitoIdentity.globalSignOut(params).promise();
    }

    public async forgotPassword(email:string){
        const params = {
            ClientId: this.clientId,
            Username: email,
            SecretHash: this.hashSecret(email)
        }

        return await this.cognitoIdentity.forgotPassword(params).promise();
    }

    public async confirmForgotPassword(email:string, confirmationCode:string, password:string){
        console.log(confirmationCode);
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: confirmationCode,
            Password: password, 
            Username: email,
            SecretHash: this.hashSecret(email)
        }

        return await this.cognitoIdentity.confirmForgotPassword(params).promise();
    }

    public async refreshToken(refreshToken:string){
        const params = {
            AuthFlow: 'RFRESH_TOKEN_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken,
                SECRET_HASH: this.secretHash
            }
        };
        return await this.cognitoIdentity.initiateAuth(params).promise();
    }

    public async getUserEmail(token:string){
        const params = {
            AccessToken: token,
        };
        const user = await this.cognitoIdentity.getUser(params).promise();
        const userEmail = user.UserAttributes.find((ua) => ua.Name === 'email');
        if(userEmail){
            return userEmail.Value as string;
        }
        return 'undefined';
    }
}

export default CognitoService;