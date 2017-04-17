//398599473860653
//bff1e13cb4471f60ba85c991c253cb8e

var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var cookieSession = require("cookie-session");
var FacebookStrategy = require("passport-facebook").Strategy;
var grap = require("fbgraph");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieSession({ keys: ['','Y1tvfA3'] }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','pug')

app.get('/',function(req, res){
	res.render('index');
});


app.listen(8000,function(){
	console.log("Port 8000")
});

