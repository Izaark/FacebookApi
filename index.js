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

//auth setting
passport.use(new FacebookStrategy({
	clientID: '398599473860653',
	clientSecret: 'bff1e13cb4471f60ba85c991c253cb8e',
	callbackURL: 'http://localhost:8000/auth/facebook/callback'
	},function(accesToken,brefreshToken, prifile, cb){

		var user = {
			accesToken: accesToken,
			profile: prifile

		}
		cb(null, user);
	}

));

//Save user
passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

//Define el flujo de auth

//inicia auth y redirige a facebook
app.get('/auth/facebook',
	passport.authenticate('facebook',{}));

//recive la respuesta de facebook a la ruta de nuestra pagina
app.get('/auth/facebook/callback',
	passport.authenticate('facebook',{failureRedirect: '/'}),
	function(req,res){
		console.log(req.session);
		res.redirect('/');
	});

app.listen(8000,function(){
	console.log("Port 8000")
});

