/*
recordings.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the noSQL table Recordings model and its relationships
*/

//Libraries that will be used
import { PREFIX_TABLE } from '../config';
import dynamodb from '../services/dynamoService';
import Joi from 'joi';

//Model of the Recordings table
const RecordingsModel = dynamodb.define('recordings', {
    hashKey: 'RecordingId',
    timestamps: true,
    schema: {
        //Table attributes
        RecordingId: Joi.string(), //Call ID from models/calls.ts
        videoRecording: Joi.string(),
        processedRecording: Joi.string(),
        agentName: Joi.string(),
        agentId: Joi.string(),
        thumbnail: Joi.string(),
        initialTimeStamp: Joi.string(),
        disconnectTimeStamp: Joi.string(),
        duration: Joi.string(),
        tags: Joi.array(),
        recordingData: Joi.object(),
        subtitles: Joi.string()
    },
    tableName: `Recordings${PREFIX_TABLE}`,
    indexes: [
        {
            hashKey: 'RecordingId',
            name: 'callId',
            type: 'global'
        },
        {
            hashKey: 'agentId',
            name: 'agentId',
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
    console.log('Table Recordings created succesfully');
});*/

export default RecordingsModel;