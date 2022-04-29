import dynamodb from '../services/dynamoService';
import Joi from 'joi';
import { PREFIX_TABLE } from '../config';

const WrittenTutorialsModel = dynamodb.define('written_tutorials', {
    hashKey: 'WrittenTutorialId',
    timestamps: true,
    schema: {
        WrittenTutorialId: dynamodb.types.uuid(),
        name: Joi.string(),
        tutorial: Joi.string()
    },
    tableName: `Written Tutorials${PREFIX_TABLE}` 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table Written Tutorials created succesfully');
});

export default WrittenTutorialsModel;