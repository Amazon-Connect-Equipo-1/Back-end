/*
chat_recordings.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the noSQL table Chat Recordings model and its relationships
*/

import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

//Model of the Chat Recordings table
const ChatRecordingsModel = dynamodb.define('chat_recordings', {
    hashKey: 'ChatRecordingId',
    timestamps: true,
    schema: {
        //Table attributes
        ChatRecordingId: dynamodb.types.uuid(),
        chatId: Joi.number(),
        chatRecording: Joi.string()
    },
    tableName: `ChatRecordings${PREFIX_TABLE}` 
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
    console.log('Table Chat Recordings created succesfully');
});

export default ChatRecordingsModel;