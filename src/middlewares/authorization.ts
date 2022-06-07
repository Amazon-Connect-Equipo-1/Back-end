/*
authorization.ts
Authors:
- Israel Sánchez Miranda

Creation date: 12/05/2022
Last modification date: 12/05/2022

Program that handles all token authorizations
*/

//Libraries that will be used
import { COGNITO_USER_POOL_ID, AWS_REGION } from '../config';
import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import fetch from 'node-fetch';

const pems:{ [key:string]:string } = {};

class AuthMiddleware{
	//Attributes
	private poolRegion = AWS_REGION;
	private userPoolId = COGNITO_USER_POOL_ID;

	//Singleton
	private static instance: AuthMiddleware;

	//Getter
	public static getInstance():AuthMiddleware{
		if (this.instance){
			//If instance is already created
			return this.instance;
		}
		//If instance wasn't created we create it
		this.instance = new AuthMiddleware();
		return this.instance;
	}

	//Constructor of the class
	private constructor(){
		this.getAWSCognitoPems();
	}

	//Methods
	public verifyToken(req:Request, res:Response, next:NextFunction){
		/*
        Method that verifies the token given and executes next function

        Parameters:
        req - request sent to the route
        res - response the route will give
		next - next function that will be executed
        Returns:
        res - status and response of the route
        */
		if (req.headers.authorization){
			//If headers of the request contain an authorization token
			const token = req.headers.authorization.replace('Bearer ', '');
			const decodedJWT:any = jwt.decode(token, { complete: true });
			if (!decodedJWT){
				//If token is not valid inform
				return res.status(401).send({code: 'InvalidTokenException', message: 'The token is no valid'});
			}
			const kid = decodedJWT.header.kid;

			if(kid !== undefined){
				//Check if token is valid and verified
				if (Object.keys(pems).includes(kid)){
					//Inform if token is verified
					console.log("Verificado")
				}
				const pem = pems[kid];

				//Verify token
				jwt.verify(token, pem, { algorithms: ['RS256'] }, function (err:any){
					if(err){
						return res.status(401).send({code: 'InvalidTokenException', message: 'The token is no valid'});
					}					
				});
				req.user = decodedJWT.payload.username;
				req.token = token;
				
				//If token is valid execute next function
				next();
			}else{
				//If token is not valid, inform
				return res.status(401).send({code: 'InvalidTokenException', message: 'The token is no valid'});
			}		
			
		}else{
			//If exception occurs inform
			res.status(401).send({code: 'NoTokenFound', message: 'The token is not present in the request'});
		}
	}

	private async getAWSCognitoPems(){
		/*
        Method that obtains the Cognito Pems

        Parameters:
        None
        Returns:
        None
        */
		const URL = `https://cognito-idp.${this.poolRegion}.amazonaws.com/${this.userPoolId}/.well-known/jwks.json`;
		try{
			//Obtaining Cognito Pems
			const response = await fetch(URL);
			if (response.status !== 200) {
				throw 'COGNITO PEMS ERROR';
			}
			const data:any = await response.json();
			const { keys } = data;

			//Iterate over keys 
			keys.forEach((key: any) => {
				pems[key.kid] = jwkToPem({
					kty: key.kty,
					n: key.n,
					e: key.e,
				});
			});

		}catch(error:any){
			//If exception occurs inform
			console.log('Auth Middleware getAWSCognitoPems() error', error);
		}
	}
}

export default AuthMiddleware;