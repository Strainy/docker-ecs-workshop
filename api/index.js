const express = require('express')
const bodyParser = require("body-parser")
const {
  Pool,
  Client
} = require('pg')
var fs = require('fs');

// Ensure we're exiting the app when "docker stop" is called
exitOnSignal('SIGINT');
exitOnSignal('SIGTERM');

function exitOnSignal(signal) {
  process.on(signal, function() {
    process.exit(1);
  });
}
process.stdin.resume();

// connection pool for psql
const pool = new Pool()

// initialise database
setTimeout(function () {

  var sql = fs.readFileSync('init.sql').toString()
  pool.connect(function(err, client, done) {

    if(err) {
      return console.error('connection error', err)
    }

    client.query(sql, function(err, result) {

      done()

      if(err) {
        console.log('Unable to bootstrap database: ', err)
        process.exit(1)
      }
      else {
        console.log("Finished bootstrapping db")
      }

    })

  })

}, 30000)

// express app and middleware
const app = express()
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// config for cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// simple health check endpoint
app.get('/api/health', function(req, res) {
  res.send('Healthy :)')
})

// create a vote
app.post('/api/vote', function(req, res) {

  let answer = req.body.answer
  console.log("Vote received. Value: " + answer)

  pool.query('INSERT INTO votes (value) VALUES ($1)', [answer], (err, result) => {

    if (err) {
      console.error(err)
    } else {
      res.send('OK')
    }
  })

})

// create a vote
app.get('/api/results', function(req, res) {

  pool.query('SELECT value, COUNT(value) from votes GROUP BY value;', (err, result) => {

    if (err) {
      console.error(err)
    } else {
      res.send(result.rows)
    }
  })

})

app.listen(3000, function() {
  console.log('Votify listening on port 3000!')
})
