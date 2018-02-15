var express=require('express'),
	body=require('body-parser'),
	users=require('./models/user'),
	blogs=require('./models/blog'),
	db=require('mongoose'),
	session=require('express-session'),
	methodOverride=require('method-override'),
	passport=require('passport'),
	LocalStrategy=require('passport-local'),
	redis=require('redis'),
	app=express();


app.set('view engine','ejs');
app.use(body.urlencoded({extended:true}));
app.use(express.static('./file'));
app.use(body.json());
app.use(methodOverride("_method"));
// db.connect('mongodb://localhost/image');
// db.connect('mongodb://localhost/cypher');
db.connect('mongodb://devil:devil123@ds261527.mlab.com:61527/cypher');	

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
	var redis = require("redis").createClient(rtg.port, rtg.hostname,rtg.password);

	redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis").createClient();
}

app.use(session({
    secret:"Cypher attendance System.!",
    resave:false,
	saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());


app.use(function(req,res,next)
{
	res.locals.formatTitle=require('format-title');
	res.locals.moment=require('moment');
	res.locals.user=req.user;
	next();
});

var attendanceRoute=require('./models/attendance'),
	newRoute=require('./models/addstudent'),
	signRoute=require('./models/sign'),
	detailRoute=require('./models/details');
	postRoute=require('./models/post');

app.use('/markAttendance',attendanceRoute);
app.use('/addStudents',newRoute);
app.use('/studentDetails',detailRoute);
app.use('/sign',signRoute);
app.use('/',postRoute);

app.get('*',function(req,res)
{
	res.redirect('/');
});


var user=new users({
	name:'himanshu singh',
	username:'devil202',
	password:'@#himanshu#',
	role:'admin',
	gender:'male',
	contact:'7508276344',
	email:'hranjansingh@gmail.com',
});
users.register(user,user.password,function(error,user){
	if (error) {console.log(error)}
	else console.log(user);	
});



const port=process.env.PORT||3000;

app.listen(port,function() 
{
	console.log("Server Started!!");
});