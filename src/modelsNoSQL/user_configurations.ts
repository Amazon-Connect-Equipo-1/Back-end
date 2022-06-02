/*
chat_recordings.ts
Author:
- Israel Sánchez Miranda
- Erick Hernández Silva

Creation date: 17/05/2022
Last modification date: 17/05/2022

Program that defines the noSQL table User Configurations model and its relationships
*/

//Libraries that will be used
import { PREFIX_TABLE } from '../config';
import dynamodb from '../services/dynamoService';
import Joi from 'joi';

//Model of the User Configurations table
const UserConfigModel = dynamodb.define('user_configurations', {
    hashKey: 'UserConfigId',
    timestamps: false,
    schema: {
        //Table attributes
        UserConfigId: dynamodb.types.uuid(),
        userId: Joi.string(),
        color: Joi.string(), //May have dark|light|dark_protanopia|dark_deuteranopia|dark_tritanopia|dark_protanomaly|dark_deuteranomaly|dark_tritanomaly as values
        textSize: Joi.string(), //May have small|medium|big as values
        language: Joi.string(), //May have EN|ES as values
    },
    tableName: `UserConfigurations${PREFIX_TABLE}` ,
    indexes: [
        {
            hashKey: 'userId',
            name: 'userConfig',
            type: 'global'
        }
    ]
});
/*
dynamodb.createTables((err:any) => {
    /*
    Function that creates the tables or raises an error

    Parameters:
    err - the error that may be raised during the creation of the table
    Returns:
    Returns the error raised if ocurred
    *//*
    if(err){
        //If an error ocurrs the system will notify it
        return console.log('Error creating tables', err);
    }
    //If no error ocurrs the system will create the tables and notify it
    console.log('Table User Configurations created succesfully');
});*/

export default UserConfigModel;