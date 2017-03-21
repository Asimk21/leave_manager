var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var api = require('./googleSheetApi')

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));


// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/adminDetails', function(req, res){
  details = {}
  details["mid"] = []
  details["leave"] = []
  api.getAdminSheetRows(function(rows){
      rows.forEach(function(row) {
        details["mid"].push(row.mid);
        details["leave"].push(row.leave);
      });
     res.send(details);
  });
});

app.get('/mindDetails',function(req,res){
  var mindInfo = [];
  api.getAdminSheetRowsByMid(req.query.mid, function(err, row){
    if(err){
      console.log(err);
      res.send(mindInfo);
    }else{
      mindInfo.push({
        mid: row.mid,
        name: row.name,
        team: row.team
      } );
      res.send(mindInfo);
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname + '/admin.html'))
})

app.post('/approval', function (req, res) {
  a(req.body)
  res.sendFile(path.join(__dirname + '/admin.html'))
})

app.get('/bankHolidays', function (req, res) {
  api.getBankHolidays(function(err, dates){
    if(err){
      console.log(err);
      res.send("error");
    }else{
      res.send(dates);
    }
  });
})

app.post('/myaction', urlencodedParser, function (req, res) {
  console.log(req.body)
  api.addRange(req.body)
  api.updateCell(req.body)
  res.redirect("/")
})

app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});
