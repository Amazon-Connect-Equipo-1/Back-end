/*
key_click_recordings.ts
Author:
- Israel Sánchez Miranda
- David Rodríguez Fragoso

Creation date: 06/06/2022
Last modification date: 06/06/2022

Program that defines the noSQL table Key Click Recordings model and its relationships
*/

//Libraries that will be used
import { PREFIX_TABLE } from '../config';
import dynamodb from '../services/dynamoService';
import Joi from 'joi';

//Model of the Recordings table
const KeyClickModel = dynamodb.define('key-click-recordings', {
    hashKey: 'KeyClickRecordingId',
    timestamps: true,
    schema: {
        //Table attributes
        KeyClickRecordingId: dynamodb.types.uuid(),
        agentId: Joi.string(),
        clickRecordings: Joi.array(),
        keyRecordings: Joi.array()
    },
    tableName: `KeyClickRecordings${PREFIX_TABLE}`,
    indexes: [
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
    console.log('Table KeyClickRecordings created succesfully');
});*/

export default KeyClickModel;