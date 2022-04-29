import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

const ProcessedRecordingsModel = dynamodb.define('processed_recordings', {
    hashKey: 'ProcessedRecordingId',
    timestamps: true,
    schema: {
        ProcessedRecordingId: dynamodb.types.uuid(),
        superId: dynamodb.types.uuid(),
        callId: Joi.number(),
        processedRecording: Joi.string(),
        length: Joi.number()
    },
    tableName: `Processed Recordings${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table Processed Recordings created succesfully');
});

export default ProcessedRecordingsModel;