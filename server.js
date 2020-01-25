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
    const res = [];
    const stream = client
      .db('sm')
      .collection('smc-new')
      .find()
      .stream();
    stream.on('data', doc => {
      res.push(doc);
    });
    stream.on('error', err1 => {
      console.log(err1);
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
      .collection('smc-new')
      .insertOne(request.body, err1 => {
        if (err1) {
          console.log(err1);
          return response.send(JSON.stringify(err1));
        }
        return response.send('pass');
      });
  });
});

// listen for requests :)
app.listen(3000, () => {
  console.log('Open at http://localhost:3000');
});
