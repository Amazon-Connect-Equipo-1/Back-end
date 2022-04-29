import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

const RecordingsModel = dynamodb.define('recordings', {
    hashKey: 'RecordingId',
    timestamps: true,
    schema: {
        RecordingId: dynamodb.types.uuid(),
        callId: Joi.number(),
        videoRecording: Joi.string(),
        keystrokeClickRecording: Joi.string()
    },
    tableName: `Recordings${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table Recordings created succesfully');
});

export default RecordingsModel;