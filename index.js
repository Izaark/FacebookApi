//398599473860653
//bff1e13cb4471f60ba85c991c253cb8e

var express = require("express");
var bodyParser = require("body-parser");
var passport = require("passport");
var cookieSession = require("cookie-session");
var Strategy = require("passport-facebook").Strategy;
var graph = require("fbgraph");
var User = require('./models/user');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieSession({ keys: ['','Y1tvfA3'] }));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','pug')



//auth setting
passport.use(new Strategy({
	clientID: '398599473860653',
	clientSecret: 'bff1e13cb4471f60ba85c991c253cb8e',
	callbackURL: 'http://localhost:8000/auth/facebook/callback'
	},function(accessToken,refreshToken, profile, cb){

		//Save user

		User.findOrCreate({uid: profile.id},
		{name: profile.displayName, provider:"facebook"},function(err,user){

				var userSession = {
					accessToken: accessToken,
					profile: user
				}

				return cb(null,userSession);

		});

}));


passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

//Define el flujo de auth

//inicia auth y redirige a facebook
app.get('/auth/facebook',passport.authenticate('facebook',{scope: ['publish_actions','user_friends']}));
	

//recive la respuesta de facebook a la ruta de nuestra pagina
app.get('/auth/facebook/callback',passport.authenticate('facebook',{failureRedirect: '/'}),
	function(req,res){
		console.log(req.session);
		res.redirect('/');
	});

app.get("/auth/close",function(req,res){
	req.logout();
	res.redirect("/");
})

app.get('/',function(req, res){
	if (typeof req.session.passport == "undefined" || !req.session.passport.user) {
			res.render('index');
	}
	else{
		res.render('home')
	}
});


//Publicar
app.post("/logros",function(req,res){
	var publicacion = { message: req.body.logro };

	graph.setAccessToken(req.session.passport.user.accessToken);

	// Enviarselo a Facebook
	graph.post("/feed",publicacion,function(err,graphResponse){
		console.log(graphResponse);
		res.redirect("/");
	});

});

//Amigos

app.get("/friends",function(req, res){
		graph.setAccessToken(req.session.passport.user.accessToken);
		console.log("Tus Amigos !!")
		graph.get("/me/friends",function(err, graphResponse){
			//res.json(graphResponse);

			var ids = graphResponse.data.map(function(aux){
				return aux.id;
			});
//Busca en la collecin de usuarios de mongo mediante los ids que nos da facebook en el json y compara con el uid que guardamos en mongodb
			User.find({
				'uid':{
					$in: ids
				}	
			},function(err, users){
				//Usuarios que se encontraron

				res.render('friends',{users:users})
				console.log(users);
			});
		});

});

app.listen(8000,function(){
	console.log("Port 8000")
});

