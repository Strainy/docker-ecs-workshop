const express = require('express')
const bodyParser = require("body-parser")
const {
  Pool,
  Client
} = require('pg')

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
app.get('/health', function(req, res) {
  res.send('Healthy :)')
})

// create a vote
app.post('/vote', function(req, res) {

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
app.get('/results', function(req, res) {

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
