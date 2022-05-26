/*
third_party_services.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the noSQL table Third Party Services model and its relationships
*/

import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

//Model of the THird Party Services table
const ThirdPartyServicesModel = dynamodb.define('third_party_services', {
    hashKey: 'ThirdPartyServiceId',
    timestamps: true,
    schema: {
        //Table attributes
        ThirdPartyServiceId: dynamodb.types.uuid(),
        callId: Joi.string(),
        service: Joi.string(),
        serviceData: Joi.object()
    },
    tableName: `ThirdPartySerivces${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    /*
    Function that creates the tables or raises an error

    Parameters:
    err - the error that may be raised during the creation of the table
    Returns:
    Returns the error raised if ocurred
    */
    if(err){
        //If an error ocurrs the system will notify it
        return console.log('Error creating tables', err);
    }
    //If no error ocurrs the system will create the tables and notify it
    console.log('Table Third Party Services created succesfully');
});

export default ThirdPartyServicesModel;