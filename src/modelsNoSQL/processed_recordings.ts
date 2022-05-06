/*
processed_recordings.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the noSQL table Processed Recordings model and its relationships
*/

import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

//Model of the Processed Recordings table
const ProcessedRecordingsModel = dynamodb.define('processed_recordings', {
    hashKey: 'ProcessedRecordingId',
    timestamps: true,
    schema: {
        //Table attributes
        ProcessedRecordingId: dynamodb.types.uuid(),
        superId: dynamodb.types.uuid(),
        callId: Joi.number(),
        processedRecording: Joi.string(),
        duration: Joi.number(),
        recording_date: Joi.date(),
        tags: Joi.array(),
        recording_data: Joi.array()
    },
    tableName: `ProcessedRecordings${PREFIX_TABLE}` 
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
    console.log('Table Processed Recordings created succesfully');
});

export default ProcessedRecordingsModel;