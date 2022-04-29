import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

const ChatRecordingsModel = dynamodb.define('chat_recordings', {
    hashKey: 'ChatRecordingId',
    timestamps: true,
    schema: {
        ChatRecordingId: dynamodb.types.uuid(),
        chatId: Joi.number(),
        chatRecroding: Joi.string()
    },
    tableName: `Chat Recordings${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table Chat Recordings created succesfully');
});

export default ChatRecordingsModel;