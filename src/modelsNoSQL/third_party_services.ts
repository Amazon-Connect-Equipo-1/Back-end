import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

const ThirdPartyServicesModel = dynamodb.define('third_party_services', {
    hashKey: 'ThirdPartyServiceId',
    timestamps: true,
    schema: {
        ThirdPartyServiceId: dynamodb.types.uuid(),
        callId: Joi.number(),
        serivceData: Joi.array()
    },
    tableName: `Third Party Serivces${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table Third Party Services created succesfully');
});

export default ThirdPartyServicesModel;