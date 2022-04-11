//Libraries imported
const dotenv = require('dotenv');
const express = require('express');

//Loading environment variables
dotenv.config()

//Creating the application
const app = express();
const port = process.env.PORT;

app.listen(port, () => console.log(`App online on port ${port}`))