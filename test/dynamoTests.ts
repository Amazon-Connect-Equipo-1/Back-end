/*
dynamoTests.ts
Author:
- Israel Sánchez Miranda  

Creation date: 28/04/2022
Last modification date: 29/04/2022

Program used to initializes (for the first time) the Dynamo noSQL tables, needs to be modified to work
*/

/*const dynamodb = require("dynamodb");
const Joi = require('joi');

//SDK configutation in Node.js to work with the cloud
dynamodb.AWS.config.update({
    accessKeyId: '<YOUR ACCESS KEY>',
    secretAccessKey: '<YOUR SECRET ACCESS KEY>',
    region: '<YOUT AWS REGION>'
});

const YourNoSQLModel = dynamodb.define('YourNoSQLModel', {
    hashKey: 'YourModelHashKey(ID)',
    timestamps: true,
    schema: {
        //Here insert your table attributes
    },
    tableName: 'YourTableName' 
});

dynamodb.createTables((err:any) => {
    if(err){
        return console.log('Error creating tables', err);
    }
    console.log('Table <YOUR TABLE NAME> created succesfully');
});*/

//After completing the code above exectue the tsc .\dynamoTests.ts command to transpile it to JS
//When the transpilation is complete execute the node .\dynamoTests.js command to create your table
