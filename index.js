
var express = require('express');
var app = express();
var mysql      = require('mysql');
var bodyParser = require('body-parser');
var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());



var connection = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  port      : '3307',
  user     : 'root', //mysql database user name
  password : 'Ruutti', //mysql database password
  database : 'asiakas' //mysql database name
});

connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected with mysql database...')
})

app.use( bodyParser.json() );       
app.use(bodyParser.urlencoded({    
  extended: true
}));

var server = app.listen(3000,  "127.0.0.1", function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

});


app.get('/asiakas', function (req, res ) {
   connection.query('select * from asiakas', function (error, results) {
    if (error) throw error;
    console.log(results);
    var tulos = "<tr><th>Avain</th><th>Nimi</th><th>Osoite</th><th>Asiakastyyppi</th></tr>";
    for (x of results){
   tulos += 
  "<tr><td>"+ x.AVAIN + ""+"</td><td>"+ x.NIMI+"</td><td>"+ x.OSOITE +"</td><td>"+ x.ASTY_AVAIN + "</td></tr>"
    }
    res.end(tulos);
	});
});


app.get('/asiakas/nimi=:nimi/osoite=:osoite/asty=:asty', function (req, res) {
   var nimi = req.params.nimi;
  var osoite = req.params.osoite;
 var asty  = req.params.asty;
 if (nimi == "*"){
 nimi = "";}
 if (osoite == "*"){
  osoite = "";}
  if (asty == "*"){
    asty = "";}

  var cmd = "select * from asiakas WHERE nimi like '" + nimi + "%' AND osoite like '"+ osoite +"%' AND asty_avain like '"+ asty +"%'" ;
  console.log(cmd);
  connection.query(cmd, function (error, results) {

    if (error) throw error;
    console.log(results);
    var tulos = "<tr><th>Avain</th><th>Nimi</th><th>Osoite</th><th>Asiakastyyppi</th></tr>";
    for (x of results){
   tulos += 
  "<tr><td>"+ x.AVAIN + ""+"</td><td>"+ x.NIMI+"</td><td>"+ x.OSOITE +"</td><td>"+ x.ASTY_AVAIN + "</td></tr>"
    }
    res.end(tulos);
	});
	});


  app.get('/asiakastyypit', function (req, res ) {
    connection.query('SELECT avain, selite from asiakastyyppi', function (error, results) {
     if (error) throw error;
     console.log(results);
     var addStr = "";
     for (x of results){
      addStr += "<option value="+x.avain+">"+x.avain+" "+ x.selite +"</option>";
    }
     res.end(addStr);
   });
 });


app.post('/uusiasiakas/nimi=:nimi/osoite=:osoite/postinro=:postinro/postitmp=:postitmp/asty=:asty', function (req, res) {
  console.log(req);
  var params  = req.body;
  var nimi = req.params.nimi;
  var osoite = req.params.osoite;
  var postinro = req.params.postinro;
  var postitmp = req.params.postitmp;
 var asty  = req.params.asty;



  var cmd = "INSERT INTO `asiakas` (`NIMI`, `OSOITE`, `POSTINRO`, `POSTITMP`, `LUONTIPVM`, `ASTY_AVAIN`) VALUES ('"+nimi+"', '"+osoite+"', "+postinro+", '"+postitmp+"', CURDATE(), "+asty+")";
  
  
   connection.query(cmd , params, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
