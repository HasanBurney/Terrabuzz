const express = require('express');
const indexRouter = require('./routes/index.js');
const middleware = require('./middleware/index.js');
const MYSQL_CONNECTOR = (require('./db/mysql/connection.js'));
const MONGOOSE_CONNECTOR = require('./db/mongo/connection.js');
const path = require('path');
const fs = require('fs');
const { Console } = require('console');
require('dotenv').config();

const Declare_Schema = () => {
    {
        const queries = fs.readFileSync(path.join(__dirname, './db/mysql/script.sql')).toString();
        console.log("_________________________________________________");
        console.log(queries);
        const query = db.query(queries,  (err, result) => {
        if(err){
            console.log(`Query Not Executed Successfully`);
        }
        else{
            console.log(`Query Executed`);
        }
        console(`After conditions`);
        console(`Query result = ${query}`);
        });
    }
}

MYSQL_CONNECTOR.connect();
Declare_Schema();
MONGOOSE_CONNECTOR.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/', indexRouter);
app.use(middleware.notFound);
app.use(middleware.onError);

module.exports = app;
