// server.js
// where your node app starts

// init project
var express = require('express');
var moment = require('moment');
var app = express();
var isValidUnix = false;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

//Date validation middlewere
app.param('date', (req, resp, next, date) => {
  const isValidDate = moment(date, false).isValid();
  isValidUnix = moment.unix(date).isValid();
  if(date == null || isValidDate || isValidUnix) {
    next();
  } else {
    resp.json({ error : "Invalid Date" });
  }
 });

app.get("/api/:date?", (req, res) => {   
  
  const toGMTDate = (date) => {
    return moment.utc(date)
                 .format('ddd, DD MMM YYYY HH:mm:ss z')
                 .replace('UTC','GMT');    
  }; 
  
  //If date is null let's take the current date
  if(req.params.date == null) {
    req.params.date = Date.now();
  }

  //Fixing date param if it's a Unix epoch 
  const fixedDate = isValidUnix ? moment.unix(req.params.date/1000) : req.params.date; 
  //Base date object   
  const reqDate = new Date(fixedDate);
  //Formatting the base date to UTC 
  const gmtDate = toGMTDate(reqDate);
  //Retriving Unix epoch
  const unixDate = isValidUnix ? req.params.date : reqDate.getTime();
  
   const repObj = {
     unix : parseInt(unixDate, 10),  
     utc  : gmtDate
   }     

  res.json(repObj);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
