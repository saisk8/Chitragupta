/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
// init project
const express = require('express');
require('dotenv').config();
const util = require('util');
// Start app
const app = express();
// Create a new MongoClient
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://robo:${process.env.DB_PASS}@sas-7rcpg.mongodb.net/test?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true });
let db = null;

// client.connect(err => {
//   console.log('Connected correctly to server');
//   db = client.db('sm').collection('smc');
// });

// Use connect method to connect to the Server
// http://expressjs.com/en/starter/static-files.html
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/index.html`);
});

app.get('/data', (request, response) => {
  client.connect(err => {
    console.log('Connected correctly to server');
    let res = [];
    let stream = client
      .db('sm')
      .collection('smc')
      .find()
      .stream();
    stream.on('data', doc => {
      res.push(doc);
    });
    stream.on('error', err => {
      console.log(err);
    });
    stream.on('end', () => {
      console.log('All done!');
      response.json(res);
    });
  });
});

app.post('/new', (request, response) => {
  client.connect(err => {
    console.log('Connected correctly to server');
    db = client
      .db('sm')
      .collection('smc')
      .insertOne(request.body, err => {
        if (err) {
          console.log(err);
          return response.send(JSON.stringify(err));
        }
        return response.send('pass');
      });
  });
});

// listen for requests :)
app.listen(3000, () => {
  console.log('Open at http://localhost:3000');
});
