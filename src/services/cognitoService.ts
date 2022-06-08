/*
cognitoService.ts
Author:
- Israel Sánchez Miranda

Creation date: 14/05/2022
Last modification date: 16/05/2022

Program that handles all the services cognito offers
*/

//Libraries that will be used
import { COGNITO_APP_CLIENT_ID, COGNITO_APP_SECRET_HASH, AWS_REGION, COGNITO_USER_POOL_ID } from '../config';

import AWS from 'aws-sdk';
import crypto from 'crypto';

type CognitoAttributes = 'email' | 'name' | 'phone_number' ;

class CognitoService{
    //Attributes for connecting to Cognito
    private config: AWS.CognitoIdentityServiceProvider.ClientConfiguration;
    private cognitoIdentity: AWS.CognitoIdentityServiceProvider;

    //Attributes for connecting the app to cognito
    private clientId = COGNITO_APP_CLIENT_ID;
    private secretHash = COGNITO_APP_SECRET_HASH;
    private userPoolId = COGNITO_USER_POOL_ID;

    //Singleton
    private static instance: CognitoService;

    //Getter
    public static getInstance(): CognitoService{
        if(this.instance){
            //If instance is already created
            return this.instance;
        }
        //If instance wasn't created we create it
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
        /*
        Method that hashes a given string

        Parameters:
        username: the string to hash
        Returns:
        The username string hashed
        */
        return crypto
            .createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64');
    }

    public async signUpUser(email:string, password:string, userAttr:{Name:CognitoAttributes;Value:string}[]){
        /*
        Method that signs up a user in cognito

        Parameters:
        email - email of the user
        password - password of the user
        userAttr - attributes of the user
        Returns:
        A cognito identity created with the given parameters
        */
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
        /*
        Method that verifies a user in the Cognito platform

        Parameters:
        email - email of the user that will be verified
        code -  code of verification sent to the user's email
        Returns:
        A verification of the user in the Cognito platform
        */
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            Username: email,
            SecretHash: this.hashSecret(email)
        };

        return await this.cognitoIdentity.confirmSignUp(params).promise();
    }

    public async signInUser(email:string, password:string){
        /*
        Method that signs in a user with Cognito

        Parameters:
        email - user's email
        password - user's password
        Returns:
        Tokens for the user to stay signed in
        */
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

    public async signOut(accessToken:any){
        /*
        Method that signs out user with Cognito

        Parameters:
        accessToken - user's access token
        Returns:
        Invalidation of user's tokens
        */
        const params = {
            AccessToken: accessToken
        };

       return await this.cognitoIdentity.globalSignOut(params).promise();
    }

    public async forgotPassword(email:string){
        /*
        Method that initalizes a forgot password flow

        Parameters:
        email - user's email
        Returns:
        An email is sent to the user with a code to reset his password
        */
        const params = {
            ClientId: this.clientId,
            Username: email,
            SecretHash: this.hashSecret(email)
        };

        return await this.cognitoIdentity.forgotPassword(params).promise();
    }

    public async confirmForgotPassword(email:string, confirmationCode:string, password:string){
        /*
        Method that resets the user's password for a new one

        Parameters:
        email - user's email
        confirmationCode - the code sent to the user's email
        password - user's new password
        Returns:
        Changes the Cognito password for the specified user
        */
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: confirmationCode,
            Password: password, 
            Username: email,
            SecretHash: this.hashSecret(email)
        };

        return await this.cognitoIdentity.confirmForgotPassword(params).promise();
    }

    public async refreshToken(refreshToken:string){
        /*
        Method that uses the user's refresh token to update user's access token

        Parameters:
        refreshToken - user's refresh token
        Returns:
        Tokens for the user to stay signed in
        */
		const params = {
			AuthFlow: 'REFRESH_TOKEN_AUTH',
			ClientId: this.clientId,
			AuthParameters: {
				REFRESH_TOKEN: refreshToken,
				SECRET_HASH: this.secretHash
			}
		};

		return await this.cognitoIdentity.initiateAuth(params).promise();
	}


    public async getUserEmail(token:string){
        /*
        Method that gets the active user's email

        Parameters:
        token - user's acces token
        Returns:
        User's email or undefined if it wasn't found
        */
        const params = {
            AccessToken: token
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