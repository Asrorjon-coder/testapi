const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./Schemas/index');
require('dotenv').config({path: './secret.env'});
const mongoose = require('mongoose');

const app = express();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.use('/files', require('./route/files.js'));

const dbConn = mongoose.connection;
dbConn.on('error', err => console.log(`Connection error: ${err}`));
dbConn.once('open', () => console.log('Connected to DB'));

app.listen(process.env.PORT);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');