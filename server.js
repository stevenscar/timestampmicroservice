// server.js
// where your node app starts

// init project
var express = require('express');
var moment = require('moment');
var app = express();
var isUnix = false;

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

// Date validation
app.param('date', (req, resp, next, date) => {
  const isDate = moment(date, true).isValid();
  isUnix = moment.unix(date).isValid();
  if(isDate || isUnix) {
    next();
  } else {
    resp.json({ error : "Invalid Date" });
  }
 });

app.get("/api/:date", (req, res) => {  
  
  const toUTCDate = (date) => {
   return date.toLocaleDateString(
      'en-gb',
      {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
       timeZone: 'utc',
       weekday: 'short',
       hour: '2-digit',
       minute: '2-digit',
       second: '2-digit',
       timeZoneName: 'short'
      }
    );
  }; 

  //Fixing date param if it's a Unix epoch  
  const fixedDate = isUnix ? req.params.date*1000 : req.params.date ; 
  //Base date object 
  const reqDate = new Date(fixedDate);
  //Formatting the base date to UTC 
  const utcDate = toUTCDate(reqDate);
  //Retriving Unix epoch
  const unixDate = isUnix ? req.params.date : reqDate.getTime();
  
   const repObj = {
     unix : unixDate,  
     utc  : utcDate
   }     

  res.json(repObj);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
